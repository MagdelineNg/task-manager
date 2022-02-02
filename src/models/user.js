const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
//create schema --> pass object User in schema 
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("password cannot contain 'password'");
        }
      },
    },
    tokens: [{   //array[] of objects{}
      token: {
        type: String,
        required: true 
      }
    }],
    avatar:{
      type: Buffer   //store buffer with binary image data in database with user whose image belongs to 
    }
},{
  timestamps: true
})

//instance methods accessible on instances of the individual user (e.g. user is an instance of User)
userSchema.methods.generateAuthToken = async function () {
  const user = this 
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
  
  //add token to array
  user.tokens = user.tokens.concat({token})
  await user.save()   //save the tokens to database so can invalidate the tokens when user can logout 
  
  return token
} 

//static method(=model method) accessible on User model 
//findbycredentials will call this
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})

  if(!user){
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error("Unable to login")
  }

  return user
}

//instance method accessible for indiv user
// userSchema.methods.getPublicProfile = function () {
//   const user = this 
//   const userObject = user.toObject()

//   delete userObject.password
//   delete userObject.tokens

//   return userObject 
// }

userSchema.methods.toJSON = function () {
  const user = this 
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar //sending back image files can slow it down

  return userObject 
}

//run this middleware code to hash plain text pw before user is saved
userSchema.pre('save', async function(next) {   //standard function only bcos arrow fn does not bind this.
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next() //call next when all pre code is ran and user is to be saved
})

//middleware: delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
  const user = this
  await Task.deleteMany({owner: user._id})
  next()
})

const User = mongoose.model("User", userSchema)

module.exports = User;
