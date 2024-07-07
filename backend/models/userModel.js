const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "unpaid"
  },
  session_count: {
    type: Number,
    default: 0
  }
});

usersSchema.pre('save',async function (next){
  if(!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password=await bcrypt.hash(this.password,12);
  next();
});

usersSchema.methods.correctPassword = async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword);
};

const BotUser = new mongoose.model("BotUser", usersSchema);
module.exports = BotUser;
