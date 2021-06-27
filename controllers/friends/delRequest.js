const User = require("../../models/User");
const { isSentRequestExists } = require("./helpers/isSentRequestExists");

exports.delRequest = async (req, res) => {
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

  //check if request was sent
  if (!isSentRequestExists(myUserObj, theirUserObj)) {
    res
      .status(400)
      .json({ message: "no such request was sent by you or received by them" });
    return;
  }

  // checks done

  console.log(myUserObj.requests, theirUserObj.requests);

  // filter my req from their received
  const newReceivedRequests = theirUserObj.requests.received.filter(
    (requestID) => requestID !== myUserObj.id
  );

  theirUserObj.requests.received = newReceivedRequests;

  // filter my req from my sent
  const newSentRequests = myUserObj.requests.sent.filter(
    (requestID) => requestID !== theirUserObj.id
  );
  myUserObj.requests.sent = newSentRequests;

  console.log(myUserObj.requests, theirUserObj.requests);

  //declare what stuff is modified
  theirUserObj.markModified("requests.received");
  myUserObj.markModified("requests.sent");

  //save
  await myUserObj.save();
  await theirUserObj.save();

  //done
  res.status(200).json({ success: true });
};
