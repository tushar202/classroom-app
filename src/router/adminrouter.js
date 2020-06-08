const express=require('express')
const router=express.Router()
const Admin=require('../models/admin')
const User=require('../models/users')
const auth=require('../middleware/authadmin')


router.post('/admin/signup',async(req,res)=>{
    const admin=new Admin(req.body)
    //console.log(admin);
    
    try{
        await admin.save()
        const token=await admin.generateTokens()
        res.status(201).send({admin,token})
    }catch(e){
        res.status(500).send(e)
    }
    req.admin=admin
})

router.get('/displayuser/:id',auth,async(req,res)=>{
    const admin=await Admin.findById(req.params.id)
    const adminEmail=admin.email
    //console.log(adminEmail);
    
    try{
        //console.log(adminEmail);
        
    const users=await User.find({adminEmail:adminEmail})
    console.log(users);
    
    if(users.length===0){
       return  res.status(400).send('no  user found')
    }
    res.send(users)
}catch(e){
    res.status(500).send(e)
}
})

router.post('/login',async(req,res)=>{
    try{
        const admin=await Admin.findOne({email:req.body.email})
        const inputPassword=req.body.password
         if(!admin)
        throw new Error('no user found')
        console.log('i');
        
        const cadmin= await admin.checkPassword(inputPassword)
        console.log(cadmin);
        
        console.log('t');
        
        const token=await cadmin.generateTokens()
        res.send({cadmin,token})
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports=router