import mongoose from "mongoose";

const sliderkidsSchema = mongoose.Schema(
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

const Sliderkids = mongoose.model("Sliderkids", sliderkidsSchema);

export default Sliderkids;
