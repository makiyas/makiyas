import asyncHandler from "express-async-handler";
import maincategory from "../models/maincategoryModel.js";

// @desc    Fetch all maincategory
// @route   GET /api/maincategory
// @access  Public
const getMaincategory = asyncHandler(async (req, res) => {
  const maincategorys = await maincategory.find({});

  res.json({ maincategorys });
});

// @desc    Delete a maincategory
// @route   DELETE /api/maincategory/:id
// @access  Private/Admin
const deleteMaincategory = asyncHandler(async (req, res) => {
  const maincategory = await maincategory.findById(req.params.id);

  if (maincategory) {
    await maincategory.remove();
    res.json({ message: "maincategory removed" });
  } else {
    res.status(404);
    throw new Error("maincategory not found");
  }
});

// @desc    Create a maincategory
// @route   POST /api/maincategory
// @access  Private/Admin
const createMaincategory = asyncHandler(async (req, res) => {
  const _maincategory = await maincategory.find({ name: req.body.name });
  if (_maincategory.length > 0) {
    res.status(201).json({ message: "Color already exist" });
    return;
  }

  const maincategory = new maincategory({
    name: req.body.name,
  });

  const createdMaincategory = await maincategory.save();
  res.status(201).json(createdMaincategory);
});

// @desc    Update a maincategory
// @route   PUT /api/maincategory/:id
// @access  Private/Admin
const updateMaincategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const _maincategory = await Maincategory.find({ name: req.body.name });
  if (_maincategory.length > 0) {
    res.status(201).json({ message: "Color already exist" });
    return;
  }

  const maincategory = await Maincategory.findById(req.params.id);

  if (maincategory) {
    maincategory.name = name;

    const updatedmaincategory = await maincategory.save();
    res.json(updatedmaincategory);
  } else {
    res.status(404);
    throw new Error("maincategory not found");
  }
});

export { getMaincategory, deleteMaincategory, createMaincategory, updateMaincategory };
