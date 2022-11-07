import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: Array,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    size: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    warning: {
      type: String,
      required: true,
    },
    colour: {
      type: Array,
      required: true,
    },
    fabric: {
      type: String,
      required: false,
    },

    description: {
      type: Array,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    smallInStock: {
      type: Number,
      default: 0,
    },
    mediumInStock: {
      type: Number,
      default: 0,
    },
    largeInStock: {
      type: Number,
      default: 0,
    },
    xlargeInStock: {
      type: Number,
      default: 0,
    },

    sale: {
      type: Number,
      required: true,
      default: "0",
    },
    typeProduct: {
      type: String,
      required: true,
      default: "Stitched",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
