const  mongoose=require('mongoose')
const validator=require('validator')
const  bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const adminSchema=mongoose.Schema({
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
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

adminSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

adminSchema.methods.checkPassword=async function(inputPassword){
    const user=this
    console.log(inputPassword);
    
    const isCorrect=await bcrypt.compare(inputPassword,user.password)
    console.log(isCorrect);
    
    if(isCorrect)
    return user
    throw new Error('password doesnt match')
}

adminSchema.methods.generateTokens=async function(){
    const user=this
    const  token=await jwt.sign({_id:user._id.toString()},'secret')
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token

}


const Admin=mongoose.model('Admin',adminSchema)

module.exports=Admin