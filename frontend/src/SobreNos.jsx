import React from 'react';
import { Link } from 'react-router-dom';
import {
  CircleUserRound,
  ShoppingCart,
  Search,
  ArrowLeft,
  Shirt,
  LogOut
} from 'lucide-react';

import logo from "./assets/logo.jpg";
import imagemDona from "./assets/fotodona.jpg";
import { useAuth } from './AuthContext';

import './SobreNos.css';

export default function SobreNos() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="app">

      {/* Barra de Navegação */}
      <div className="navbar">

        <Link to="/">
          <img
            src={logo}
            alt="Logo Nana&Mimi"
            className="logo"
          />
        </Link>

        <div className="menu">
          <Link
            to="/sobre-nos"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <span>Sobre nós</span>
          </Link>

          <Link
            to="/contato"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <span>Contato</span>
          </Link>
          <Link to="/"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <span>Roupas</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/minhas-roupas"
              style={{
                textDecoration: "none",
                color: "#1d4ed8",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Shirt size={16} />
              <span>Minhas Roupas</span>
            </Link>
          )}
        </div>

        <div className="container-pesquisa">
          <input
            type="text"
            placeholder="Buscar produto..."
            className="input-pesquisa"
          />

          <Search
            size={18}
            className="icone-lupa"
          />
        </div>

        <div className="icons" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.88em', fontWeight: '600', color: '#374151' }}>
                Olá, {user?.name?.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                title="Sair da conta"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{ color: 'inherit' }}
              title="Fazer Login"
            >
              <CircleUserRound size={30} />
            </Link>
          )}

          <Link
            to="/carrinho"
            style={{ color: 'inherit' }}
          >
            <ShoppingCart size={30} />
          </Link>

        </div>

      </div>


      {/* Conteúdo da página */}
      <main className="sobre-container">


        <h1>Sobre a Nana&Mimi</h1>


        {/* Texto + imagem */}
        <div className="sobre-conteudo">

          <div className="sobre-texto">

            <p>
              A Nana&Mimi nasceu de um sonho que começou no coração de Flavia Mendes: o desejo de empreender, criar algo especial e transformar sua paixão em uma marca capaz de fazer parte de momentos importantes da infância.
            </p>

            <p>
              Somos uma marca de moda infantil criada para vestir crianças de 4 a 12 anos com estilo, conforto e personalidade. Nossa proposta é trazer uma moda infantil moderna, leve e atual, com peças pensadas para acompanhar as crianças em diferentes momentos do dia.
            </p>

            <p>
              Acreditamos que as roupas infantis precisam ir além da beleza. Elas devem permitir que a criança brinque, se movimente, explore e seja criança, sem abrir mão de um visual bonito e cheio de estilo.
            </p>

            <p>
              Na Nana&Mimi, cada detalhe é pensado para oferecer uma experiência especial às famílias. Valorizamos um atendimento próximo e atencioso. Além disso, trabalhamos para oferecer preços acessíveis, tornando a moda infantil moderna e de qualidade mais próxima das famílias.
            </p>

            <p>
              Hoje somos muito mais do que uma loja de roupas infantis. Representa um sonho que ganhou forma e continua sendo construído todos os dias com carinho, propósito e compromisso com nossos clientes.
            </p>

            <p>
              Queremos estar presentes em cada fase, em cada descoberta e em cada momento especial da infância, oferecendo roupas que combinam com a alegria, a espontaneidade e a personalidade de cada criança.
            </p>

          </div>


          {/* Imagem */}
          <div className="sobre-imagem">
            <img
              src={imagemDona}
              alt="Nana&Mimi Moda Infantil"
            />
          </div>

        </div>

      </main>

    </div>
  );
}