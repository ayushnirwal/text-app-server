const User = require("../../models/User");

exports.userDetails = async (req, res) => {
  console.log("fetching user data");

  const myEmail = res.locals.user.email;
  let myUserObj = null;
  myUserObj = await User.findOne({ email: myEmail });

  //check userObjs

  if (myUserObj === null || myUserObj === undefined) {
    res.status(400).json({ errors: [{ email: "user account doesn't exist" }] });
    return;
  }

  res.status(200).json(myUserObj);
};
