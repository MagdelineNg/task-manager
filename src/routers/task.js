const express = require("express")
const Task = require('../models/task')  //load task model
const auth = require('../middleware/auth') 
const router = new express.Router()


//create endpoint: fetch all tasks
router.get('/tasks', auth, async (req, res) => {
   const match = {}
   const sort = {}

   // GET /tasks?completed=true
   if (req.query.completed){   //req.query.completed is a string, not boolean
     match.completed = req.query.completed === 'true'
   }

   // GET /tasks?description=
    // Add text search term to match object, search descriptions
    if (req.query.description) {
    match.description = new RegExp(req.query.description, 'i')
    }

    // GET /tasks?sortBy=createdAt:desc
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split('_')
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

  try{
      //spread operator for match 
      const tasks = await Task.find({owner: req.user._id, ...match},  
        null,   // Used to select fields to return, null=all
        {   // GET /tasks?limit=10&skip=20
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),   
            sort
        })
         //use task model Task
      //^ OR await req.user.populate({
      //   path: 'tasks',
      //   match,
      //   options: {
      //      limit: parseInt(req.query.limit)
      //   }
      // }).execPopulate
      
      res.send(tasks)
    }catch(e){
      res.status(500).send(e)
    }
  })
  
  //create endpoint: fetch a task by id
  router.get('/tasks/:id' , auth, async (req,res) => {
      const _id = req.params.id
  
      try{
        //task owner lines up w user id
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})
       
        if(!task){
          return res.status(404).send()
        }
  
        res.send(task)
      } catch(e){
        res.status(500).send(e)      
      }
  })
  
  //create task creation endpoint (handle success & error)
  router.post("/tasks", auth, async (req, res) => {
    //linking task to owner who created it
    const task = new Task({
      ...req.body,    //ES6 spread operator
      owner: req.user._id
    })

    try{
      await task.save()
      //.then() when promise is fulfilled
      res.status(201).send(task);
    } catch(e){
        //.catch() when promise goes wrongly
        res.status(400).send(e);
    }
  });
  
  router.patch('/tasks/:id', auth, async(req, res) => {
    //update prop DNE
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
  
    if(!isValidOperation){
      res.status(400).send({error: 'invalid update!'})
    }
  
    try{
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
      //const task = await Task.findById(req.params.id)

      //task not found
      if(!task){
        return res.status(404).send()
      }

      updates.forEach((update)=> task[update] = req.body[update])
      await task.save()   //execute middleware
      res.send(task)
    }catch(e){
      res.status(400).send(e)
    }
  })
  
  router.delete('/tasks/:id', auth, async(req,res) => {
    try{
      //const task = await Task.findByIdAndDelete(req.params.id)
      const task = await Task.findOneAndDelete({_id: req.params.id , owner: req.user._id})

      if(!task){
        return res.status(404).send()
      }
  
      res.send(task)
    }catch(e){
      res.status(500).send(e)
    }
  })

  module.exports = router 