const express=require('express')
const auth=require('../middleware/auth')
const todo=require('../models/todo')
const User=require('../models/user')


const router=express.Router()






router.post('/user/signup',async(req,res)=>{
    const admin=new User(req.body)
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


router.delete('/deleteuser',auth,async(req,res)=>{
    try{
    const user=req.user
    const classCreated=user.classCreated
    if(classCreated.length!==0){
    classCreated.forEach(async(clas)=>{
        let id=clas.uid
        console.log(id);
        
        await todo.deleteMany({classid:id})

    })
}
    
     const id=user._id
     const duser=await User.findByIdAndDelete(id)
    res.send('delted success')
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router