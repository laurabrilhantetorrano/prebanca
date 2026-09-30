const mongoose = require('mongoose');
const Clothing = require('../models/Clothing');

// Valida se o ID fornecido é um ObjectId válido do MongoDB
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc   Cadastrar nova roupa para o usuário autenticado
// @route  POST /api/clothes
// @access Private
const createClothing = async (req, res, next) => {
  try {
    const name = req.body.name || req.body.nome;
    const category = req.body.category || req.body.categoria || 'Geral';
    const color = req.body.color || req.body.cor || 'Padrão';
    const size = req.body.size || req.body.tamanho || 'M';
    const image = req.body.image || req.body.img;
    const price = req.body.price || req.body.preco || 'R$ 0,00';
    const oldPrice = req.body.oldPrice || req.body.precoAntigo || '';
    const description = req.body.description || req.body.desc || '';
    const isPublic = req.body.isPublic === true || req.body.isPublic === 'true';

    if (!name || !image) {
      return res.status(400).json({
        message: 'Nome e imagem da roupa são obrigatórios.'
      });
    }

    const clothing = await Clothing.create({
      name: name.trim(),
      category: category.trim(),
      color: color.trim(),
      size: size.trim(),
      image: image.trim(),
      price: price.trim(),
      oldPrice: oldPrice.trim(),
      description: description.trim(),
      userId: req.user._id,
      isPublic
    });

    return res.status(201).json({
      message: 'Roupa cadastrada com sucesso',
      clothing
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Listar roupas do usuário autenticado (ou catálogo público se especificado)
// @route  GET /api/clothes
// @access Private (suporta escopo de catálogo público)
const getClothes = async (req, res, next) => {
  try {
    let query = {};

    // Se o cliente solicitar o catálogo público
    if (req.query.catalog === 'true' || req.query.public === 'true') {
      if (req.user) {
        query = {
          $or: [{ isPublic: true }, { userId: req.user._id }]
        };
      } else {
        query = { isPublic: true };
      }
    } else {
      // Padrão obrigatório conforme especificação: somente roupas do usuário logado
      if (!req.user) {
        return res.status(401).json({
          message: 'Não autorizado, token não fornecido'
        });
      }
      query = { userId: req.user._id };
    }

    // Filtro opcional por categoria ou cor
    if (req.query.category) {
      query.category = new RegExp(req.query.category, 'i');
    }
    if (req.query.search) {
      query.name = new RegExp(req.query.search, 'i');
    }

    const clothes = await Clothing.find(query).sort({ createdAt: -1 });

    return res.status(200).json(clothes);
  } catch (error) {
    return next(error);
  }
};

// @desc   Buscar uma roupa pelo ID
// @route  GET /api/clothes/:id
// @access Private
const getClothingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        message: 'Roupa não encontrada'
      });
    }

    const clothing = await Clothing.findById(id);

    if (!clothing) {
      return res.status(404).json({
        message: 'Roupa não encontrada'
      });
    }

    // Se a roupa for privada e pertencer a outro usuário
    if (
      !clothing.isPublic &&
      (!req.user || clothing.userId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        message: 'Acesso negado: esta roupa pertence a outro usuário'
      });
    }

    return res.status(200).json(clothing);
  } catch (error) {
    return next(error);
  }
};

// @desc   Editar uma roupa (somente do usuário autenticado)
// @route  PUT /api/clothes/:id
// @access Private
const updateClothing = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        message: 'Roupa não encontrada'
      });
    }

    const clothing = await Clothing.findById(id);

    if (!clothing) {
      return res.status(404).json({
        message: 'Roupa não encontrada'
      });
    }

    // Verificação estrita de posse
    if (clothing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Acesso negado: você só pode editar suas próprias roupas'
      });
    }

    if (req.body.name !== undefined || req.body.nome !== undefined) {
      clothing.name = (req.body.name || req.body.nome).trim();
    }
    if (req.body.category !== undefined || req.body.categoria !== undefined) {
      clothing.category = (req.body.category || req.body.categoria).trim();
    }
    if (req.body.color !== undefined || req.body.cor !== undefined) {
      clothing.color = (req.body.color || req.body.cor).trim();
    }
    if (req.body.size !== undefined || req.body.tamanho !== undefined) {
      clothing.size = (req.body.size || req.body.tamanho).trim();
    }
    if (req.body.image !== undefined || req.body.img !== undefined) {
      clothing.image = (req.body.image || req.body.img).trim();
    }
    if (req.body.price !== undefined || req.body.preco !== undefined) {
      clothing.price = (req.body.price || req.body.preco).trim();
    }
    if (req.body.oldPrice !== undefined || req.body.precoAntigo !== undefined) {
      clothing.oldPrice = (req.body.oldPrice || req.body.precoAntigo).trim();
    }
    if (req.body.description !== undefined || req.body.desc !== undefined) {
      clothing.description = (req.body.description || req.body.desc).trim();
    }
    if (req.body.isPublic !== undefined) {
      clothing.isPublic = req.body.isPublic === true || req.body.isPublic === 'true';
    }

    const updated = await clothing.save();

    return res.status(200).json({
      message: 'Roupa atualizada com sucesso',
      clothing: updated
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Excluir uma roupa (somente do usuário autenticado)
// @route  DELETE /api/clothes/:id
// @access Private
const deleteClothing = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        message: 'Roupa não encontrada'
      });
    }

    const clothing = await Clothing.findById(id);

    if (!clothing) {
      return res.status(404).json({
        message: 'Roupa não encontrada'
      });
    }

    // Verificação estrita de posse
    if (clothing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Acesso negado: você só pode excluir suas próprias roupas'
      });
    }

    await clothing.deleteOne();

    return res.status(200).json({
      message: 'Roupa excluída com sucesso',
      id
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createClothing,
  getClothes,
  getClothingById,
  updateClothing,
  deleteClothing
};
