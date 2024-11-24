const bcrypt = require("bcrypt")
const bcryptPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password,10)
        return hashPassword
        
    } catch (error) {
        res.send(error.message)
        
    }
    
    
}
module.exports = bcryptPassword