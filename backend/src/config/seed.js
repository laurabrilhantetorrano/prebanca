const User = require('../models/User');
const Clothing = require('../models/Clothing');

const initialClothes = [
  {
    name: 'Body + Corpete Bege',
    category: 'Body',
    color: 'Bege',
    size: 'M',
    image: '/src/assets/produto1.png',
    price: 'R$ 105,00',
    oldPrice: '',
    description: 'Lindo body com corpete bege, perfeito para ocasiões especiais. Tecido confortável de alta durabilidade.',
    isPublic: true
  },
  {
    name: 'Camisa Social',
    category: 'Camisa',
    color: 'Branco',
    size: 'M',
    image: '/src/assets/produto2.png',
    price: 'R$ 59,90',
    oldPrice: 'R$ 119,90',
    description: 'Camisa social elegante de algodão. Ideal para o dia a dia no trabalho ou eventos formais.',
    isPublic: true
  },
  {
    name: 'Calça Jogger',
    category: 'Calça',
    color: 'Preto',
    size: 'M',
    image: '/src/assets/produto3.png',
    price: 'R$ 89,90',
    oldPrice: '',
    description: 'Calça jogger super estilosa com ajuste na cintura. Conforto e moda andam juntos aqui.',
    isPublic: true
  },
  {
    name: 'Moletom Cinza',
    category: 'Moletom',
    color: 'Cinza',
    size: 'G',
    image: '/src/assets/produto4.png',
    price: 'R$ 85,00',
    oldPrice: '',
    description: 'Moletom cinza flanelado perfeito para os dias mais frios. Caimento perfeito e muito quentinho.',
    isPublic: true
  },
  {
    name: 'Blusa feminina',
    category: 'Blusa',
    color: 'Menta',
    size: 'P',
    image: '/src/assets/produto5.jpeg',
    price: 'R$ 42,00',
    oldPrice: '',
    description: 'Blusa menta estilosa com saia para um visual casual.',
    isPublic: true
  },
  {
    name: 'Conjunto Verão',
    category: 'Conjunto',
    color: 'Amarelo',
    size: 'M',
    image: '/src/assets/produto6.jpeg',
    price: 'R$ 135,00',
    oldPrice: '',
    description: 'Conjunto de camisa bata e shorts fresquinho para o verão.',
    isPublic: true
  },
  {
    name: 'Pijama Infantil Sereia',
    category: 'Pijama',
    color: 'Rosa',
    size: 'P',
    image: '/src/assets/produto7.jpeg',
    price: 'R$ 65,00',
    oldPrice: '',
    description: 'Pijama de sereia divertido e super confortável.',
    isPublic: true
  },
  {
    name: 'Pijama Infantil Sweet Dreams',
    category: 'Pijama',
    color: 'Verde-Menta',
    size: 'M',
    image: '/src/assets/produto8.jpeg',
    price: 'R$ 69,00',
    oldPrice: '',
    description: 'Pijama verde-menta macio para noites tranquilas.',
    isPublic: true
  }
];

const seedInitialData = async () => {
  try {
    const usersCount = await User.countDocuments();
    let defaultUser;

    if (usersCount === 0) {
      defaultUser = await User.create({
        name: 'Nana & Mimi Moda Infantil',
        email: 'admin@nanaemimi.com',
        password: 'senha123admin'
      });
      console.log('[Seed] Usuário administrador padrão criado com sucesso: admin@nanaemimi.com');
    } else {
      defaultUser = await User.findOne();
    }

    const clothesCount = await Clothing.countDocuments();
    if (clothesCount === 0 && defaultUser) {
      const clothesWithUser = initialClothes.map((item) => ({
        ...item,
        userId: defaultUser._id
      }));

      await Clothing.insertMany(clothesWithUser);
      console.log(`[Seed] ${clothesWithUser.length} roupas iniciais inseridas no MongoDB com sucesso!`);
    }
  } catch (error) {
    console.error('[Seed] Aviso ao semear dados iniciais:', error.message);
  }
};

module.exports = { seedInitialData };
