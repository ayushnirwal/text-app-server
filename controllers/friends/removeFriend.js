const jwt = require("jsonwebtoken");
const User = require("../../models/User");

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
