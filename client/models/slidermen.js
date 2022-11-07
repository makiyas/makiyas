import mongoose from "mongoose";

const slidermenSchema = mongoose.Schema(
  {
    image: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Slidermen = mongoose.model("Slidermen", slidermenSchema);

export default Slidermen;
