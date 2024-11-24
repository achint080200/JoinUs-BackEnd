const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const mongodbURL = process.env.MONGODB_URL

const dbConnect = async () => {
    const connection = await mongoose.connect(mongodbURL)
    if(connection){
        console.log("Database is connected successfully.");
        
    }

}
module.exports = dbConnect


