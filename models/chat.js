import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      unique: true,
    },
    chat: [
      {
        receiverID: String,
        senderID: String,
        message: String,
        isAdmin: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
