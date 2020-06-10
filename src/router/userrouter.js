const express=require('express')
const router=express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const  isAdmin=require('../middleware/access')
const useroradmin=require('../middleware/useroradmin')
const todo=require('../models/todo')
const uniqid=require('uniqid')





router.get('/displayuser/:id',auth,isAdmin,async(req,res)=>{
    const users=await User.find({'classJoined.uid':req.params.id})
    res.send(users)
    
})

router.post('/createclass',auth,async(req,res)=>{
    const user=req.user
    //console.log(user);
    
    const uid=await uniqid()
    console.log(uid);
    
    user.classCreated=user.classCreated.concat({uid:uid})
    await req.user.save()
    res.status(201).send(user)
})

router.post('/joinclass',auth,async(req,res)=>{

    const uid=req.body.uid
   
    const clas=await User.findOne({'classCreated.uid':uid})
    console.log(clas);
    if(!clas){
       return res.status(400).send('no such class exists')
    }
    const id=req.user.classCreated.filter((classid)=>{
        return classid.uid===uid
    })
    console.log(id);
    
    if(id.length!==0){
       return  res.status(400).send('u cannot join ur own class')
    }
    
   
    req.user.classJoined=req.user.classJoined.concat({uid})
     await req.user.save()
    res.send(req.user)
})

router.get('/classcreated',auth,async(req,res)=>{
    const classes=req.user.classCreated
    res.send(classes)
})


router.get('/show',async(req,res)=>{
    console.log(req.user);
    
    res.send(req.user)
})
router.post('/login',async(req,res)=>{
    //try{
        const user=await User.findOne({email:req.body.email})
        const inputPassword=req.body.password
         if(!user)
        throw new Error('no user found')
        console.log('i');
        
        const vuser= await user.checkPassword(inputPassword)
        console.log(vuser);
        
        console.log('t');
        
        const token=await vuser.generateTokens()
        res.send({vuser,token})
    //}catch(e){
      //  res.status(400).send(e)
    //}
})

router.post('/enterclass/:id',auth,isAdmin,async(req,res)=>{
    
    res.send('allok')
})

router.post('/leaveclass/:id',auth,useroradmin,async(req,res)=>{
    const  user=req.user
    user.classJoined=user.classJoined.filter((clas)=>{
        return clas.uid!==req.params.id
    })
    await user.save()
    res.send(user)
})

router.post('/removestudent/:id/:_id',auth,isAdmin,async(req,res)=>{
    const ruser=await User.findById(req.params._id)
    ruser.classJoined=ruser.classJoined.filter((clas)=>{
        return clas.uid!==req.params.id
    })
    await ruser.save()
    res.send('user successfully removes from the class')
})

module.exports=router