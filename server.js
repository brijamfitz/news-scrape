// Set up dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Set up PORT
var PORT = process.env.PORT || 8080;

// Initialize express
var app = express();

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make "public" a static folder
app.use(express.static("public"));

// Require routes
require("./routes/routes")(app, cheerio, axios);

// Connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScrape";

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
