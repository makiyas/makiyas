import asyncHandler from "express-async-handler";
import cron from "node-cron";
import Sales from "../models/saleModel.js";

// @desc    Fetch all sales
// @route   GET /api/sale
// @access  Public
const getSales = asyncHandler(async (req, res) => {
  const sale = await Sales.find().populate("products");

  if (sale) {
    res.json(sale);
  } else {
    res.status(404);
    throw new Error("sale not found");
  }
});

// @desc    Fetch single sale
// @route   GET /api/sale/:id
// @access  Public
const getSalesById = asyncHandler(async (req, res) => {
  const sale = await Sales.findById(req.params.id);

  if (sale) {
    res.json(sale);
  } else {
    res.status(404);
    throw new Error("sale not found");
  }
});
// @desc    Fetch single sale
// @route   GET /api/sale/:id
// @access  Public
const getSalesByCron = asyncHandler(async (req, res) => {
  cron.schedule("1,2,4,5 * * * *", () => {
    console.log("running every minute 1, 2, 4 and 5");
  });
});

// @desc    create sale
// @route   POST /api/sale
// @access  Admin

const createSales = asyncHandler(async (req, res) => {
  const timeGet = new Date(req.body.startDate);
  let minutesStart = timeGet.getMinutes();
  let hourStart = timeGet.getHours();
  let dateStart = timeGet.getDate();
  let monthStart = timeGet.getMonth();
  const sale = new Sales({
    name: req.body.name,
    image: req.body.images,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    products: req.body.products,
  });

  // `${minutesStart} ${hourStart} ${dateStart} ${monthStart + 1} *`,
  // "May 15, 2021 21:45:00"

  let newSale = await sale.save();
  cron.schedule(`* * ${dateStart} ${monthStart + 1} *`, () => {
    newSale.status = true;
    newSale.save();
    console.log("task is done");
  });

  if (newSale) {
    res.json(newSale);
  } else {
    res.status(400);
    throw new Error("bad request");
  }
});

// @desc    Update a sale
// @route   PUT /api/sale/:id
// @access  Private/Admin
const updateSale = asyncHandler(async (req, res) => {
  const { name, image, status, startDate, endDate, products } = req.body;

  const sale = await Sales.findById(req.params.id);

  if (sale) {
    sale.name = name;
    sale.image = image;
    sale.status = status;
    sale.startDate = startDate;
    sale.endDate = endDate;

    const updatedsale = await sale.save();
    res.json(updatedsale);
  } else {
    res.status(404);
    throw new Error("sale not found");
  }
});

// @desc    Delete a Sale
// @route   DELETE /api/sale/:id
// @access  Private/Admin
const deleteSale = asyncHandler(async (req, res) => {
  const sale = await Sales.findById(req.params.id);

  if (sale) {
    await sale.remove();
    res.json({ message: "Sale removed" });
  } else {
    res.status(404);
    throw new Error("Sale not found");
  }
});

export { getSales, getSalesById, createSales, updateSale, deleteSale };
