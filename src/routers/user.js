const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendGoodbyeEmail} = require('../emails/account')   //object destructuring
const router = new express.Router()

//create user creation endpoint (handle success & error)
router.post("/users", async (req, res) => {
    const user = new User(req.body);
  
  //new code + OLD code
    try{   
      await user.save() 
      sendWelcomeEmail(user.email, user.name)  //can use async, await but no need to send email before generating auth token
      const token = await user.generateAuthToken()
      res.status(201).send({user, token})
    }catch(e){
      res.status(400).send(e)
    }
    // user.save().then(() => {
    //     res.status(201).send(user);
    //   }).catch((e) => {
    //     res.status(400).send(e);
    //   });
});

  router.post('/users/login', async (req,res) => {
    try{
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()    //token not accessible by User 
      res.send({user, token})
      //res.send({user: user.getPublicProfile(), token})
    } catch(e){
      res.status(400).send()
    }
  })

  router.post('/users/logout', auth, async (req,res) => {
    //target specific token used for authentication
    try{
      //filter out specific token for the session
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token   //token.token is the obj token with token property
      })
      await req.user.save()
    }catch(e){
      res.status(500).send()
    }
  })
  
  //logout of all sessions
  router.post('/users/logoutAll', auth, async(req,res) => {
    try{
      req.user.tokens = []
      await req.user.save()
      res.send()  //will send status 200 if all went well
    }catch(e){
      res.status(500).send()
    }
  })
  //resource creation endpoint : fetch all users
  //new code + OLD code
  router.get('/users/me', auth, async (req, res) =>{
    res.send(req.user)
  })

  // router.get('/users', auth, async (req, res) =>{
  //   try{
  //     const users = await User.find({})
  //     res.send(users)
  //   } catch(e){
  //     res.status(500).send()
  //   }
  // })

  // app.get("/users", (req, res) => {
  //   User.find({}).then((users) => { //empty {} will fetch all users stored in db
  //     res.send(users)
  //   }).catch((e) => {
  //     res.status(500).send()
  //   })
  // });
  
  
  //resource creation endpoint: fetch individual user by id
  // router.get('/users/:id', async (req, res) => {
  //   const _id = req.params.id
  
  //   try{
  //     const user = await User.findById(_id)
  //     if (!user){
  //       return res.status(404).send()
  //     }
  
  //     res.send(user) //status code is default 200 for endpoints that fetch a resource
  //   } catch(e){
  //     res.status(500).send(e)
  //   }
  // })


  //findbyidandupdate BYPASSES mongoose middleware
  //for users to update profile
  router.patch('/users/me', auth, async (req,res) => {
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

      //to run middleware (userSchema.pre())
        updates.forEach((update) => req.user[update] = req.body[update]) //shorthand notation
        // updates.forEach((update) => {
        //     user[update] = req.body[update]   //dynamic updating
        // })
        await req.user.save()   //execute middleware
      //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
      
      
      //no user
      if (!req.user){
        return res.status(404).send()
      }
      //update went well
      res.send(req.user)
    }catch(e){   //validation issue when someone sets name as empty string 
      res.status(400).send(e)
    }
  })

  const upload = multer({
    limits: {
      fileSize: 1000000   //in terms of bytes
    },
    fileFilter(req,file,cb) {  //cb=callback
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload an image'))
      }

      cb(undefined, true)   //true = accept upload
    }
  })

  //endpoint for avatar upload/change avatar
  router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //.png convert image to png format
    //.resize allow us to resize image to uniform size
    const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer()
    req.user.avatar = buffer   //buffer contains all binary data for the file
    await req.user.save()
    
    res.send()
  }, (error, req, res, next) => {
    res.status(400).send({error: error.message})
  })

  //endpoint: delete avatar
  router.delete('/users/me/avatar', auth, async(req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
  })

  //can see avatar of user
  router.get('/users/:id/avatar', async (req,res) => {
    try{
      const user = await User.findById(req.params.id)

      if(!user || !user.avatar){
        throw new Error()  //immediately stop execution of try block and go to catch
      }

      //content-type is a popular header  
      res.set('Content-Type', 'image/jpg')   //res.set() takes in key,value
      res.send(user.avatar)
    }catch(e){
      res.status(404).send()
    }
  })

  //users can remove profile
  router.delete('/users/me', auth, async(req,res) => {
    try{
      // const user = await User.findByIdAndDelete(req.user._id)   
      // //without auth middleware, we do not have access to req.user
      // //will use    const user = await User.findById(req.params.id)
      // if(!user){
      //   return res.status(404).send()
      // }
      await req.user.remove()   //remove user that is authenticated
      sendGoodbyeEmail(req.user.email, req.user.name)
      res.send(req.user)  
    }catch(e){
      res.status(500).send()
    }
  })


module.exports = router 
