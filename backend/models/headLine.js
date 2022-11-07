import mongoose from "mongoose";

const headlineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    StartTime: {
      type: String,
      required: false,
    },
    EndTime: {
      type: String,
      required: false,
    },
    playAlways: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Colour = mongoose.model("Headline", headlineSchema);

export default Colour;
