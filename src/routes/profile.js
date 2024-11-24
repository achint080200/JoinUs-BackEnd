const express = require("express")
const profileRouter = express.Router()
const userAuth = require("../middlewares/userAuth")


profileRouter.patch("/profile/update",userAuth,async (req,res) => {
    try {
        const loggedInUser = req.user
        const allowedItems = [
            "FirstName","age","skills","photoUrl","about"]
       const isAllowed= Object.keys(req.body).every(key => allowedItems.includes(key))
       if(!isAllowed){
        throw new Error("this fields not allowed");
        
       }else{
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
          });
          console.log("Updated user object:", loggedInUser); // D
      
          try {
            await loggedInUser.save();
            res.status(200).send(loggedInUser);
          } catch (error) {
            console.error("Error saving user:", error.message);
            res.status(500).send(error.message);
          }
       }
        
    } catch (error) {
        res.status(404).send(error.message)
    }
    
})
profileRouter.get("/user/profile",userAuth,async (req,res) => {
 
    try {
            if(req.user){
                res.send(req.user)
            }
        
    } catch (error) {
        res.status(401).send(error.message)
        
    }
   
})

module.exports = profileRouter