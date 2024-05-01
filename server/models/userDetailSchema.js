const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  userData: [
    {
      type: String,
    },
  ],
  Email: {
    type: String,
    required: true,
  },
});
const userDetail = mongoose.model("UserDetail", userSchema);
module.exports = userDetail;