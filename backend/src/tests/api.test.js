const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'segredo_de_teste_super_seguro_123';
process.env.NODE_ENV = 'test';

const app = require('../app');
const User = require('../models/User');
const Clothing = require('../models/Clothing');

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('=== SUITE DE TESTES DO BACKEND (TCC) ===', () => {
  let user1Token;
  let user1Id;
  let user2Token;
  let user2Id;
  let clothing1Id;

  // -------------------------------------------------------------
  // TESTES DE AUTENTICAÇÃO
  // -------------------------------------------------------------
  describe('Autenticação e Usuários', () => {
    test('1. Cadastro: Deve registrar um novo usuário com sucesso e retornar token e dados sem senha', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'João da Silva',
          email: 'joao@email.com',
          password: 'senhaSegura123'
        });

      assert.equal(res.status, 201);
      assert.ok(res.body.token, 'Deve retornar o token JWT');
      assert.ok(res.body.user, 'Deve retornar o objeto user');
      assert.equal(res.body.user.name, 'João da Silva');
      assert.equal(res.body.user.email, 'joao@email.com');
      assert.equal(res.body.user.password, undefined, 'Nunca deve retornar a senha');

      // Verifica se o usuário foi salvo no banco e com senha criptografada
      const dbUser = await User.findOne({ email: 'joao@email.com' });
      assert.ok(dbUser);
      assert.notEqual(dbUser.password, 'senhaSegura123', 'A senha deve ser criptografada com hash');

      user1Token = res.body.token;
      user1Id = res.body.user.id;
    });

    test('2. Cadastro com e-mail existente: Deve impedir cadastro duplicado e retornar erro 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'João Clone',
          email: 'joao@email.com',
          password: 'outrasenha123'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.message, /já existe/i);
    });

    test('3. Cadastro com dados inválidos: Deve validar formato do e-mail e tamanho da senha', async () => {
      const resInvalidEmail = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Maria',
          email: 'email-invalido',
          password: '123'
        });

      assert.equal(resInvalidEmail.status, 400);
    });

    test('4. Login: Deve autenticar usuário com e-mail e senha corretos e retornar JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@email.com',
          password: 'senhaSegura123'
        });

      assert.equal(res.status, 200);
      assert.ok(res.body.token);
      assert.equal(res.body.user.email, 'joao@email.com');
      assert.equal(res.body.user.password, undefined);
    });

    test('5. Login com senha errada: Deve recusar com erro 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@email.com',
          password: 'senhaIncorreta'
        });

      assert.equal(res.status, 401);
      assert.match(res.body.message, /inválid/i);
    });

    test('6. Login com e-mail inexistente: Deve recusar com erro 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inexistente@email.com',
          password: 'senhaSegura123'
        });

      assert.equal(res.status, 401);
    });

    test('7. Usuário Logado (GET /api/auth/me): Deve retornar dados do usuário autenticado', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.user.email, 'joao@email.com');
      assert.equal(res.body.user.password, undefined);
    });

    test('8. Acesso sem token: Deve bloquear com status 401', async () => {
      const res = await request(app).get('/api/auth/me');
      assert.equal(res.status, 401);
    });

    test('9. Acesso com token inválido: Deve bloquear com status 401', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token_invalido_totalmente_falso');

      assert.equal(res.status, 401);
    });
  });

  // -------------------------------------------------------------
  // TESTES DE ROUPAS (CRUD E AUTORIZAÇÃO)
  // -------------------------------------------------------------
  describe('CRUD de Roupas e Isolamento por Usuário', () => {
    before(async () => {
      // Cadastra um segundo usuário para testar isolamento de dados
      const resUser2 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Maria Santos',
          email: 'maria@email.com',
          password: 'senhaSeguraMaria123'
        });

      user2Token = resUser2.body.token;
      user2Id = resUser2.body.user.id;
    });

    test('10. Cadastrar Roupa: Usuário 1 cadastra uma roupa e userId é associado', async () => {
      const res = await request(app)
        .post('/api/clothes')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Camiseta Preta Infantil',
          category: 'Camiseta',
          color: 'Preto',
          size: 'M',
          image: 'https://exemplo.com/camiseta.jpg',
          price: 'R$ 49,90',
          description: 'Camiseta 100% algodão super confortável.'
        });

      assert.equal(res.status, 201);
      assert.ok(res.body.clothing);
      assert.equal(res.body.clothing.name, 'Camiseta Preta Infantil');
      assert.equal(res.body.clothing.userId.toString(), user1Id.toString());

      clothing1Id = res.body.clothing.id || res.body.clothing._id;
    });

    test('11. Cadastro de Roupa sem autenticação: Deve retornar 401', async () => {
      const res = await request(app)
        .post('/api/clothes')
        .send({
          name: 'Roupa Sem Dono',
          image: 'https://exemplo.com/semdono.jpg'
        });

      assert.equal(res.status, 401);
    });

    test('12. Listar Roupas: Usuário 1 deve listar apenas suas próprias roupas', async () => {
      // Usuário 2 cadastra sua própria roupa
      await request(app)
        .post('/api/clothes')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'Vestido Florido da Maria',
          image: 'https://exemplo.com/vestido.jpg'
        });

      // Usuário 1 busca suas roupas
      const resUser1 = await request(app)
        .get('/api/clothes')
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(resUser1.status, 200);
      assert.ok(Array.isArray(resUser1.body));
      // Todas as roupas listadas devem pertencer ao Usuário 1
      resUser1.body.forEach((item) => {
        assert.equal(item.userId.toString(), user1Id.toString());
      });

      // Usuário 2 busca suas roupas
      const resUser2 = await request(app)
        .get('/api/clothes')
        .set('Authorization', `Bearer ${user2Token}`);

      assert.equal(resUser2.status, 200);
      resUser2.body.forEach((item) => {
        assert.equal(item.userId.toString(), user2Id.toString());
      });
    });

    test('13. Buscar por ID: Deve retornar os detalhes da roupa', async () => {
      const res = await request(app)
        .get(`/api/clothes/${clothing1Id}`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'Camiseta Preta Infantil');
      // Aliases em português presentes
      assert.equal(res.body.nome, 'Camiseta Preta Infantil');
      assert.equal(res.body.preco, 'R$ 49,90');
    });

    test('14. Roupa inexistente: Deve retornar 404', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/clothes/${nonExistentId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 404);
      assert.match(res.body.message, /não encontrada/i);
    });

    test('15. Editar Roupa: Usuário 1 edita com sucesso sua própria roupa', async () => {
      const res = await request(app)
        .put(`/api/clothes/${clothing1Id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Camiseta Preta Infantil - Edição Especial',
          price: 'R$ 55,00'
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.clothing.name, 'Camiseta Preta Infantil - Edição Especial');
      assert.equal(res.body.clothing.price, 'R$ 55,00');
    });

    test('16. Segurança: Usuário 2 tenta editar roupa do Usuário 1 -> Bloqueado com 403', async () => {
      const res = await request(app)
        .put(`/api/clothes/${clothing1Id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'Tentativa de Hack'
        });

      assert.equal(res.status, 403);
      assert.match(res.body.message, /você só pode editar suas próprias roupas/i);
    });

    test('17. Segurança: Usuário 2 tenta excluir roupa do Usuário 1 -> Bloqueado com 403', async () => {
      const res = await request(app)
        .delete(`/api/clothes/${clothing1Id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      assert.equal(res.status, 403);
      assert.match(res.body.message, /você só pode excluir suas próprias roupas/i);
    });

    test('18. Excluir Roupa: Usuário 1 exclui com sucesso sua própria roupa', async () => {
      const res = await request(app)
        .delete(`/api/clothes/${clothing1Id}`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.match(res.body.message, /excluída com sucesso/i);

      // Confirma que não existe mais no banco
      const checkRes = await request(app)
        .get(`/api/clothes/${clothing1Id}`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(checkRes.status, 404);
    });
  });
});
