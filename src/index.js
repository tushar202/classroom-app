const express=require('express')
const adminrouter=require('./router/adminrouter')
const userrouter=require('./router/usersrouter')
require('./db/mongoose')
const app=express()


app.use(express.json())
app.use(adminrouter)
app.use(userrouter)

app.listen('3000',()=>{
    console.log('server is running');
    
})