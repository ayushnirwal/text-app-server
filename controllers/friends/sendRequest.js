const User = require("../../models/User");
const { isSentRequestExists } = require("./helpers/isSentRequestExists");
exports.sendRequest = async (req, res, next) => {
  //someone said verifying auth token this way is bad for performance.
  //They said use redis where you make an entry mapping a randomid with user data with some expire time,
  //verification and getting user data then becomes a query to this database rather than decoding

  const theirEmail = req.body.email;
  const myEmail = res.locals.user.email;

  if (!theirEmail) {
    res.status(400).json({ message: "email invalid" });
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

  //check if i am already their friend
  let alreadyFriend = false;
  const theirFriends = theirUserObj.friends;
  theirFriends.forEach((friendID) => {
    if (friendID === myUserObj.id) {
      alreadyFriend = true;
    }
  });

  if (alreadyFriend) {
    res.status(400).json({ message: "already their friend" });
    return;
  }

  //check if such request is sent

  if (isSentRequestExists(myUserObj, theirUserObj)) {
    res.status(400).json({ message: "request already sent" });
    return;
  }

  //all checks done i guess

  // add my req from to my sent
  myUserObj.requests.sent = [...myUserObj.requests.sent, theirUserObj.id];
  // add my req from to their received
  theirUserObj.requests.received = [
    ...theirUserObj.requests.received,
    myUserObj.id,
  ];

  //declare what stuff is modified
  myUserObj.markModified("requests.sent");
  theirUserObj.markModified("requests.received");

  //save
  await myUserObj.save();
  await theirUserObj.save();

  res.status(200).json({ success: true });
};
