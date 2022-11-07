import asyncHandler from "express-async-handler";
import Chat from "../models/chat.js";

// @desc    Fetch all colour
// @route   GET /api/colour
// @access  Public
const getClients = asyncHandler(async (req, res) => {
  const chat = await Chat.find({});

  res.json({ chat });
});
const getOneClient = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ user: req.params.id });

  res.json({ chat });
});
const deleteOne = asyncHandler(async (req, res) => {
  const chat = await Chat.findOneAndDelete({ user: req.params.id });

  res.json({ chat });
});

export { getClients, getOneClient, deleteOne };
