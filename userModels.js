const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    
    {
        id: {
            type : mongoose.type.ObjectId.Schema,
            ref: "username ",
            required : true
        },

        username : {
        type :String , 
        required : true , 
    },
    description : {
        type : String , 
        required : true 
    },
    duration : {
        type : Number , 
        required : true 
    } , 
    date : {
        type : Number , 
        required : true 
    }


    }
)

const User = mongoose.model("UserSchema" , User)
export default User

