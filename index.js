const express = require('express')
const app = express()
const cors = require('cors')
const { default: User } = require('./userModels.js')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users" , (req,res)=>{
  const username = req.params ; 

   const User = newUser ({
    id , 
    username
  })
 newUser.save()
  
  
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
