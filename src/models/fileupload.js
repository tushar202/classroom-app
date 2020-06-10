const mongoose=require('mongoose')


const fileuploadSchema=mongoose.Schema({
    
    file:{
        type:Buffer,
        required:true
    },
    classId:{
        type:String,
        required:true
    },
    userorAdmin:{
        type:String,
        required:true
    },
    assignmentName:{
        type:String,

    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

const File=mongoose.model('File',fileuploadSchema)

module.exports=File