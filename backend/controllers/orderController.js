import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import connectDB from "../config/db.js";
import Stripe from "stripe";
import axios from "axios";

const stripe = new Stripe(
  "please paste stripe secret key or get from env file"
);

// @desc    Create new order using stripe
// @route   POST /api/orders
// @access  Private
const addOrderItemsUsingStripe = asyncHandler(async (req, res) => {
  const orderedUser = await User.findById(req.body.user_id).select("-password");
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  const client = await connectDB();

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const session = await client.startSession();

    const transactionOptions = {
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    };

    try {
      const transactionResult = await session.withTransaction(async () => {
        const payment = await stripe.paymentIntents.create({
          amount: 5000,
          currency: "USD",
          description: "Your Company Description",
          payment_method_types: ["card"],
          payment_method: "pm_card_visa",
          // payment_method: id,
          confirm: true,
        });
        console.log("stripe-routes.js 19 | payment", payment);

        const order = new Order({
          orderItems,
          user: req.body.user_id,
          shippingAddress,
          paymentMethod,
          totalPrice,
        });

        const createdOrder = await order.save();
        //@ For adding user points
        if (
          // orderedUser &&
          // orderedUser.platformFlag == 2 &&
          createdOrder &&
          createdOrder.totalPrice >= 1000
        ) {
          let result = Math.floor(createdOrder.totalPrice / 1000);
          console.log(result);
          orderedUser.earnedPoints = orderedUser.earnedPoints + result;
          await orderedUser.save();
          console.log(orderedUser);
        }

        res.status(201).json(createdOrder);
      }, transactionOptions);

      console.log("process sucessfull");
    } catch (error) {
      console.error("transaction was aborted due to unexpected error!!", error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
  const orderedUser = await User.findById(req.body.user_id).select("-password");
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      orderTCSItems,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      for (const order of orderItems) {
        const item = await Product.findById(order._id);
        if (item) {
          item.countInStock = item.countInStock - order.cartProductQuantity;
          await item.save();
        }
      }

      const { data } = await axios.post(
        `${process.env.TCS_API}/create-order`,
        orderTCSItems,
        {
          headers: {
            "X-IBM-Client-Id": `${process.env.TCS_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.returnStatus.status === "SUCCESS") {
        const CN = /\d+/.exec(data.bookingReply.result)[0];

        const order = new Order({
          orderItems,
          user: req.body.user_id,
          shippingAddress,
          paymentMethod,
          totalPrice,
          cnNumber: CN,
        });

        const createdOrder = await order.save();

        console.log(createdOrder);

        //@ For adding user points
        if (
          // orderedUser &&
          // orderedUser.platformFlag == 2 &&
          createdOrder &&
          createdOrder.totalPrice >= 1000
        ) {
          let result = Math.floor(createdOrder.totalPrice / 1000);
          console.log(result);
          orderedUser.earnedPoints = orderedUser.earnedPoints + result;
          await orderedUser.save();
          console.log(orderedUser);
        }

        res.status(201).json(createdOrder);
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Unable to create order");
    throw new Error("No order items");
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrdersByID = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id });
  res.json(orders);
});

const getOrderStatus = asyncHandler(async (req, res) => {
  if (req.params.id) {
    const { data } = await axios.get(
      `https://api.tcscourier.com/production/track/v1/shipments/detail?consignmentNo=${req.params.id}`,
      {
        headers: {
          "X-IBM-Client-Id": `${process.env.TCS_API_KEY}`,
        },
      }
    );

    res.json({ data });
  }
  res.json(null);
});

export {
  getOrderStatus,
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  addOrderItemsUsingStripe,
  getOrdersByID,
};
