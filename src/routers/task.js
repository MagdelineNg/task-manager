const express = require("express")
const Task = require('../models/task')  //load task model 
const router = new express.Router()


//create endpoint: fetch all tasks
router.get('/tasks', async (req, res) => {
    try{
      const tasks = await Task.find({})  //use task model Task
      res.send(tasks)
    }catch(e){
      res.status(500).send(e)
    }
  })
  
  //create endpoint: fetch a task by id
  router.get('/tasks/:id' , async (req,res) => {
      const _id = req.params.id
  
      try{
        const task = await Task.findById(_id)
  
        if(!task){
          return res.status(404).send()
        }
  
        res.send(task)
      } catch(e){
        res.status(500).send(e)      
      }
  })
  
  //create task creation endpoint (handle success & error)
  router.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
  
    try{
      await task.save()
      //.then() when promise is fulfilled
      res.status(201).send(task);
    } catch(e){
        //.catch() when promise goes wrongly
        res.status(400).send(e);
    }
  });
  
  router.patch('/tasks/:id', async(req, res) => {
    //update prop DNE
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
  
    if(!isValidOperation){
      res.status(400).send({error: 'invalid update!'})
    }
  
    try{
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
  
      //task not found
      if(!task){
        return res.status(404).send()
      }
      
      res.send(task)
    }catch(e){
      res.status(400).send(e)
    }
  })
  
  router.delete('/tasks/:id', async(req,res) => {
    try{
      const task = await Task.findByIdAndDelete(req.params.id)
  
      if(!task){
        return res.status(404).send()
      }
  
      res.send(task)
    }catch(e){
      res.status(500).send(e)
    }
  })

  module.exports = router 