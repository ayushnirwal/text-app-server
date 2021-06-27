const User = require("../../models/User");

exports.sendRequest = async (req, res, next) => {
  //someone said verifying auth token this way is bad for performance.
  //They said use redis where you make an entry mapping a randomid with user data with some expire time,
  //verification and getting user data then becomes a query to this database rather than decoding

  const theirEmail = req.body.email;
  const myEmail = res.locals.user.email;

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
    res.status(400).json({ errors: [{ email: "user account doesn't exist" }] });
    return;
  }

  //check if i am already their friend
  let alreadyFriend = false;
  const theirFriends = theirUserObj.friends;
  theirFriends.forEach((friend) => {
    if (friend.id === myUserObj.id) {
      alreadyFriend = true;
    }
  });

  if (alreadyFriend) {
    res.status(400).json({ errors: [{ email: "already their friend" }] });
    return;
  }

  //check if my request already exists

  let requestExists = false;
  const theirRequests = theirUserObj.requests;
  theirRequests.forEach((request) => {
    if (request.id === myUserObj.id) {
      requestExists = true;
    }
  });

  if (requestExists) {
    res.status(400).json({ errors: [{ email: "request already sent" }] });
    return;
  }

  //all checks done i guess, now adding new request to their request array
  newRequest = {
    name: myUserObj.name,
    email: myUserObj.email,
    id: myUserObj.id,
  };
  const newRequests = [...theirRequests, newRequest];
  theirUserObj.requests = newRequests;
  theirUserObj.save();

  res.status(200).json(newRequest);
};
