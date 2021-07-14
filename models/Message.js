const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let messageSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);
module.exports = mongoose.model("Message", messageSchema);
