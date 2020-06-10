const express=require('express')
const auth=require('../middleware/auth')
const useroradmin=require('../middleware/useroradmin')
const isAdmin=require('../middleware/access')
const todo=require('../models/todo')

const router=express.Router()


router.post('/createtodo/:id',auth,isAdmin,async(req,res)=>{
    console.log(req.user._id);
    
    const task=new todo({
        ...req.body,
        classid:req.params.id,
    })
    console.log(task);
    
    await task.save()
    res.send(task)
})

router.get('/showtasks/:id',auth,useroradmin,async(req,res)=>{
    
    const tasks=await todo.find({classid:req.params.id})

    res.send(tasks)
    
})

router.post('/markcompleted/:id/:_id',auth,useroradmin,async(req,res)=>{
    const task=await todo.findById(req.params._id)
    task.completedby=task.completedby.concat({user:req.user._id})
    await task.save()
    res.send(task)
})


router.get('/taskcompletelist/:id/_id',auth,useroradmin,async(req,res)=>{
    try{
    const task=await todo.findById(req.params._id)
    const users=task.completedby
    res.send(users)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/deletetask/:id/:_id',auth,isAdmin,async(req,res)=>{
        const task=await todo.findByIdAndDelete(req.params._id)
        res.send(task)
        
})
module.exports=router