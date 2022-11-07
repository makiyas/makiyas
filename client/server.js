import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";

import morgan from "morgan";
import cors from "cors";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// custom middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// configuration
import connectDB from "./config/db.js";

// app routes
import productRoutes from "./routes/productRoutes.js";
import colourRoutes from "./routes/colourRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import maincategoryRoutes from "./routes/maincategoryRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import saleRoutes from "./routes/salesRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import typeRoutes from "./routes/typeRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import socialLinksRoutes from "./routes/socialLinksRoutes.js";
import headLineRoutes from "./routes/headLineRoutes.js";
import returnExchangeRoutes from "./routes/returnExchange.js";
import sliderRoutes from "./routes/sliderRoute.js";
import slidermenRoutes from "./routes/slidermenRoute.js";
import sliderkidsRoutes from "./routes/sliderkidsRoute.js";
import citiesRoutes from "./routes/cities.js";

//Models
import Chat from "./models/chat.js";
const http = require("http");
// initialization
dotenv.config();
connectDB();
const app = express();

// use cors middleware
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// json parser
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/colour", colourRoutes);
app.use("/api/chatClients", chatRoutes);
app.use("/api/maincategory", maincategoryRoutes);
app.use("/api/socialLinks", socialLinksRoutes);
app.use("/api/headline", headLineRoutes);
app.use("/api/returnExchange", returnExchangeRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/slidermen", slidermenRoutes);
app.use("/api/sliderkids", sliderkidsRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/type", typeRoutes);

const __dirname = path.resolve();

// payment route
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, resp) => {
    resp.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// upload folder publicly available

//app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// error handling
app.use(notFound);
app.use(errorHandler);
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const io = require("socket.io")(server, {
  cors: {
    origin: [
 
        "http://localhost:3001",
        "http://localhost:3000",
        "http://admins.goldstitch.pk",
        "https://admins.goldstitch.pk",
        "https://hayastudio.pk",
        "http://goldstitch.pk",
        "https://www.goldstitch.pk",
        "http://goldstitch.pk",
        "https://goldstitch.pk",
        "https://mobile.goldstitch.pk",
        "http://mobile.goldstitch.pk",
        "https://goldstitchbackend.herokuapp.com/",
        "https://goldstitchbackend.herokuapp.com",
        "https://www.skilltechconsulting.com",
        "https://skilltechconsulting.com",
        "http://skilltechconsulting.com",

    ],
  },
});

// (8900, {
//   cors: {
//     origin: [
//       "https://haya-lawn.netlify.app",
//       "https://haya-admin-panel.netlify.app",
//     ],
//   },
// });

io.on("connection", async (socket) => {
  // if (err) console.error(err);
  console.log("user connected");

  socket.on("joinRoom", ({ userID }) => {
    console.log("user tried to join with this id:: ", userID);
    console.log(socket.message);
    socket.join(userID);
  });
  socket.on(
    "chatroomMessage",
    async ({ chatroomID, receiverID = "none", message, isAdmin }) => {
      console.log(" here");
      console.log("Data::: ", {
        isAdmin,
        message,
        chatroomID,
      });
      if (message.trim().length > 0) {
        await Chat.findOne({ user: chatroomID }).then(async (chat) => {
          if (!chat) {
            console.log("New User");
            const newChatroom = new Chat({
              user: chatroomID,
              chat: [
                {
                  receiverID: receiverID,
                  senderID: chatroomID,
                  message: message,
                  isAdmin,
                },
              ],
            });
            await newChatroom.save();
            io.emit("RefreshChat", await Chat.find({}));
          } else {
            console.log("Existing User");
            const user = await Chat.findOne({ user: chatroomID });
            if (user) {
              console.log(user);
              user.chat = [
                ...user.chat,
                {
                  receiverID: receiverID,
                  senderID: chatroomID,
                  message: message,
                  isAdmin,
                },
              ];
            }
            user.save().then(async (update) => {
              console.log("update::: ", update);
              io.emit("RefreshChat", await Chat.find({}));
            });
            console.log("Chatroom ID:   ", chatroomID);
          }

          io.to(chatroomID).emit("newMessage", {
            receiverID: receiverID,
            senderID: chatroomID,
            message: message,
            isAdmin,
            timestamp: new Date(),
          });
        });
      }
    }
  );
});

server.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
