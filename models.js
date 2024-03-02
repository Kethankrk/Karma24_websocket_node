const mongoose = require("mongoose");

const chat = new mongoose.Schema({
  name: String,
  message: String,
  room: String,
});

const markDonw = new mongoose.Schema({
  data: String,
  room: String,
});

const chatModel = mongoose.model("chat", chat);
const markDownModel = mongoose.model("markdown", markDonw);

module.exports = {
  chatModel,
  markDownModel,
};
