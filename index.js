const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./userModels.js')
require('dotenv').config()

mongoose.connect(process.env.mongo_URI , {
  useNewUrlParser:true , 
  useUnifiedTopology : true
})
.then(()=> console.log("MONGODB CONNECTED"))
.catch(err => console.log(err))


app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users" , async (req,res)=>{
  const {username} = req.body;

  if(!username){
    return res.json({error:"Username is required"})
  }

  const existingUser = await User.findOne({username})

  if(existingUser){
    return res.json({
      username :existingUser.username ,
      _id : existingUser._id
    })
  }

  try{
    const newUser = new User({username})

    const savedUser = await newUser.save()
    return res.json({
      username : savedUser.username,
      _id:savedUser._id
    })
  
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error:"Server Error"})
  }
  
  
})

app.get('/api/users' , async(req, res)=>{
  const users = await User.find({} , "username _id")
  res.json(users)

})
app.post('/api/users/:id/exercises' , async(req,res)=> {
  const userId = req.params.id;
const { description, duration, date } = req.body;

  if (!description || !duration) {
    return res.status(400).json({ error: "Description and duration are required." });
  }

  const excercisedDate = date ? new Date(date) : new Date()
  if(excercisedDate.toString() === "Invalid Date"){
    return res.json({error : "INvalid date format"})
  }
  
  const parsedDuration = parseInt(duration , 10)
  if(isNaN(parsedDuration)){
    return res.status(400).json({ error: "Duration must be a number." });
  }

 try{
   const user = await  User.findById(userId)

  if(!user){
    return res.json({message : "username not found"})
  }

  const newData = {
    description : description , 
    duration : parsedDuration ,
    date : excercisedDate.toDateString() 

  }

  user.log.push(newData)
  await user.save()
  return res.json({
    _id : user._id , 
    username : user.username , 
    description : newData.description , 
    duration : newData.duration , 
    date : newData.date
  })
   
 
 }
 catch(error){
    res.status(500).json({ error: "Server error" })

 }


})



app.get("/api/users/:id/logs" , async(req,res)=>{
  const {from , to , limit} = req.query
  const userId = req.params.id
  try{
    const user = await User.findById(userId)
    if(!user) return res.json({error:"User not found"})
      let logs = [...user.log]

    if(from){
      const fromDate = new Date(from)
      logs = logs.filter(l=> new Date(l.date) >= fromDate)
    }
    if(to){
      const toDate = new Date(to)
      logs = logs.filter(l => new Date(l.date) <= toDate )
    }
    if(limit){
      logs = logs.slice(0, parseInt(limit))
    }
    res.json({
      username : user.username, 
      _id : user._id , 
      count : logs.length , 
      log : logs
    })

  }
  catch(error){
        res.status(500).json({ error: "Server error" })

  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
