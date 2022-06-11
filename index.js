require('dotenv').config()
const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const User = require("./models/user")
const Ticket = require("./models/ticket")

mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true},(err,stat) => {
    if (!err) console.log('DB Connection Established')
    else console.log('Error establishing DB Connection')
})

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

const port = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send("Hi there!")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})