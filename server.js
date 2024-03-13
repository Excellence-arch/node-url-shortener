const mongoose = require("mongoose");
const express = require("express");
const shortid = require("shortid");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const urlModel = require("./models/url.model");

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const HOST = process.env.HOST;

// In-memory storage for URL mappings
// const urlDatabase = {};

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));

mongoose.connect(MONGODB_URI).then((resp) => {
  if (resp) console.log(`Connected to the Database`);
  else console.log(`Error connecting ti the database`);
});

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the URL shortener!");
});

// Shorten URL route
app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Generate a short code using the shortid library
  const shortCode = shortid.generate();

  // Save the mapping in the in-memory database
  let form = new urlModel({ oldUrl: url, newUrl: shortCode });
  form.save();
  // urlDatabase[shortCode] = url;

  const shortUrl = `${HOST}/${shortCode}`;
  res.json({ originalUrl: url, shortUrl: shortUrl });
});

// Redirect route
app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  // let originalUrl = "";
  urlModel.findOne({ newUrl: shortCode }).then((resp, err) => {
    if (err) {
      res.status(501).send("Internal server Error");
    } else {
      if (resp) {
        res.redirect(resp.oldUrl);
      } else {
        res.status(404).send("Not Found");
      }
    }
  });

  // if (!originalUrl) {
  //   return res.status(404).send("Not Found");
  // }
  // res.status(201).send(originalUrl);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
