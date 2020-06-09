const mongoose=require('mongoose')

const todoSchema=mongoose.Schema({
    des:{
        type:String,
        required:true
    },
    classid:{
        type:String
    },
    
    completedby:[{
        user:{
            type:mongoose.Schema.Types.ObjectId
        }
    }]
})

const todo=mongoose.model('todo',todoSchema)

module.exports=todo