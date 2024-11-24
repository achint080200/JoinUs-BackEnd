const express = require("express")
const userAuth = require("../middlewares/userAuth.js")
const requestRouter = express.Router()
const Connection = require("../DBModels/connection.model.js")
const User = require("../DBModels/user.models.js")

requestRouter.post("/request/send/:status/:touserId",userAuth,async (req,res) => {
    try {
        if(!req.user){
            throw new Error("login first");  
        }
        const fromUser = req.user._id
        const toUser = req.params.touserId
        const status = req.params.status
        const allowedStatus = ["interested","ignored"]
        if(!allowedStatus.includes(status)){
            throw new Error("status is invalid");
        }

        const recieverUser =  await User.findById({
            _id : toUser  
        })
        if(!recieverUser){
            throw new Error("accout is not exist.");
            
        }
        
        const connectionExisted = await Connection.findOne({
            $or: [
                {
                    fromUser,
                    toUser,
                    status: { $in: ["interested", "accepted"] }
                },
                {
                    fromUser: toUser,
                    toUser: fromUser,
                    status: { $in: ["interested", "accepted"] }
                }
            ]
        }).populate('fromUser')
        .populate('toUser')
        console.log(connectionExisted);
        if (connectionExisted && connectionExisted.status !== "ignored") {
            throw new Error("Request already made");
        }
        
        if(connectionExisted){
            throw new Error("request already made");
            
        }
        const newlyConnection = new Connection({
            fromUser,toUser,status
        })
        await newlyConnection.save()
        res.send(newlyConnection) 
        
    } catch (error) {
        res.status(404).send(error.message)
    }
     
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const fromUser = req.user._id;   
        const requestId = req.params.requestId;  
        const status = req.params.status;   

       
        const allowedStatus = ["accepted", "rejected"];

        
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Status is invalid");
        }

        const connectionExisted = await Connection.findOne({
            fromUser: requestId,
            toUser: fromUser, 
            status: "interested" 
        });
        console.log(connectionExisted);
        

        if (!connectionExisted) {
            return res.status(400).send("Connection request is not valid");
        }

        connectionExisted.status = status;
        console.log("hello")

        const updatedConnection = await connectionExisted.save();
        return res.status(200).send(updatedConnection);

    } catch (error) {

        return res.status(500).send(error.message);
    }
});

module.exports = requestRouter