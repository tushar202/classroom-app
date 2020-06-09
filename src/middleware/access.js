
const isAdmin=async (req,res,next)=>{
    const user=req.user
    const id=req.params.id
    //console.log(user);
    console.log(id);
    
    
    //console.log(user.classCreated);
    
    
    const uid=user.classCreated.filter((classid)=>{
        return classid.uid===id
    })
    if(uid.length===0){
      return  res.status(403).send()
    }
    next()
}

module.exports=isAdmin