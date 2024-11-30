const mongoose = require("mongoose");

const TaskShema = new mongoose.Schema({
  task: String,
});

const Task = mongoose.model("task", TaskShema);
module.exports = Task;
