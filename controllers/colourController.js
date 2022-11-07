import asyncHandler from "express-async-handler";
import Colour from "../models/colourModel.js";

// @desc    Fetch all colour
// @route   GET /api/colour
// @access  Public
const getColour = asyncHandler(async (req, res) => {
  const colours = await Colour.find({});

  res.json({ colours });
});

// @desc    Delete a colour
// @route   DELETE /api/colour/:id
// @access  Private/Admin
const deleteColour = asyncHandler(async (req, res) => {
  const colour = await Colour.findById(req.params.id);

  if (colour) {
    await colour.remove();
    res.json({ message: "Colour removed" });
  } else {
    res.status(404);
    throw new Error("Colour not found");
  }
});

// @desc    Create a Colour
// @route   POST /api/Colour
// @access  Private/Admin
const createColour = asyncHandler(async (req, res) => {
  const _colour = await Colour.find({ name: req.body.name });
  if (_colour.length > 0) {
    res.status(201).json({ message: "Color already exist" });
    return;
  }

  const colour = new Colour({
    name: req.body.name,
  });

  const createdColour = await colour.save();
  res.status(201).json(createdColour);
});

// @desc    Update a colour
// @route   PUT /api/colour/:id
// @access  Private/Admin
const updateColour = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const _colour = await Colour.find({ name: req.body.name });
  if (_colour.length > 0) {
    res.status(201).json({ message: "Color already exist" });
    return;
  }

  const colour = await Colour.findById(req.params.id);

  if (colour) {
    colour.name = name;

    const updatedColour = await colour.save();
    res.json(updatedColour);
  } else {
    res.status(404);
    throw new Error("colour not found");
  }
});

export { getColour, deleteColour, createColour, updateColour };
