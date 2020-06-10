const express=require('express')
const userrouter=require('./router/userrouter')
const  todorouter=require('./router/todorouter')
const signinrouter=require('./router/signinroute')
const filerouter=require('./router/filerouter')
require('./db/mongoose')
const app=express()


app.use(express.json())
app.use(userrouter)
app.use(todorouter)
app.use(signinrouter)
app.use(filerouter)


app.listen('3000',()=>{
    console.log('server is running');
    
})