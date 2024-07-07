const mongoose = require("mongoose");

const careerFeedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  Date : {
    type: Date,
    default : Date.now()
  }
});

const CareerFeedback = new mongoose.model("CareerFeedback", careerFeedbackSchema);
module.exports = CareerFeedback;
