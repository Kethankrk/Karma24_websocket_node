const express = require("express");
const { Server } = require("socket.io");
const { chatModel, markDownModel } = require("./models");
const mongoose = require("mongoose");
const cors = require("cors");

const url = `mongodb+srv://kethankrk:Oklf0KEL8lkTQlzS@cluster0.ytaftoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url).then(() => console.log("Connected to mongodb"));

const app = express();
app.use(cors());
const serv = app.listen(3000, () => {
  console.log("Server started in: http://localhost:3000");
});

const io = new Server(serv, {
  cors: ["*", "qgbk7vxz-5173.inc1.devtunnels.ms", "localhost"],
});

app.get("/chat/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const chats = await chatModel.find({ room: id });
    return res.json(chats);
  } catch (error) {
    console.log(error);
    return res.send(400).json({ Error: error });
  }
});

app.get("/markdown/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const markdownData = await markDownModel.findOne({ room: id });
    return res.json(markdownData);
  } catch (error) {
    console.log(error);
    return res.send(400).json({ Error: error });
  }
});
io.on("connection", (socket) => {
  socket.on("join_room", (roomNo) => {
    socket.join(roomNo);
  });

  socket.on("leave_room", (roomNo) => {
    socket.leave(roomNo);
  });

  socket.on("msg", async (data) => {
    console.log(socket.rooms);
    await chatModel.create(data);
    socket.to(data.room).emit("receive_msg", data);
  });

  socket.on("collab", async (data) => {
    const markdata = await markDownModel.findOne({ room: data.room });
    if (!markdata) {
      console.log("creating");
      await markDownModel.create(data);
    } else {
      await markDownModel.updateOne({ room: data.room }, data);
    }
    socket.to(data.room).emit("receive_collab", data);
  });
});

// setInterval(async () => {}, 5000);
