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
    owner: {
      //to store object id 
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'  //reference from this field to another model
    }
},{
  timestamps: true
})


const Task = mongoose.model("Task", taskSchema)

module.exports = Task;
