

const useroradmin=async(req,res,next)=>{
const uid=req.params.id
    const user=req.user
    const firstcheck=user.classCreated.filter((clas)=>{
        return clas.uid===uid

    })
    const secondcheck=user.classJoined.filter((clas)=>{
        return clas.uid===uid
    })
    if(firstcheck.length===0&&secondcheck.length===0){
        return res.status(403).send('u dont have access to view this')
    }

    next()
}

module.exports=useroradmin