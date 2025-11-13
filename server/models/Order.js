const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  color: {
    name: String,
    code: String
  },
  image: String
});

const shippingInfoSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

const paymentInfoSchema = new mongoose.Schema({
  id: {
    type: String
  },
  status: {
    type: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'paypal', 'cash_on_delivery'],
    default: 'credit_card'
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paidAt: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingInfo: shippingInfoSchema,
  paymentInfo: paymentInfoSchema,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'processing'
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ 'shippingInfo.phone': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

// Calculate prices before saving
orderSchema.pre('save', async function(next) {
  // Calculate items price
  this.itemsPrice = this.orderItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Calculate shipping price (example: free shipping over $50, otherwise $5)
  this.shippingPrice = this.itemsPrice > 50 ? 0 : 5;

  // Calculate tax (example: 10% tax)
  this.taxPrice = parseFloat((this.itemsPrice * 0.1).toFixed(2));

  // Calculate total price
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;

  // Ensure prices have exactly 2 decimal places
  this.itemsPrice = parseFloat(this.itemsPrice.toFixed(2));
  this.shippingPrice = parseFloat(this.shippingPrice.toFixed(2));
  this.totalPrice = parseFloat(this.totalPrice.toFixed(2));

  next();
});

// Virtual for formatted order status
orderSchema.virtual('statusInfo').get(function() {
  const statusMap = {
    'processing': {
      message: 'Your order is being processed',
      description: 'We have received your order and are preparing it for shipment.',
      progress: 25
    },
    'shipped': {
      message: 'Your order has been shipped',
      description: 'Your package is on its way to you.',
      progress: 50
    },
    'out_for_delivery': {
      message: 'Your order is out for delivery',
      description: 'The courier is on the way to deliver your package.',
      progress: 75
    },
    'delivered': {
      message: 'Your order has been delivered',
      description: 'Your package has been successfully delivered.',
      progress: 100
    },
    'cancelled': {
      message: 'Your order has been cancelled',
      description: 'This order has been cancelled as per your request.',
      progress: 0
    },
    'returned': {
      message: 'Your order has been returned',
      description: 'The returned items have been received and processed.',
      progress: 100
    },
    'refunded': {
      message: 'Your order has been refunded',
      description: 'The refund for your order has been processed.',
      progress: 100
    }
  };

  return statusMap[this.orderStatus] || {
    message: 'Order status unknown',
    description: 'We are unable to determine the status of your order.',
    progress: 0
  };
});

// Method to update stock when order is placed
orderSchema.methods.updateStock = async function() {
  const bulkOps = this.orderItems.map(item => ({
    updateOne: {
      filter: { _id: item.product, 'sizes.size': item.size },
      update: { 
        $inc: { 'sizes.$.quantity': -item.quantity },
        $inc: { 'sold': item.quantity }
      }
    }
  }));

  await mongoose.model('Product').bulkWrite(bulkOps);
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const nonCancellableStatuses = ['shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'];
  return !nonCancellableStatuses.includes(this.orderStatus);
};

module.exports = mongoose.model('Order', orderSchema);
