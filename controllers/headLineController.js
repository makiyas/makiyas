import asyncHandler from "express-async-handler";
import Headline from "../models/headLine.js";

// @desc    Fetch all colour
// @route   GET /api/colour
// @access  Public
const getHeadLine = asyncHandler(async (req, res) => {
  const headline = await Headline.find({});

  res.json({ headline });
});

// @desc    Delete a colour
// @route   DELETE /api/colour/:id
// @access  Private/Admin
// const deleteColour = asyncHandler(async (req, res) => {
//   const colour = await Colour.findById(req.params.id);

//   if (colour) {
//     await colour.remove();
//     res.json({ message: "Colour removed" });
//   } else {
//     res.status(404);
//     throw new Error("Colour not found");
//   }
// });

// @desc    Create a Colour
// @route   POST /api/Colour
// @access  Private/Admin
const createHeadline = asyncHandler(async (req, res) => {
  const { name, EndTime, playAlways, StartTime } = req.body;
  const headLine = new Headline({
    name,
    EndTime,
    playAlways,
    StartTime,
  });

  const createheadLine = await headLine.save();
  res.status(201).json(createheadLine);
});

// @desc    Update a colour
// @route   PUT /api/colour/:id
// @access  Private/Admin
const updateHeadline = asyncHandler(async (req, res) => {
  const { name, EndTime, playAlways, StartTime } = req.body;

  const headline = await Headline.findById(req.params.id);

  if (headline) {
    headline.name = name;
    headline.EndTime = EndTime;
    headline.StartTime = StartTime;
    headline.playAlways = playAlways;

    const updatedheadline = await headline.save();
    res.json(updatedheadline);
  } else {
    res.status(404);
    throw new Error("colour not found");
  }
});

export { getHeadLine, createHeadline, updateHeadline };
