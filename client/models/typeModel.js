import mongoose from "mongoose";

const typeSchema = mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
    },
  },

);

const Type = mongoose.model("type", typeSchema);

export default Type;
