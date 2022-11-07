import asyncHandler from "express-async-handler";
import Sldier from "../models/slidermen.js";

// @desc    Fetch all colour
// @route   GET /api/colour
// @access  Public
const getSlidermen = asyncHandler(async (req, res) => {
  const links = await Sldier.find({});
  res.json({ images: links[0] });
});

// @desc    Create a Colour
// @route   POST /api/Colour
// @access  Private/Admin
const addSlidermen = asyncHandler(async (req, res) => {
  const newslidermen = new Sldier({
    image: req.body.image,
  });

  const creatednewslidermen = await newslidermen.save();
  res.status(201).json(creatednewslidermen);
});

// @desc    Update a colour
// @route   PUT /api/colour/:id
// @access  Private/Admin
const updateSlidermen = asyncHandler(async (req, res) => {
  const slidermens = await Sldier.find({});
  const updateslidermens = await Sldier.findById(slidermens[0]._id);

  if (updateslidermens) {
    updateslidermens.image = req.body.image;

    const updatedLink = await updateslidermens.save();
    res.json(updatedLink);
  } else {
    res.status(404);
    throw new Error("Link not found");
  }
});

export { addSlidermen, getSlidermen, updateSlidermen };
