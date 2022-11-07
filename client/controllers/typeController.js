import asyncHandler from "express-async-handler";
import Type from "../models/typeModel.js";

// @desc    Fetch all type
// @route   GET /api/type
// @access  Public
const getType = asyncHandler(async (req, res) => {
  const types = await Type.find({});

  res.json({ types });
});

// @desc    Delete a type
// @route   DELETE /api/type/:id
// @access  Private/Admin
const deleteType = asyncHandler(async (req, res) => {
  const type = await Type.findById(req.params.id);

  if (type) {
    await type.remove();
    res.json({ message: "type removed" });
  } else {
    res.status(404);
    throw new Error("type not found");
  }
});

// @desc    Create a Type
// @route   POST /api/Type
// @access  Private/Admin
const createType = asyncHandler(async (req, res) => {
  const type = new Type({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    discover: req.body.discover,
  });

  const createdType = await type.save();
  res.status(201).json(createdType);
});

// @desc    Update a type
// @route   PUT /api/type/:id
// @access  Private/Admin
const updateType = asyncHandler(async (req, res) => {
  const { name, description, image, discover } = req.body;

  const type = await Type.findById(req.params.id);

  if (type) {
    type.name = name;

    type.description = description;
    type.image = image;
    type.discover = discover || type.discover;

    const updatedType = await type.save();
    res.json(updatedType);
  } else {
    res.status(404);
    throw new Error("type not found");
  }
});

export { getType, deleteType, createType, updateType };
