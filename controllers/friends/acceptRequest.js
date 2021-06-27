const User = require("../../models/User");

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

  newFriend = {
    id: myUserObj.id,
    name: myUserObj.name,
    email: myUserObj.email,
  };
  const theirNewFriends = [...theirUserObj.friends, newFriend];
  theirUserObj.friends = theirNewFriends;

  //save

  myUserObj.save();
  theirUserObj.save();

  //done
  res.status(200).json(newFriend);
};
