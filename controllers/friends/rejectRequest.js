const User = require("../../models/User");
const {
  isReceivedRequestExists,
} = require("./helpers/isReceivedRequestExists");

exports.rejectRequest = async (req, res) => {
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

  //check if such request is received
  if (!isReceivedRequestExists(myUserObj, theirUserObj)) {
    res
      .status(400)
      .json({ message: "no such request was sent by you or received by them" });
    return;
  }

  // checks done

  // filter their req from my received
  const newReceivedRequests = myUserObj.requests.received.filter(
    (requestID) => requestID !== theirUserObj.id
  );
  myUserObj.requests.received = newReceivedRequests;

  // filter their req from their sent
  const newSentRequests = theirUserObj.requests.sent.filter(
    (requestID) => requestID !== myUserObj.id
  );
  theirUserObj.requests.sent = newSentRequests;

  myUserObj.markModified("requests.received");
  theirUserObj.markModified("requests.sent");

  //save

  await myUserObj.save();
  await theirUserObj.save();
  //done
  res.status(200).json({ success: true });
};
