const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    maxlength: 20,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
    required: true,
  },
  profilePic: {
    type: String,
  },
  about: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.statics.findPhone = async function ({ phoneNumber }) {
  // Check whether a user with the provided phone number exists
  const user = await this.findOne({ phoneNumber });

  if (user) {
    console.log(("User already exists"));
    throw new Error("User already exists");
  }

  return false;
};

userSchema.statics.findByPhoneAndPassword = async function ({
  phoneNumber,
  password,
}) {
  //check whether email or phone number exists
  const user = await this.findOne({ phoneNumber });

  if (!user) throw new Error("User does not exist");

  if (user.password !== password) {
    throw new Error("Invalid Password");
  }
  return user;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
