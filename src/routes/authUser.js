const express = require("express")
const bcryptPassword = require("../controller/passwordEncryption.controller")
const User = require("../DBModels/user.models")
const authRouter = express.Router()
const bcrypt = require("bcrypt")
const generateAccessToken = require("../controller/cookies.controller")
const userAuth = require("../middlewares/userAuth")
authRouter.post("/signup",async (req,res) => {
    try {
        const allowedItems = ["FirstName","emailId","password"]
        const data= req.body
        
        const isValidItems = Object.keys(data).every((keys)=>allowedItems.includes(keys))
        if(data?.skills?.length >= 5){
            throw new Error("skills should be less than this");
            
        }
        const validatePassword=await bcryptPassword(data?.password)
       
        const {FirstName,emailId,password}=req.body
        
        if(isValidItems){
            const user = new User({FirstName,emailId,password:validatePassword})
            try {
                const addedUser = await user.save()
                
                const generatedToken = await generateAccessToken(addedUser)
                res.cookie("token",generatedToken)
                res.send(addedUser)
                
                
            } catch (error) {
                res.send (error.message)
                
            }

    }else{
        res.send("the field that you are passing is not valid")
    }
        
    } catch (error) {
        res.send(error.message)      
    }   
})
authRouter.post("/login",async (req,res) => {
    try {
        const {emailId,password}=req.body
        const user = await User.findOne({emailId})
        if(!user){
            return res.send("email id is not valid")
            
        }
        
        const validationPassword = await bcrypt.compare(password,user.password)
       
        if(validationPassword){
            const generatedToken = await generateAccessToken(user)
            
            res.cookie("token",generatedToken)
            
            res.send(user)
            
        }else{
            throw new Error("password is invalid");
            
        }
        
    } catch (error) {
        res.send(error.message)
        
    }
    
})
authRouter.post("/logout",userAuth,async (req,res) => {
    try {
        if(!req.user){
            throw new Error("login first");  
        }
        res.clearCookie('token');
        res.send("successfully logout")
    } catch (error) {
        res.status(404).send(error.message)
    }
    
})

module.exports = authRouter