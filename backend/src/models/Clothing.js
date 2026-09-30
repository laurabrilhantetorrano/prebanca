const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome da roupa é obrigatório'],
      trim: true
    },
    category: {
      type: String,
      default: 'Geral',
      trim: true
    },
    color: {
      type: String,
      default: 'Padrão',
      trim: true
    },
    size: {
      type: String,
      default: 'M',
      trim: true
    },
    image: {
      type: String,
      required: [true, 'A URL ou caminho da imagem é obrigatório'],
      trim: true
    },
    price: {
      type: String,
      default: 'R$ 0,00',
      trim: true
    },
    oldPrice: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A roupa deve pertencer a um usuário']
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        // Aliases em português para compatibilidade total com o frontend existente
        ret.nome = ret.name;
        ret.categoria = ret.category;
        ret.cor = ret.color;
        ret.tamanho = ret.size;
        ret.img = ret.image;
        ret.preco = ret.price;
        ret.precoAntigo = ret.oldPrice;
        ret.desc = ret.description;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Clothing = mongoose.model('Clothing', clothingSchema);

module.exports = Clothing;
