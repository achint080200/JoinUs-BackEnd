const mongoose = require("mongoose")
const validator = require("validator")
const userSchema = new mongoose.Schema(
    {
        FirstName : {
            type: String,
            required : true,
            minLength : 4,
            maxLength : 25
            
        },
        age : {
            type : Number,
            
            min: [18, "Age must be at least 18"], // Minimum age validation
            max: [54, "Age cannot exceed 54"], // Maximum age validation
            validate: {
              validator: Number.isInteger,
              message: "Age must be an integer", // Custom validation message
            }
        },
        emailId : {
            type: String,
            required : true,
            unique : true ,
            lowercase : true,
            trim : true,
            validate: {
                validator: (value) => validator.isEmail(value),
                message: "Invalid email format.",
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (value) => validator.isStrongPassword(value),
                message: "Password must be strong (include uppercase, lowercase, number, and special character).",
            },
        },
        gender : {
            type: String,
            values : ["male","female","others"],
            message : "{value} is not a valid gender."
        },
        
        about : {
            type : String,
            default : "This is default string for about."
        },
        skills : {
            type:[String],
            default:[],
            validate: {
                validator: (value) => Array.isArray(value) && value.every((skill) => typeof skill === "string"),
                message: "Skills must be an array of strings.",
            },

        },
        photoUrl : {
            type : String,
            validate: {
                validator: (value) => !value || validator.isURL(value), // Allow empty or valid URLs
                message: "Invalid URL format for photoUrl.",
            },
            
        }
        
    }
    ,{timestamps:true})

const User = mongoose.model("User",userSchema)
module.exports = User