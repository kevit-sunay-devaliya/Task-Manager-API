const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be positive!");
        }
      },
      default: 0,
    },
    password: {
      type: String,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("password contains 'password'");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Invalid!");
        }
      },
      trim: true,
      lowercase: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

//Special method to Alter before it sent to ((JSON.stringify() - which is done in backstage --> res.send()- converts given Object into stringify(JSON)))
userSchema.methods.toJSON = function () {
  const user = this;
  // console.log(user);
  const userObject = user.toObject();
  // console.log(userObject);
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

//Used to create custom function which can be applied on the perticular document (Instance)
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({
    token: token,
  });
  await user.save();
  return token;
};

//Used to create custom function which can be applied on the entire Document(Collection) (findByCredentials)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Unable to Login!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

//Middleware - Used for Alter Data before savingg
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  // console.log("Testing");
  next();
});

//Not Workinggggg.......................Delete user tasks when user is deleted
// userSchema.pre("remove",async function (next) {
//     const user = this;
//     await Task.deleteMany({
//         owner:user._id
//     })
//     next()
// })

// userSchema.post("findOneAndDelete", async function (next) {
//     const user = this
//     await Task.deleteMany({
//         owner: user._id
//     })
//     next()
// })

userSchema.post("findOneAndDelete", async function (user) {
  await Task.deleteMany({ owner: user._id });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
