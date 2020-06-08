const jwt=require('jsonwebtoken')
const Admin=require('../models/admin')

const auth=async(req,res,next)=>{

    try{
    const token=req.header('Authorization').replace('Bearer ','')
    console.log(token);
    
    const decoded=await jwt.verify(token,'secret')
    const admin=await Admin.findOne({_id:decoded._id,'tokens.token':token})
    if(!admin)
    res.status(400).send('user not verified')
    req.admin=admin
    req.token=token
    }catch(e){
        res.status(500).send()
    }
    next()
}

module.exports=auth