import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import Complaint from "../models/complaintModel.js";
import ReturnExchange from "../models/returnExchangeModel.js";
import Orders from "../models/orderModel.js";
import crypto from "crypto";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import nodemailer from "nodemailer";
import mailer from "../utils/mail.js";

// const smtpTransport = nodemailer.createTransport({
//   service: process.env.EMAIL_FROM,
//   auth: {
//     user: process.env.EMAIL_FROM,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// const smtpTransport = nodemailer.createTransport({
//   service: "gmail",
//   port: 587,
//   auth: {
//     user: "testinghayalawn@gmail.com",
//     pass: "testinghayalawn123",
//   },
// });

const sendEmailWithVerifyLink = (host, email, userExist) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: `${process.env.EMAIL_FROM}, ${email}`,
    subject: "Please confirm your Email account",
    html:
      "here is the OTP code, please enter this code in app, Code: " +
      userExist.usr_hash,
  };
  console.log(mailOptions);
  return { mailOptions };
};

// @desc    Create a Complaint
// @route   POST /api/users
// @access  public
const createComplaintEmail = asyncHandler(async (req, res) => {
  const { collectionName, OutfitName, details, email, name, contact } =
    req.body || {};

  console.log(process.env.EMAIL_FROM);
  console.log(process.env.EMAIL_SERVICE);
  console.log(process.env.EMAIL_PASSWORD);

  const mailOptions = {
    from: email,
    to: `${process.env.EMAIL_FROM}, ${email}`,
    subject: `Complaint from Customer ${new Date()}`,
    html: `<p>collectionName: ${collectionName || ""} </p>
    <p>OutfitName: ${OutfitName || ""} </p>
    <p>details: ${details} </p> 
    <p>name: ${name || " "} </p> 
    <p>contact: ${contact || " "} </p> 
    `,
  };

  console.log(mailOptions);
  try {
    if (email) await mailer(mailOptions);
    const complaintReceived = new Complaint({
      collectionName,
      outfitName: OutfitName,
      complaintDetails: details,
      name,
      contact,
      email,
    });

    await complaintReceived.save();
    res.status(200).json({ message: complaintReceived });
  } catch (err) {
    console.error(err);
    res.status(400);
  }

  // smtpTransport.sendMail(mailOptions, function (error, response) {
  //   if (error) {
  //     console.log("ERRROOO::::", error);
  //     res.status(400).json({ message: "unable to send email" });
  //   } else {
  //     console.log("Message sent: " + response.message);
  //     res.status(200).json({ message: "Please Check your mail" });
  //   }
  // });
});

