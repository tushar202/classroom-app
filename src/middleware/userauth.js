const jwt=require('jsonwebtoken')
const User=require('../models/users')

const auth=async(req,res,next)=>{

    try{
    const token=req.header('Authorization').replace('Bearer ','')
    console.log(token);
    
    const decoded=await jwt.verify(token,'secret')
    const user=await User.findOne({_id:decoded._id,'tokens.token':token})
    console.log(user);
    
    if(!user)
    res.status(400).send('user not verified')
    req.user=user
    req.token=token
    }catch(e){
        res.status(500).send()
    }
    next()
}

module.exports=auth