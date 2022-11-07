import mongoose from "mongoose";

const socialLinksSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const socialLinks = mongoose.model("socialLinks", socialLinksSchema);

export default socialLinks;
