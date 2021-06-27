const User = require("../../models/User");

exports.userDetails = async (req, res) => {
  const myEmail = res.locals.user.email;

  let myUserObj = null;
  myUserObj = await User.findOne({ email: myEmail });

  //check userObjs

  if (myUserObj === null || myUserObj === undefined) {
    res.status(400).json({ message: "user account doesn't exist" });
    return;
  }
  const { name, friends, email, requests, avatarInd } = myUserObj;
  res.status(200).json({ name, friends, email, requests, avatarInd });
};
