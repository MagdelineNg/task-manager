//task.js connects to task model
const mongoose = require("mongoose");

//define model
const taskSchema = new mongoose.Schema({
    description: {
      type: String,
      trim: true,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
})


const Task = mongoose.model("Task", taskSchema)

module.exports = Task;
