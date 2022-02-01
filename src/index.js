const express = require("express");

//ensure mongoose connect to db
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//create new express app
const app = express();
//port is either heroku port OR default port 3000
const port = process.env.PORT || 3000;

//configure express to automatically parse json for us to access in req handle
app.use(express.json());
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log("server is up on port " + port);
});



