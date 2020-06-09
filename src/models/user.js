const  mongoose=require('mongoose')
const validator=require('validator')
const  bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('please enter a correct email')
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    classCreated:[{
        uid:{
            type:String
        }
    }],
    classJoined:[{
        uid:{
            type:String
        }
    }],
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.methods.checkPassword=async function(inputPassword){
    const user=this
    console.log(inputPassword);
    
    const isCorrect=await bcrypt.compare(inputPassword,user.password)
    console.log(isCorrect);
    
    if(isCorrect)
    return user
    throw new Error('password doesnt match')
}

userSchema.methods.generateTokens=async function(){
    const user=this
    const  token=await jwt.sign({_id:user._id.toString()},'secret')
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token

}


const User=mongoose.model('User',userSchema)

module.exports=User