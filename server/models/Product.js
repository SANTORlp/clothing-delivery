const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    validate: {
      validator: function(value) {
        return value < this.price;
      },
      message: 'Discount price must be less than regular price'
    }
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: [
      'men',
      'women',
      'kids',
      'accessories',
      'shoes',
      'sportswear',
      'formal',
      'casual'
    ]
  },
  subcategory: {
    type: String,
    required: [true, 'Please provide a product subcategory']
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand name']
  },
  sizes: [{
    size: {
      type: String,
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size']
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  specifications: {
    material: String,
    careInstructions: String,
    origin: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create text index for search
productSchema.index({ 
  name: 'text', 
  description: 'text',
  brand: 'text',
  category: 'text',
  tags: 'text'
});

// Virtual for getting the main image
productSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg ? mainImg.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.sizes.some(size => size.quantity > 0);
});

// Virtual for getting the price after discount
productSchema.virtual('finalPrice').get(function() {
  return this.discountPrice || this.price;
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating with findOneAndUpdate
productSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Product', productSchema);
