const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    friends: {
      type: Array,
      required: false,
    },
    requests: {
      type: Array,
      required: false,
    },
    profilePicLink: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
module.exports = mongoose.model("User", userSchema);
