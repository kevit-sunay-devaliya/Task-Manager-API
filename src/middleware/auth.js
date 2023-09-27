const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = await req.header("Authorization").replace("Bearer ", "");
    // console.log(token);
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    // console.log(user);
    if (!user) {
      throw new Error();
    }

    req.token = token; //Add responsed token into req.token for use in logout router
    req.user = user; // Add responsed user into req.user for use in login router
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate!" });
  }
  // console.log("authorization");
  // next()
};

module.exports = auth;
