import asyncHandler from "express-async-handler";
import Sldier from "../models/sliderkids.js";

// @desc    Fetch all colour
// @route   GET /api/colour
// @access  Public
const getSliderkids = asyncHandler(async (req, res) => {
  const links = await Sldier.find({});
  res.json({ images: links[0] });
});

// @desc    Create a Colour
// @route   POST /api/Colour
// @access  Private/Admin
const addSliderkids = asyncHandler(async (req, res) => {
  const newsliderkids = new Sldier({
    image: req.body.image,
  });

  const creatednewsliderkids = await newsliderkids.save();
  res.status(201).json(creatednewsliderkids);
});

// @desc    Update a colour
// @route   PUT /api/colour/:id
// @access  Private/Admin
const updateSliderkids = asyncHandler(async (req, res) => {
  const sliderkidss = await Sldier.find({});
  const updatesliderkidss = await Sldier.findById(sliderkidss[0]._id);

  if (updatesliderkidss) {
    updatesliderkidss.image = req.body.image;

    const updatedLink = await updatesliderkidss.save();
    res.json(updatedLink);
  } else {
    res.status(404);
    throw new Error("Link not found");
  }
});

export { addSliderkids, getSliderkids, updateSliderkids };
