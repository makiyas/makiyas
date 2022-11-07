import mongoose from "mongoose";

const sliderSchema = mongoose.Schema(
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

const Slider = mongoose.model("Slider", sliderSchema);

export default Slider;
