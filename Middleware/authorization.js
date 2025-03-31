const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
  //verify if token is valid
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json("You are not authorized to access this route");
    }
    req.user = payload.id;
    next();
  });
};

module.exports = authorization;
