import asyncHandler from "express-async-handler";
import SocialLinks from "../models/socialLinks.js";

// @desc    Fetch all colour
// @route   GET /api/colour
// @access  Public
const getSocialLinks = asyncHandler(async (req, res) => {
  const links = await SocialLinks.find({});

  res.json({ links });
});

// @desc    Delete a colour
// @route   DELETE /api/colour/:id
// @access  Private/Admin
const deleteSocialLinks = asyncHandler(async (req, res) => {
  const colour = await SocialLinks.findById(req.params.id);

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
const createSocialLinks = asyncHandler(async (req, res) => {
  const links = await SocialLinks.find({
    name: req.body.name,
    url: req.body.url,
  });
  if (links.length > 0) {
    res.status(201).json({ message: "links already exist" });
    return;
  }

  const newlink = new SocialLinks({
    name: req.body.name,
    url: req.body.url,
  });

  const createdLink = await newlink.save();
  res.status(201).json(createdLink);
});

// @desc    Update a colour
// @route   PUT /api/colour/:id
// @access  Private/Admin
const updateSocialLinks = asyncHandler(async (req, res) => {
  const { name, url } = req.body;
  const socialLink = await SocialLinks.find({
    name: req.body.name,
    url: req.body.url,
  });
  if (socialLink.length > 0) {
    res.status(201).json({ message: "Link already exist" });
    return;
  }

  const existLink = await SocialLinks.findById(req.params.id);

  if (existLink) {
    existLink.name = name;
    existLink.url = url;

    const updatedLink = await existLink.save();
    res.json(updatedLink);
  } else {
    res.status(404);
    throw new Error("Link not found");
  }
});

export {
  getSocialLinks,
  deleteSocialLinks,
  createSocialLinks,
  updateSocialLinks,
};
