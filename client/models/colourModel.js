import mongoose from "mongoose";

const colourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Colour = mongoose.model("Colour", colourSchema);

export default Colour;
