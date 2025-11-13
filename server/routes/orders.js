const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  cancelOrder
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);

router
  .route('/:id')
  .get(protect, getOrderById);

router
  .route('/:id/pay')
  .put(protect, updateOrderToPaid);

router
  .route('/:id/deliver')
  .put(protect, authorize('admin'), updateOrderToDelivered);

router
  .route('/:id/cancel')
  .put(protect, cancelOrder);

module.exports = router;
