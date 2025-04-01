const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this route" });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the full user payload to the request
    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authorization;
