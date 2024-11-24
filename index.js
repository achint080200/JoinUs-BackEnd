const express = require("express");
const app = express();
const dbConnect = require("./src/config/Connection.js");
const port = 3000;
const cookieparser = require("cookie-parser")
const cors= require("./node_modules/cors")
const authRouter = require("./src/routes/authUser.js")
const profileRouter = require("./src/routes/profile.js")
const requestRouter = require("./src/routes/request.js")
const userRouter = require("./src/routes/user.js")
const corsOptions = {
    origin: 'http://localhost:5173', 
    
    credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser())
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)



dbConnect()
    .then(()=>{
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
          });

    }).catch((error)=>{
        console.log("something went wrong.")

    })


    