const addToWishListOfUser = async (req, res) => {
  const { productID } = req.body;

  const userFound = await User.findById(req.params.id);
  if (userFound) {
    if (userFound.addToWishList) {
      userFound.addToWishList.push(productID);
      await userFound.save();
    } else {
      userFound.addToWishList = [productID];
      await userFound.save();
    }
    res.status(200).json({
      message: "successfully added to wish list",
      user: userFound,
    });
  } else {
    res.status(400).json({ message: "user not found" });
  }
};
const removeFromWishListOfUser = async (req, res) => {
  const { productID } = req.body;
  const userFound = await User.findById(req.params.id);
  if (userFound) {
    const totalRecords = userFound.addToWishList;
    userFound.addToWishList = totalRecords.filter((item) => item !== productID);
    await userFound.save();

    res
      .status(200)
      .json({ message: "successfully added to wish list", user: userFound });
  } else {
    res.status(400).json({ message: "user not found" });
  }
};
// @desc    Create a Request
// @route   POST /api/users
// @access  public
const createExchangeRequest = asyncHandler(async (req, res) => {
  const { collectionName, OutfitName, details, email, name, contact } =
    req.body || {};

  console.log(process.env.EMAIL_FROM);
  console.log(process.env.EMAIL_SERVICE);
  console.log(process.env.EMAIL_PASSWORD);

  const mailOptions = {
    from: email,
    to: `${process.env.EMAIL_FROM},hayastudio01@gmail.com, ${email}`,
    subject: `Request of Return/Exchange from Customer ${new Date()}`,
    html: `<p>collectionName: ${collectionName || ""} </p>
    <p>OutfitName: ${OutfitName || ""} </p>
    <p>details: ${details} </p> 
    <p>name: ${name || " "} </p> 
    <p>contact: ${contact || " "} </p> 
    `,
  };

  console.log(mailOptions);
  try {
    if (email) await mailer(mailOptions);
    const complaintReceived = new ReturnExchange({
      collectionName,
      outfitName: OutfitName,
      complaintDetails: details,
      name,
      contact,
      email,
    });

    await complaintReceived.save();
    res.status(200).json({ message: complaintReceived });
  } catch (err) {
    console.error(err);
    res.status(400);
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password, platformFlag } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.json({ errorMessage: "Invalid email or password" });
  }

  if (
    user &&
    (await user.matchPassword(password)) &&
    user.isBlocked &&
    !user.isAdmin
  ) {
    res.json({ errorMessage: "User is blocked " });
  }

  if (
    user &&
    (await user.matchPassword(password)) &&
    !user.is_usr_active &&
    !user.isAdmin
  ) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    user.usr_hash = rand;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      const { mailOptions } = sendEmailWithVerifyLink(
        req.get("host"),
        email,
        updatedUser
      );

      try {
        await mailer(mailOptions);
        res.status(200).json({ message: "Please Check your mail" });
      } catch (err) {
        console.error(err);
        res.status(400);
      }

      // smtpTransport.sendMail(mailOptions, function (error, response) {
      //   if (error) {
      //     console.log("Email could not sent due to error: " + error);
      //     res.status(400).json({ errorMessage: "Credentials issue" });
      //     // throw new Error("Email issue");
      //   } else {
      //     console.log("Message sent: " + response.message);
      //     res.status(200).json({ message: "Please Check your mail" });
      //   }
      // });
    } catch (error) {
      res.status(400).json({ errorMessage: "Credentials issue" });
      // throw new Error("Email issue");
    }
  } else {
    (user.platformFlag = platformFlag), user.save();

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        earnedPoints: user.earnedPoints,
        address: user.address,
        contact: user.contact,
      });
    } else {
      res.json({ errorMessage: "Invalid email or password" });
    }
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/changePassword
// @access  Public
const userPasswordChange = asyncHandler(async (req, res) => {
  const { email, password, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      user.password = newPassword;
      await user.save();
      const mailOptions = {
        from: email,
        to: `${process.env.EMAIL_FROM}, ${email}`,
        subject: "Password Reset",
        html: ` <h1>Hi ${user.name} Your password is changed successfully</h1>
      <p>Please Login again </p>
      `,
      };

      await mailer(mailOptions);

      res.send("password changed");
    } else {
      res.json({ errorMessage: "Not able to change password" });
    }
  } catch (err) {
    res.status(404);
    throw new Error("Unable to Change password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, address, contact } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     address,
//     contact,
//   });

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: generateToken(user._id),
//       earnedPoints: user.earnedPoints,
//       address: user.address,
//       contact: user.contact,
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, contact } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists && userExists.is_usr_active) {
    res.status(400);
    throw new Error("User already exists");
  }

  const rand = Math.floor(1000 + Math.random() * 9000);

  if (userExists && !userExists.is_usr_active) {
    userExists.usr_hash = rand;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userExists._id },
        { $set: userExists },
        { new: true }
      );

      const { mailOptions } = sendEmailWithVerifyLink(
        req.get("host"),
        email,
        updatedUser
      );

      try {
        await mailer(mailOptions);
        res.status(200).json({ message: "Please Check your mail" });
      } catch (err) {
        console.error(err);
        res.status(400);
      }
      // smtpTransport.sendMail(mailOptions, function (error, response) {
      //   if (error) {
      //     console.log("Email could not sent due to error: " + error);
      //     res.end("error");
      //   } else {
      //     console.log("Message sent: " + response.message);
      //     res.status(200).json({ message: "Please Check your mail" });
      //   }
      // });

      return res.status(200).json({
        message: "Please Check your mail",
      });
    } catch (error) {
      console.log(error);
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    address,
    contact,
    usr_hash: rand,
    is_usr_active: 0,
  });

  if (user) {
    const { mailOptions } = sendEmailWithVerifyLink(
      req.get("host"),
      email,
      user
    );

    try {
      await mailer(mailOptions);
      res.status(200).json({ message: "Please Check your mail" });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
    // smtpTransport.sendMail(mailOptions, function (error, response) {
    //   if (error) {
    //     console.log(error);
    //     res.end("error");
    //   } else {
    //     console.log("Message sent: " + response.message);
    //     res.json({ message: "Please Check your mail" });
    //   }
    // });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const verifyUser = async (req, res, next) => {
  const { token, email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    if (user.usr_hash === token) {
      user.is_usr_active = true;
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.status(201).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
        earnedPoints: updatedUser.earnedPoints,
        address: updatedUser.address,
        contact: updatedUser.contact,
      });
    } else {
      res.status(400).json({ message: "invalid token" });
      throw new Error("Invalid Token");
    }
  } else {
    res.status(400).json({ message: "invalid token" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      earnedPoints: user.earnedPoints,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.contact = req.body.contact || user.contact;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: "User Update Successful",
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
      address: user.address,
      contact: user.contact,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false });

  let userWithOrderCount = [];

  for (const user of users) {
    const order = await Orders.find({ user: user._id });

    userWithOrderCount.push({ orders: order.length, ...user.toObject() });
  }

  res.json(userWithOrderCount);
});

