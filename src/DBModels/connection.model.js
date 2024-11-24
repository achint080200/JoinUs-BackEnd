const mongoose = require("mongoose")
const {Schema} = mongoose 

const connectionSchema = Schema({
    fromUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    toUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        enum : {
            values : ["interested","ignored","accepted","rejected"],
            message : `{value} is not a valid status`
        }
    }
    
},{timestamps:true})
connectionSchema.pre("save",function (next) {
    if(this.fromUser.equals(this.toUser)){
        throw new Error("you can not send request to yourself");
        
    }
    next()
    
})


const Connection = mongoose.model("Connection",connectionSchema)

module.exports = Connection
