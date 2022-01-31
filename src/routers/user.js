const express = require('express')
const User = require('../models/user')
const router = new express.Router()

//create user creation endpoint (handle success & error)
router.post("/users", async (req, res) => {
    const user = new User(req.body);
  
  //new code + OLD code
    try{   
      await user.save() 
      res.status(201).send(user)
    }catch(e){
      res.status(400).send(e)
    }
    // user.save().then(() => {
    //     res.status(201).send(user);
    //   }).catch((e) => {
    //     res.status(400).send(e);
    //   });
  
    //   able to get it in postman app
    //   console.log(req.body);
  });
  
  //resource creation endpoint : fetch all users
  //new code + OLD code
  router.get('/users', async (req, res) =>{
    try{
      const users = await User.find({})
      res.send(users)
    }catch(e){
      res.status(500).send()
    }
  })
  // app.get("/users", (req, res) => {
  //   User.find({}).then((users) => { //empty {} will fetch all users stored in db
  //     res.send(users)
  //   }).catch((e) => {
  //     res.status(500).send()
  //   })
  // });
  
  
  //resource creation endpoint: fetch individual user by id
  router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
  
    try{
      const user = await User.findById(_id)
      if (!user){
        return res.status(404).send()
      }
  
      res.send(user) //status code is default 200 for endpoints that fetch a resource
    } catch(e){
      res.status(500).send(e)
    }
  })

  router.patch('/users/:id', async (req,res) => {
    //update property that does not exist
    const updates = Object.keys(req.body)
    const allowedUpdates= ['name', 'email', 'password', 'age']
    // const isValidOperation = updates.every(() => {
    //   return allowedUpdates.includes(update)
    // })
    //fn shorthand:
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
  
    if(!isValidOperation){
      return res.status(400).send({error: 'Invalid update!'})
    }
  
    try{   //set new: true so mongoose returns new user after update
      //req.params.id comes from /:id in URL, req.body is what we r trying to update
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
      //no user
      if (!user){
        return res.status(404).send()
      }
      //update went well
      res.send(user)
    }catch(e){   //validation issue when someone sets name as empty string 
      res.status(400).send(e)
    }
  })

  router.delete('/users/:id', async(req,res) => {
    try{
      const user = await User.findByIdAndDelete(req.params.id)
  
      if(!user){
        return res.status(404).send()
      }
  
      res.send(user)
    }catch(e){
      res.status(500).send()
    }
  })


module.exports = router 
