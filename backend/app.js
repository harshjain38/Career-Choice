const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const controller = require("./controller.js");

const app = express();
dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

try {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("Connection Successful!"));
} catch (err) {
  console.log(err);
}

//Routes
app.get("/", (req, res) => {
  res.send("Career Choice Pro server is active and running... 😊✨");
});
app.post("/login", controller.login);
app.post("/register", controller.register);

app.post("/career_streaming", controller.careerstreaming);
app.post("/feedback", controller.feedback);

app.post("/youtube_embed", controller.youtubeEmbed);
app.post("/audio_upload", controller.uploadAudio, controller.audioUpload);
app.post("/youtube_query", controller.youtubeQuery);
app.post("/youtube_summary", controller.youtubeSummary);

app.post("/search_streaming", controller.searchstreaming);

app.post("/pdf_upload", controller.uploadPdf, controller.pdfUpload);
app.post("/mentor_streaming",controller.mentorstreaming);

const port = 8000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
