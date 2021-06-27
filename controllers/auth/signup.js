const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
