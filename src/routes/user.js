const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const Connection = require("../DBModels/connection.model");
const User = require("../DBModels/user.models");
const mongoose = require("mongoose");

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    if (!loggedInUser) {
      throw new Error("log in first.");
    }
    const connectionOfThisUser = await Connection.find({
      toUser: loggedInUser,
      status: "interested",
    }).populate("fromUser");
    const requestedId = connectionOfThisUser.map((connection) => {
      return connection.fromUser;
    });
    res.send(requestedId);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
userRouter.get("/user/requests/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    if (!loggedInUser) {
      throw new Error("log in first.");
    }
    const connectionOfThisUser = await Connection.find({
      $or: [
        {
          fromUser: loggedInUser,
          status: "accepted",
        },
        {
          toUser: loggedInUser,
          status: "accepted",
        },
      ],
    }).select("fromUser toUser").populate('fromUser').populate('toUser');
    const connections = connectionOfThisUser.map((connection) => {
      if (connection.fromUser._id.equals(loggedInUser)) {
        return connection.toUser;
      } else {
        return connection.fromUser;
      }
    });
    res.send(connections);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    if (!loggedInUser) {
      return res.status(400).send("Please log in first.");
    }

    // Get all connections involving the logged-in user
    const allConnections = await Connection.find({
      $or: [
        {
          fromUser: loggedInUser,
        },
        {
          toUser: loggedInUser,
        },
      ],
    }).select("fromUser toUser");

    const hideUserFromFeed = new Set();
    allConnections.forEach((item) => {
      hideUserFromFeed.add(item.fromUser.toString());
      hideUserFromFeed.add(item.toUser.toString());
    });
    console.log(hideUserFromFeed);
     const userOfFeed =  await User.find({
        $and : [{_id : {$nin : Array.from(hideUserFromFeed)}},
            {_id : {$ne :loggedInUser }}
        ]
     })

    res.send(userOfFeed);
   
  } catch (error) {
    console.error(error); // More descriptive logs
    res.status(500).send(error.message); // Return a generic 500 for unexpected errors
  }
});

module.exports = userRouter;
