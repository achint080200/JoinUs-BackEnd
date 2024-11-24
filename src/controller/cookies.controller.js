const jwt = require("jsonwebtoken")
const generateAccessToken = async (user) => {
    try {
        const genertedToken = await jwt.sign(
            {
                id:user._id
            },
            "GodOrWhat",
            {expiresIn : "1h"}
        )
        return genertedToken
        
    } catch (error) {
        res.status(404).json({
            messsage:"something went wrong"
        })
        
    }
    
}
module.exports = generateAccessToken