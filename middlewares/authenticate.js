const jwt = require("jsonwebtoken");

// middleware to verify jwt.
// updates res.locals.user and res.locals.authenticated if user is verified
exports.authenticate = async (req, res, next) => {
  let token;
  try {
    token = req.headers.authorization.slice("Bearer ".length);
  } catch {
    return res.status(401).send({ error: "no token" });
  }
  if (token == "") {
    return res.status(401).send({ error: "empty token" });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "authentication error" });
    }
    if (decoded) {
      const { email, userId } = decoded;
      res.locals.user = { email, userId };
      res.locals.authenticated = true;
      next();
    }
  });
};
