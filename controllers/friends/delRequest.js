const User = require("../../models/User");

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
