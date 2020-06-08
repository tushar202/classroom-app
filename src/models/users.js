const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken')


const userSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
                throw  new Error('invalid email')
        }
    },
    password:{
        type:String,
        require:true
    },
    adminEmail:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.pre('save',async function(next){
    const user=this
    if(!user.isModified('password')){
        next()
    }
    user.password=await bcrypt.hash(user.password,8)


})

userSchema.methods.checkPassword=async function(inputPassword){
    const user=this
    const isCorrect=await bcrypt.compare(inputPassword,user.password)
    if(isCorrect)
    return user
    throw new Error('password incorrect')    

}
userSchema.methods.generateTokens=async function(){
    console.log('k');
    
    const user=this
    console.log(user);
    
    const token=await jwt.sign({_id:user._id.toString()},'secret')
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token
}

const  User=mongoose.model('User',userSchema)



module.exports=User