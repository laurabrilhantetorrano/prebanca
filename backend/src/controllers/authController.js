const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'chave_secreta_padrao_para_desenvolvimento';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// @desc   Registrar novo usuário
// @route  POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
  try {
    const name = req.body.name || req.body.username;
    const email = req.body.email;
    const password = req.body.password || req.body.senha;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Por favor, preencha todos os campos obrigatórios (nome, e-mail e senha).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Por favor, insira um e-mail válido (ex: nome@email.com).'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'A senha deve conter pelo menos 6 caracteres.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        message: 'Já existe uma conta cadastrada com este e-mail.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Autenticar usuário e obter token
// @route  POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const identifier = req.body.email || req.body.username;
    const password = req.body.password || req.body.senha;

    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Por favor, informe seu e-mail/usuário e senha.'
      });
    }

    const normalizedIdentifier = identifier.toLowerCase().trim();

    // Permite login por email ou por nome de usuário
    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { name: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        message: 'E-mail ou senha inválidos'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'E-mail ou senha inválidos'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Obter dados do usuário logado
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
