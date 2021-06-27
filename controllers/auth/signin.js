const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createJWT } = require("../../utils/auth");
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.signin = (req, res) => {
  let { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }
  if (!emailRegexp.test(email)) {
    return res.status(400).json({ message: "Email invalid" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password required" });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "No user with this email" });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res
                .status(400)
                .json({ errors: [{ password: "incorrect" }] });
            }

            let access_token = createJWT(
              user.email,
              user.id,
              parseInt(process.env.TOKEN_DURATION, 10)
            );

            jwt.verify(
              access_token,
              process.env.TOKEN_SECRET,
              (err, decoded) => {
                if (err) {
                  res.status(500).json({ erros: err });
                }
                if (decoded) {
                  console.log("a user signed in");
                  return res.status(200).json({
                    success: true,
                    token: access_token,
                    user: user,
                  });
                }
              }
            );
          })
          .catch((err) => {
            res.status(500).json({ errors: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ errors: err });
    });
};
