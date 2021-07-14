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
  let { name, friends, email, requests, avatarInd } = myUserObj;
  let { sent, received } = requests;
  let expandedFriends = await Promise.all(
    friends.map((id) => {
      return User.findOne(
        { id },
        {
          email: true,
          name: true,
          avatarInd: true,
          _id: false,
        }
      );
    })
  );
  const expandedSentRequests = await Promise.all(
    sent.map((id) => {
      return User.findOne(
        { id },
        {
          email: true,
          name: true,
          avatarInd: true,
          _id: false,
        }
      );
    })
  );
  const expandedReceivedRequests = await Promise.all(
    received.map((id) => {
      return User.findOne(
        { id },
        {
          email: true,
          name: true,
          avatarInd: true,
          _id: false,
        }
      );
    })
  );
  requests.sent = expandedSentRequests;
  requests.received = expandedReceivedRequests;
  friends = expandedFriends;

  res.status(200).json({ name, friends, email, requests, avatarInd });
};
