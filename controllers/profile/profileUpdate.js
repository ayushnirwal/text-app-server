const User = require("../../models/User");

exports.profileUpdate = async (req, res, next) => {
  try {
    const myEmail = res.locals.user.email;
    myUserObj = await User.findOne({ email: myEmail });
    let { avatarInd, name } = req.body;

    if (!avatarInd) {
      return res.status(400).json({ message: "No avatar selected" });
    }

    if (!(name && name.trim())) {
      return res
        .status(400)
        .json({ message: "Name is either undefined or empty" });
    }
    myUserObj.avatarInd = avatarInd;
    myUserObj.name = name;

    myUserObj.save();
    return res.status(200).json({ success: "true" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};
