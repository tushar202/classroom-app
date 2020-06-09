const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async(req,res,next)=>{

    try{
    const token=req.header('Authorization').replace('Bearer ','')
    //console.log(token);
    
    const decoded=await jwt.verify(token,'secret')
    //console.log(decoded);
    
    const user=await User.findOne({_id:decoded._id,'tokens.token':token})
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