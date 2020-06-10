const express=require('express')
const  multer=require('multer')
const File=require('../models/fileupload')
const auth=require('../middleware/auth')
const userorAdmin=require('../middleware/useroradmin')
const isAdmin=require('../middleware/access')
const router=express.Router()

const pdfupload=multer({
    limits:{
        fileSize:2000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(pdf)$/))
        return cb(new Error('uploaded file is not of acceptable type'))
        
        cb(undefined,true)
    }
})

router.post('/fileupload/admin/:id',auth,isAdmin,pdfupload.single('file'),async(req,res)=>{
    const buffer=req.file.buffer

    const file=new File({
        file:buffer,
        classId:req.params.id,
        userorAdmin:'admin',
        uploadedBy:req.user._id
     })
     await file.save()
     res.send()
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

router.get('/filedisplay/:id/:_id',auth,userorAdmin,async(req,res)=>{
        const file=await File.findById(req.params._id)

        res.set('Content-Type','application/pdf')
        res.send(file.file)
})

router.post('/fileupload/user/:id',auth,userorAdmin,pdfupload.single('file'),async(req,res)=>{
    const user=req.user
    const file=new File({
        file:req.file.buffer,
        classId=req.params.id,
        userorAdmin:'user',
        uploadedBy:user._id,
        assignmentName:req.body.assignment

    })
    await file.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

// res.get('/filedisplay/user/:id',auth,userorAdmin,userorAdmin,async(req,res)=>{
//     const file=await File.find({classId:req.params.id,userorAdmin:'user'})
    
// })









module.exports=router