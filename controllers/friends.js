const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

  const newRequests = [
    ...theirRequests,
    {
      name: myUserObj.name,
      email: myUserObj.email,
      id: myUserObj.id,
    },
  ];
  theirUserObj.requests = newRequests;
  theirUserObj.save();
  res.status(200).json({ success: "request sent" });
};

exports.acceptRequest = async (req, res) => {
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

  //check if their request exists in myUserObj

  let requestExists = false;
  const myRequests = myUserObj.requests;
  myRequests.forEach((request) => {
    if (request.id === theirUserObj.id) {
      requestExists = true;
    }
  });

  if (!requestExists) {
    res.status(400).json({ errors: [{ email: "request doesn't exist" }] });
    return;
  }

  // all checks done

  // remove their request from my request list

  const newRequests = myRequests.filter((inst) => inst.id !== theirUserObj.id);
  myUserObj.requests = newRequests;

  //add them to my friends List

  const myNewFriends = [
    ...myUserObj.friends,
    { id: theirUserObj.id, name: theirUserObj.name, email: theirUserObj.email },
  ];
  myUserObj.friends = myNewFriends;

  //add me to their friends list

  const theirNewFriends = [
    ...theirUserObj.friends,
    { id: myUserObj.id, name: myUserObj.name, email: myUserObj.email },
  ];
  theirUserObj.friends = theirNewFriends;

  //save

  myUserObj.save();
  theirUserObj.save();

  //done
  res.status(200).json({ success: "request accepted" });
};

exports.delRequest = async (req, res) => {
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

  //check if my request exists in theirUserObj

  let requestExists = false;
  const theirRequests = theirUserObj.requests;
  theirRequests.forEach((request) => {
    if (request.id === myUserObj.id) {
      requestExists = true;
    }
  });

  if (!requestExists) {
    res.status(400).json({ errors: [{ email: "request doesn't exist" }] });
    return;
  }

  // checks done

  // filter their req

  const newRequests = theirRequests.filter(
    (request) => request.id !== myUserObj.id
  );

  theirUserObj.requests = newRequests;

  //save

  theirUserObj.save();

  //done
  res.status(200).json({ success: "request deleted" });
};

exports.rejectRequest = async (req, res) => {
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

  //check if their request exists in myUserObj

  let requestExists = false;
  const myRequests = myUserObj.requests;
  myRequests.forEach((request) => {
    if (request.id === theirUserObj.id) {
      requestExists = true;
    }
  });

  if (!requestExists) {
    res.status(400).json({ errors: [{ email: "request doesn't exist" }] });
    return;
  }

  // checks done

  // filter their req

  const newRequests = myRequests.filter(
    (request) => request.id !== theirUserObj.id
  );

  myUserObj.requests = newRequests;

  //save

  myUserObj.save();

  //done
  res.status(200).json({ success: "request rejected" });
};

exports.removeFriend = async (req, res) => {
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
  //check if i am their friend

  let alreadyFriend = false;
  const theirFriends = theirUserObj.friends;
  theirFriends.forEach((friend) => {
    if (friend.id === myUserObj.id) {
      alreadyFriend = true;
    }
  });

  if (!alreadyFriend) {
    res.status(400).json({ errors: [{ email: "not their friend" }] });
    return;
  }

  //check if they are my friend

  alreadyFriend = false;
  const myFriends = myUserObj.friends;
  myFriends.forEach((friend) => {
    if (friend.id === theirUserObj.id) {
      alreadyFriend = true;
    }
  });

  if (!alreadyFriend) {
    res.status(400).json({ errors: [{ email: "not my friend" }] });
    return;
  }

  // checks done

  // remove from both friend list

  const myNewFriends = myFriends.filter(
    (friend) => friend.id !== theirUserObj.id
  );

  myUserObj.friends = myNewFriends;

  const theirNewFriends = theirFriends.filter(
    (friend) => friend.id !== myUserObj.id
  );

  theirUserObj.friends = theirNewFriends;

  //save

  myUserObj.save();
  theirUserObj.save();

  //done
  res.status(200).json({ success: "friend removed" });
};
