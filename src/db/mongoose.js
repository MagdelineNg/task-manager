//mongoose connects to db

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  //useCreateIndex: true, //when mongoose works w mongodb, index is created to access data
});

//create instance of model to add to db
// const me = new User({
//   name: "    Andrew",
//   email: "MYEMAIL@MEAD.IO     ",
//   password: "phone0129e1!",
// });

//use methods on our instance to save to db
// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log("Error! " + error);
//   }); //returns a promise
