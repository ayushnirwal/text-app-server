const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { createJWT } = require("../utils/auth");
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.userDetails = async (req, res) => {
  const access_token = req.headers.authorization.slice("Bearer ".length);
  console.log('fetching user data');

  let myUserObj = {};
  await jwt.verify(
    access_token,
    process.env.TOKEN_SECRET,
    {},
    async (err, decoded) => {
      if (err) {
        res.status(400).json({ errors: err });
        return;
      }
      if (decoded) {
        myUserObj = await User.findOne({ id: decoded.userId });
        if (!myUserObj) {
          res
            .status(400)
            .json({ errors: [{ email: "user account doesn't exist" }] });
          return;
        }
      }
    }
  );
  res.status(200).json(myUserObj);
}

exports.signup = (req, res, next) => {
  let { email, password, password_confirmation } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }
  if (!emailRegexp.test(email)) {
    return res.status(400).json({ message: "Email invalid" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password required" });
  }
  if (!password_confirmation) {
    return res.status(400).json({ message: "Confirm Password required" });
  }
  if (password != password_confirmation) {
    return res.status(400).json({ message: "Password mismatch" });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "Email already taken" });
      } else {
        const user = new User({
          id: uuidv4(),
          email: email,
          password: password,
          profilePicLink: "",
          friends: [],
          requests: { sent_requests: [], receieved_requests: [] },
        });

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then((response) => {
                res.status(200).json({
                  success: true,
                  result: response,
                });
                console.log("new user signed up");
              })
              .catch((err) => {
                res.status(500).json({
                  errors: [{ error: err }],
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ error: err.message }],
      });
    });
};

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
