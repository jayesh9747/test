const jwt = require('jsonwebtoken');

const {checkUserToken} = require('../services/userAuthentication');

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).send({ error: "Access denied. No token provided." });
  
    try {
      const payload = checkUserToken(token);
      req.user = payload;
      next();
    } catch (err) {
      res.status(400).send({ error: "Invalid token." });
    }
  };

  