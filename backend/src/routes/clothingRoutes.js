const express = require('express');
const router = express.Router();
const {
  createClothing,
  getClothes,
  getClothingById,
  updateClothing,
  deleteClothing
} = require('../controllers/clothingController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createClothing)
  .get(optionalProtect, getClothes);

router.route('/:id')
  .get(optionalProtect, getClothingById)
  .put(protect, updateClothing)
  .delete(protect, deleteClothing);

module.exports = router;
