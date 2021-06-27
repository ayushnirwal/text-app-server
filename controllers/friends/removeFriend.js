const User = require("../../models/User");

exports.removeFriend = async (req, res) => {
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
  //check if i am their friend

  let alreadyFriend = false;
  const theirFriends = theirUserObj.friends;
  theirFriends.forEach((friendID) => {
    if (friendID === myUserObj.id) {
      alreadyFriend = true;
    }
  });

  if (!alreadyFriend) {
    res.status(400).json({ message: "not their friend" });
    return;
  }

  //check if they are my friend

  alreadyFriend = false;
  const myFriends = myUserObj.friends;
  myFriends.forEach((friendID) => {
    if (friendID === theirUserObj.id) {
      alreadyFriend = true;
    }
  });

  if (!alreadyFriend) {
    res.status(400).json({ message: "not my friend" });
    return;
  }

  // checks done

  // remove from both friend list

  const myNewFriends = myFriends.filter(
    (friendID) => friendID !== theirUserObj.id
  );

  myUserObj.friends = myNewFriends;

  const theirNewFriends = theirFriends.filter(
    (friendID) => friendID !== myUserObj.id
  );

  theirUserObj.friends = theirNewFriends;

  //save

  await myUserObj.save();
  await theirUserObj.save();

  //done
  res.status(200).json({ success: true });
};
