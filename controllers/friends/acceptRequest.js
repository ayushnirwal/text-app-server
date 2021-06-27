const User = require("../../models/User");
const {
  isReceivedRequestExists,
} = require("./helpers/isReceivedRequestExists");

exports.acceptRequest = async (req, res) => {
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

  // check if such request exist

  if (!isReceivedRequestExists(myUserObj, theirUserObj)) {
    res.status(400).json({
      message: "no such request was received by you or sent by them",
    });
    return;
  }

  // all checks done

  // remove their request from my received request list

  const newReceivedRequests = myUserObj.requests.received.filter(
    (instID) => instID !== theirUserObj.id
  );
  myUserObj.requests.received = newReceivedRequests;

  // remove their request from their sent request list

  const newSentRequests = theirUserObj.requests.sent.filter(
    (instID) => instID !== myUserObj.id
  );
  theirUserObj.requests.sent = newSentRequests;

  myUserObj.markModified("requests.received");
  theirUserObj.markModified("requests.sent");

  //add them to my friends List

  const myNewFriends = [...myUserObj.friends, theirUserObj.id];
  myUserObj.friends = myNewFriends;

  //add me to their friends list

  const theirNewFriends = [...theirUserObj.friends, myUserObj.id];
  theirUserObj.friends = theirNewFriends;

  //save
  myUserObj.save();
  theirUserObj.save();

  //done
  res.status(200).json({ success: true });
};
