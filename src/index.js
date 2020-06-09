const express=require('express')
const userrouter=require('./router/userrouter')
const  todorouter=require('./router/todorouter')
require('./db/mongoose')
const app=express()


app.use(express.json())
app.use(userrouter)
app.use(todorouter)

app.listen('3000',()=>{
    console.log('server is running');
    
})