const updateBlockedKey = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = req.body.isBlocked;

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: user },
    { new: true }
  );

  res.json(updatedUser);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.params.id });

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Forget Password
// @route   POST /api/forget-password
// @access  /public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(200).json({ error: "User not found" });
      // return next(new ErrorResponse(ErrorMessage.EMAIL_NOT_SENT, 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `${process.env.BASE_URL}account/passwordreset/${resetToken}`;

    const message = `
    <h1>Hi ${user.name}You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl}> Click here to reset your password</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse(ErrorMessage.EMAIL_NOT_SENT, 500));
    }
  } catch (err) {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc    New Password
// @route   POST /api/Newpassword
// @access  /public
const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new ErrorResponse(
          "Password reset token is invalid or has expired.",
          400
        )
      );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const mailOptions = {
      from: email,
      to: `${process.env.EMAIL_FROM}, ${email}`,
      subject: subject,
      html: ` <h1>Hi ${user.name} Your password is changed successfully</h1>
      <p>Please Login again </p>
      `,
    };

    await mailer(mailOptions);

    res.status(201).json({
      success: true,
      data: "Password Reset Successfully",
      token: user.getSignedJwtToken(),
    });
  } catch (err) {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Email Contact us info
// @route   POST /api/submitContactInfo
// @access  /public
const submitContactInfo = async (req, res) => {
  const { email, contact, name, subject, message } = req.body;
  const mailOptions = {
    from: email,
    to: `${process.env.EMAIL_FROM}, ${email}`,
    subject: subject,
    html: `<p>Email: ${email} </p>
    <p>Contact: ${contact} </p>
    <p>Name: ${name} </p>
    <p>Subject: ${subject} </p>
    <p>Message: ${message} </p>
    `,
  };

  try {
    await mailer(mailOptions);
    res.status(200).json({ message: "Please Check your mail" });
  } catch (err) {
    console.error(err);
    res.status(400);
  }

  // smtpTransport.sendMail(mailOptions, function (error, response) {
  //   if (error) {
  //     console.log(error);
  //     res.status(400).json({ message: "unable to send email" });
  //   } else {
  //     console.log("Message sent: " + response.message);
  //     res.status(200).json({ message: "Please Check your mail" });
  //   }
  // });
};
export {
  submitContactInfo,
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  updateBlockedKey,
  userPasswordChange,
  verifyUser,
  createComplaintEmail,
  createExchangeRequest,
  addToWishListOfUser,
  removeFromWishListOfUser,
};
