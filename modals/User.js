const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email Is Invalid");
      }
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
    minlength: [6, "password is shorter than the minimum allowed length 6"],
  },
  avatar: {
    type: String,
    default: "unknown",
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    const avatar = gravatar.url(user.email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    user.avatar = avatar;
    //encrypt papssword
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //generating Token
  }
});

UserSchema.methods.generateAccessToken = async function () {
  const user = this;
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = await jwt.sign(payload, process.env.accessTokenSecret, {
    expiresIn: "120s",
  });
  return token;
};
UserSchema.methods.generateRefreshToken = async function () {
  const user = this;
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = await jwt.sign(payload, process.env.refreshTokenSecret, {
    expiresIn: 259200,
  });
  return token;
};
UserSchema.statics.findByCredential = async function (email, password) {
  const user = await User.findOne({ email });
  //check if email exist
  if (!user) {
    throw new Error(
      "unable to login please check your email or password again"
    );
  }
  await comparePassword(
    password,
    user.password,
    "unable to login please check your email or password again"
  );

  return user;
};

UserSchema.statics.checkPasswordWithId = async function (id, password) {
  const user = await User.findById(id);
  if (!user) {
    // throw new Error('User is not Exist')
    throw new CustomError("User is not Exist", "User Not Found");
  }
  //Checking User Input Old password for verify before change the password
  await comparePassword(
    password,
    user.password,
    "Your Old Password Is Incorrect",
    "Verification Fail"
  );
  return user;
};
const User = mongoose.model("user", UserSchema);
module.exports = User;

const comparePassword = async function (
  inputPassword,
  storePassword,
  errorMessage,
  errorName
) {
  const passwordIsMatch = await bcrypt.compare(inputPassword, storePassword);
  if (!passwordIsMatch) {
    throw new Error(errorMessage);
  }
};
