const express=require('express')
const router=express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const  isAdmin=require('../middleware/access')
const todo=require('../models/todo')
const uniqid=require('uniqid')

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

// router.get('/displayuser/:id',auth,async(req,res)=>{
//     const admin=await Admin.findById(req.params.id)
//     const adminEmail=admin.email
//     //console.log(adminEmail);
    
//     try{
//         //console.log(adminEmail);
        
//     const users=await User.find({adminEmail:adminEmail})
//     console.log(users);
    
//     if(users.length===0){
//        return  res.status(400).send('no  user found')
//     }
//     res.send(users)
// }catch(e){
//     res.status(500).send(e)
// }
// })

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
        res.status(400).send()
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
    try{
        const user=await User.findOne({email:req.body.email})
        const inputPassword=req.body.password
         if(!admin)
        throw new Error('no user found')
        console.log('i');
        
        const vuser= await user.checkPassword(inputPassword)
        console.log(vuser);
        
        console.log('t');
        
        const token=await vuser.generateTokens()
        res.send({vuser,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/enterclass/:id',auth,isAdmin,async(req,res)=>{
    
    res.send('allok')
})

router.post('/createtodo/:id',auth,isAdmin,async(req,res)=>{
    console.log(req.user._id);
    
    const task=new todo({
        ...req.body,
        classid:req.params.id,
        createdBy:req.user._id
    })
    console.log(task);
    
    await task.save()
    res.send(task)
})

module.exports=router