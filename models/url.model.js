const mongoose = require("mongoose");

const urlSchema = mongoose.Schema({
  oldUrl: String,
  newUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const urlModel = mongoose.model("urls_tbs", urlSchema);

module.exports = urlModel;
