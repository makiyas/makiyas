import mongoose from "mongoose";

const saleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
