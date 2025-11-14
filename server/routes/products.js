const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
  getProductsInRadius
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

router.route('/radius/:zipcode/:distance').get(getProductsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('admin'), productPhotoUpload);

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
