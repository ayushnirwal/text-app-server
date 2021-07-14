const User = require("../../models/User");
const Message = require("../../models/Message");
const { v4: uuidv4 } = require("uuid");

exports.sendMessage = async (req, res) => {
  const theirEmail = req.body.email;
  const messageText = req.body.message;
  const myEmail = res.locals.user.email;

  if (!theirEmail) {
    res.status(400).json({ message: "email invalid" });
    return;
  }
  if (!messageText) {
    res.status(400).json({ message: "empty or undefined message" });
    return;
  }

  let myUserObj = null;
  let theirUserObj = null;

  theirUserObj = await User.findOne({ email: theirEmail });
  myUserObj = await User.findOne({ email: myEmail });

  //check userObjs

  if (
    theirUserObj === null ||
    theirUserObj === undefined ||
    myUserObj === null ||
    myUserObj === undefined
  ) {
    res.status(400).json({ message: "user account doesn't exist" });
    return;
  }

  const messageObject = new Message({
    id: uuidv4(),
    from: myUserObj.id,
    to: theirUserObj.id,
    message: messageText,
  });

  messageObject.save();
  res.status(200).json({ success: true });
};
