if (process.env.ENV != "prod"){
    require("dotenv").config()
}

const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const server = require("http").createServer(app)
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const randomstring = require("randomstring")
const User = require("./models/user")
const Ticket = require("./models/ticket")

const io = require("socket.io")(server,{
    cors: {
        origin: '*'
    }
})

mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true},(err,stat) => {
    if (!err) console.log('DB Connection Established')
    else console.log('Error establishing DB Connection')
})

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 4000
let queueId = 0

io.on('connection',socket => {
    socket.on('send-chat-message',message => {
        socket.broadcast.emit('chat-message',message)
    })
})

function generateToken(user){
    const accessToken = jwt.sign(user,process.env.JWT_SECRET_KEY)
    return accessToken
}

function authenticateToken(req,res,next) {
    const authHeader = req.header("authorization")
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token,"SECRETKEY",(err,user) => {
        if (!err) {
            next()
        } else {
            res.sendStatus(403)
        }
    })
}

function forbidAuth(req,res,next){
    const authHeader = req.header("authorization")
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user) => {
        if (!err) {
            res.sendStatus(403)
        } else {
            next()
        }
    })
}

app.get('/',authenticateToken,(req,res)=>{
    res.send("Hi there!")
})

// Signup
app.post('/signup',forbidAuth,(req,res) => {
    User.create(req.body)
      .then((data,err) => {
          if (!err){
              res.json(generateToken(data.email))
          } else {
              res.sendStatus(406)
          }
      })
})

// Login
app.post('/login',forbidAuth,(req,res) => {
    const {email,password} = req.body
    User.find({email:email,password:password})
      .then((data,err) => {
          if(!err){
            res.json(generateToken(data[0].email))
          } else {
              res.sendStatus(406)
          }
      })
})

// Get all unattended tickets
app.get('/tickets',authenticateToken,(req,res) => {
    Ticket.where("status").equals("unanswered").sort({queueId: 'asc'})
      .then((err,data) => {
          if(!err){
              console.log(data)
          } else {
              res.sendStatus(502)
          }
      })
})

// Create Ticket
app.post('/tickets',authenticateToken,(req,res) => {
    let {description,sender} = req.body
    Ticket.create({
        xid: randomstring.generate({
            length:6,
            charset:"alphanumeric",
            capitalization:"uppercase"
        }),
        queueId,
        description,
        sender
    })
      .then((data,err) => {
          if(!err){
              res.json(data)
              queueId += 1
          } else {
              res.sendStatus(502)
          }
      })
})

// Get a Specific Ticket
app.get('/tickets/:ticketId',authenticateToken,(req,res) => {
    const ticketId = req.params.ticketId
    console.log(ticketId)
    Ticket.where("xid").equals(ticketId)
      .then((data,err) => {
          if (!err) {
              console.log(data)
          }
      })
})

app.listen(port, () => {
    console.log(`Express Server is running on port ${port}`)
})

server.listen(3000, () => {
    console.log('Socket IO Server is running on port 3000')
})