import asyncHandler from "express-async-handler";
import axios from "axios";

// @desc    Fetch all colour
// @route   GET /api/colour
// @access  Public
const getCities = asyncHandler(async (req, res) => {
  const cities = await axios.get(`${process.env.TCS_API}/cities`, {
    headers: {
      "X-IBM-Client-Id": process.env.TCS_API_KEY,
    },
  });

  res.json({ ...cities.data });
});

export { getCities };
