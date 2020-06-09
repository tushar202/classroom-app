const express=require('express')
const userrouter=require('./router/userrouter')
require('./db/mongoose')
const app=express()


app.use(express.json())
app.use(userrouter)

app.listen('3000',()=>{
    console.log('server is running');
    
})