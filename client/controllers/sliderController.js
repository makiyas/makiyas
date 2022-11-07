import asyncHandler from "express-async-handler";
import Sldier from "../models/slider.js";

// @desc    Fetch all colour
// @route   GET /api/colour
// @access  Public
const getSlider = asyncHandler(async (req, res) => {
  const links = await Sldier.find({});
  res.json({ images: links[0] });
});

// @desc    Create a Colour
// @route   POST /api/Colour
// @access  Private/Admin
const addSlider = asyncHandler(async (req, res) => {
  const newslider = new Sldier({
    image: req.body.image,
  });

  const creatednewslider = await newslider.save();
  res.status(201).json(creatednewslider);
});

// @desc    Update a colour
// @route   PUT /api/colour/:id
// @access  Private/Admin
const updateSlider = asyncHandler(async (req, res) => {
  const sliders = await Sldier.find({});
  const updatesliders = await Sldier.findById(sliders[0]._id);

  if (updatesliders) {
    updatesliders.image = req.body.image;

    const updatedLink = await updatesliders.save();
    res.json(updatedLink);
  } else {
    res.status(404);
    throw new Error("Link not found");
  }
});

export { addSlider, getSlider, updateSlider };
