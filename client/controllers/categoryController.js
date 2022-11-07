import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

// @desc    Fetch all category
// @route   GET /api/category
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const pageSize = 100;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Category.countDocuments({ ...keyword });
  const categories = await Category.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ categories, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single category
// @route   GET /api/category/name
// @access  Public
const getCategoryByName = asyncHandler(async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const category = await Category.find({ name: name });

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});
// @desc    Fetch products by category
// @route   GET /api/category/:id/products
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const id = [req.params.id];
  const category = await Product.find({ category: { $all: id } });
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});
// @desc    Fetch products by category
// @route   GET /api/category/:id/products/type
// @access  Public
const getProductsByType = asyncHandler(async (req, res) => {
  const id = [req.params.id];
  const { typeOfProduct } = req.body;
  console.log(typeOfProduct, "...........");
  const category = await Product.find({
    $and: [
      { category: { $all: id } },
      { typeProduct: { $all: "Unstitched Lawn" } },
    ],
  });

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});
// @desc    Fetch products by category
// @route   GET /api/category/:name/products/colour
// @access  Public
const getProductsByColour = asyncHandler(async (req, res) => {
  const id = [req.params.id];
  const { colours } = req.body;
  const category = await Product.find({
    $and: [{ category: { $all: id } }, { colour: { $all: colours } }],
  });

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});
// @desc    Fetch products by category
// @route   GET /api/category/:name/products/fabric
// @access  Public
const getProductsByFabric = asyncHandler(async (req, res) => {
  const id = [req.params.id];
  const { fabric } = req.body;
  const category = await Product.find({
    $and: [{ category: { $all: id } }, { fabric: { $all: colours } }],
  });

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});

// @desc    Fetch products by category
// @route   GET /api/category/:name/products/price
// @access  Public
const getProductsByPriceRange = asyncHandler(async (req, res) => {
  const id = [req.params.id];
  const { startPrice, endPrice } = req.body;
  const category = await Product.find({
    $and: [
      { category: { $all: id } },
      { price: { $gte: startPrice } },
      { price: { $lte: endPrice } },
    ],
  });

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});

// Now find by ID

// @desc    Fetch single category
// @route   GET /api/category/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});

// @desc    Delete a category
// @route   DELETE /api/category/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.remove();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Create a category
// @route   POST /api/category
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: req.body.name,
    main: req.body.main,
    image: req.body.image,
    description: req.body.description,
    discover: req.body.discover,
    headerMessage: req.body.headerMessage,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update a category
// @route   PUT /api/category/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, image, discover, headerMessage } = req.body;
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name;
    
      category.description = description;
      category.image = image;
      category.headerMessage = headerMessage;
      category.discover = discover || category.discover;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404);
      throw new Error("category not found");
    }
  } catch (error) {
    console.log(error);
  }
});

export {
  getCategory,
  getCategoryByName,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
  getProductsByCategory,
  getProductsByPriceRange,
  getProductsByColour,
  getProductsByType,
  getProductsByFabric,
};
