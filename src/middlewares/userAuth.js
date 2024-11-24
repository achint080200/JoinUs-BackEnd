const jwt = require("jsonwebtoken");
const User = require("../DBModels/user.models.js");

const userAuth = async (req, res, next) => {
  try {
    // Check if the token exists in cookies
    const { token } = req?.cookies;
    if (!token) {
      return res.status(401).send({ error: "Token is missing or invalid" });
    }

    // Decode the token
    const decodedToken = jwt.verify(token, "GodOrWhat"); // Use environment variable

    // If token is invalid or expired, it will throw an error
    if (!decodedToken) {
      return res.status(401).send({ error: "Token is invalid or expired" });
    }

    // Get user id from decoded token
    const { id } = decodedToken;

    // Find user by ID in database
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Attach user object to request
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle errors
    console.error("Authentication error:", error.message);
    return res.status(401).send({ error: "Authentication failed, token is invalid" });
  }
};

module.exports = userAuth;