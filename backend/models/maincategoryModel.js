import mongoose from "mongoose";

const maincategorySchema = mongoose.Schema(
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

const Maincategory = mongoose.model("Maincategory", maincategorySchema);

export default Maincategory;
