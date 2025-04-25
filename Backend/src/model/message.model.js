import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
    },
    recieverId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" 
    },
    messages : {
        type : String,
        required : true
    }

})

const Message = mongoose.model("Message", messageSchema)
export default Message