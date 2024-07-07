const dotenv = require("dotenv");
const axios = require("axios");
const multer = require("multer");
const FormData = require('form-data');
const Whisper = require("whisper-nodejs");
const fs = require("fs");
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const User = require("./models/userModel.js");
const Feedback = require("./models/feedbackModel.js");

dotenv.config({ path: "./config.env" });

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await User.findOne({ email }, async (err, user) => {
      if (user) {
        if (password === user.password || await user.correctPassword(password, user.password)) {
          res.send({ message: "Login Successfull!", user });
        }
        else {
          res.send({ message: "Incorrect Email or Password!" });
        }
      }
      else {
        res.send({ message: "Incorrect Email or Password!" });
      }
    });
  }
  catch (err) {
    res.send({ message: "Something went wrong. Try again later!" });
    console.log(err);
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.findOne({ email }, async (err, user) => {
      if (user) {
        res.send({ message: "User already registerd!" });
      }
      else {
        try {
          await User.create({
            name,
            email,
            password,
          });
          res.send({ message: "Successfully Registered, Please login now." });
        }
        catch (err) {
          res.send({ message: "Something went wrong. Try again later!" });
          console.log(err);
        }
      }
    });
  }
  catch (err) {
    res.send({ message: "Something went wrong. Try again later!" });
    console.log(err);
  }
};

exports.careerstreaming = async (req, res) => {
  try {
    // Set up response stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Transfer-Encoding", "chunked"); // Enable chunked encoding

    const response = await axios({
      method: "post",
      url: `http://${process.env.ML_SERVER_IP}/career_streaming`,
      data: req.body,
      responseType: "stream",
    });

    // Pipe the streamed response to the client
    response.data.on("data", (chunk) => {
      // Send each chunk individually
      res.write(chunk);
    });
    response.data.on("end", () => {
      // End the response stream
      res.end();
    });
  }
  catch (err) {
    console.log(err);
  }
};

exports.feedback = async (req, res) => {
  const { email, feedback } = req.body;
  try {
    await Feedback.create({
      email,
      feedback
    });
    res.send({ message: "Thankyou for your feedback!" });
  }
  catch (err) {
    res.send({ message: "Something went wrong. Try again later!" });
    console.log(err);
  }
};

exports.youtubeEmbed = async (req, res) => {
  try {
    const result = await axios.post(`http://${process.env.ML_SERVER_IP}/youtube_embed`,
      req.body,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
        },
      }
    );
    res.send(result.data.transcript);
  }
  catch (err) {
    console.log(err);
  }
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Audio');
  },
  filename: (req, file, cb) => {
    cb(null, `audio-${req.body.user_id}.mp3`);
  }
});
const upload = multer({
  storage: multerStorage
});
const whisper = new Whisper(`${process.env.OPENAI_API_KEY}`);

exports.uploadAudio = upload.single('audio_file');

exports.audioUpload = async (req, res) => {
  whisper.translate(`${__dirname}/public/Audio/${req.file.filename}`, 'whisper-1', 'en')
    .then(async text => {
      const result = await axios.post(`http://${process.env.ML_SERVER_IP}/audio_upload`,
        {
          transcript: text,
          user_id: req.body.user_id
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
          },
        }
      );
      res.send(text);
      await unlinkAsync(req.file.path);
    })
    .catch(async error => {
      console.error(error);
      await unlinkAsync(req.file.path);
    });
};

exports.youtubeQuery = async (req, res) => {
  try {
    // Set up response stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Transfer-Encoding", "chunked"); // Enable chunked encoding

    const response = await axios({
      method: "post",
      url: `http://${process.env.ML_SERVER_IP}/youtube_query`,
      data: req.body,
      responseType: "stream",
    });

    // Pipe the streamed response to the client
    response.data.on("data", (chunk) => {
      // Send each chunk individually
      res.write(chunk);
    });
    response.data.on("end", () => {
      // End the response stream
      res.end();
    });
  }
  catch (err) {
    console.log(err);
  }
};

exports.youtubeSummary = async (req, res) => {
  try {
    const response = await axios.post(`http://${process.env.ML_SERVER_IP}/youtube_summary`,
      req.body,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
        },
      }
    );
    res.send(response.data.summary);
  }
  catch (err) {
    console.log(err);
  }
}

exports.searchstreaming = async (req, res) => {
  try {
    // Set up response stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Transfer-Encoding", "chunked"); // Enable chunked encoding

    const response = await axios({
      method: "POST",
      url: `http://${process.env.ML_SERVER_IP}/internet`,
      data: req.body,
      responseType: "stream",
    });

    // Pipe the streamed response to the client
    response.data.on("data", (chunk) => {
      // Send each chunk individually
      res.write(chunk);
    });
    response.data.on("end", () => {
      // End the response stream
      res.end();
    });
  }
  catch (err) {
    console.log(err);
  }
};

const multerStoragePdf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Pdf');
  },
  filename: (req, file, cb) => {
    cb(null, `pdf-${req.body.user_id}.pdf`);
  }
});
const upload2 = multer({
  storage: multerStoragePdf
});

exports.uploadPdf = upload2.single('pdf_file');

exports.pdfUpload = async (req, res) => {
  const form = new FormData();
  const file=await fs.readFileSync(`./public/Pdf/${req.file.filename}`);
  form.append('file',file,`./public/Pdf/${req.file.filename}`);

  const url = 'http://34.94.44.111/pdf_parse';
  const response = await axios.post(url, form, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${form._boundary}`
    },
  });
  await unlinkAsync(req.file.path);
  res.send(response.data.content);
};

exports.mentorstreaming = async (req, res) => {
  try {
    // Set up response stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Transfer-Encoding", "chunked"); // Enable chunked encoding

    const response = await axios({
      method: "POST",
      url: `http://${process.env.ML_SERVER_IP}/reportanalysis_streaming`,
      data: req.body,
      responseType: "stream",
    });

    // Pipe the streamed response to the client
    response.data.on("data", (chunk) => {
      // Send each chunk individually
      res.write(chunk);
    });
    response.data.on("end", () => {
      // End the response stream
      res.end();
    });
  }
  catch (err) {
    console.log(err);
  }
};