const express=require('express')
const User=require('../models/users')
const Admin=require('../models/admin')
const auth=require('../middleware/userauth')

const router=express.Router()


router.post('/users/signup',async(req,res)=>{
    // const admin=await Admin.findOne({email:req.body.adminEmail})
    // if(!admin)
    // res.status(404).send('no admin with the entered email')
    const user=new User(req.body)
    // console.log(req.body);
    // console.log(user);
    
    try{
       await user.save()
       console.log('l');
       
       const token=await user.generateTokens()
       res.status(201).send({user,token})
    }catch(e){
        res.status(500).send(e)
    }
    
})

router.post('/users/login',async(req,res)=>{
    try{
    const user=await User.findOne({email:req.body.email})
    if(!user)
    res.send(400).send('wrong email  addres')
    const vuser= await user.checkPassword(req.body.password)
    const token=await user.generateTokens()
    res.send({vuser,token})
    }catch(e){
        res.status(400).send(e.message)
    }
})

router.get('/user/profile',auth,async(req,res)=>{
    res.send(req.user)
})


module.exports=router