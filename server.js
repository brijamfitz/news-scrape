// Set up dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require models
var db = require("./models");

// Set up PORT
var PORT = 8080;

// Initialize express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make "public" a static folder
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost/newsScrape",
  { useNewUrlParser: true }
);

// Routes
// A GET route for scraping the news site
app.get("/scrape", function(req, res) {
  axios.get("https://www.theonion.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("div.post-wrapper").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .find("h1.headline")
        .text();
      result.summary = $(this)
        .find("div.excerpt")
        .text();
      result.link = $(this)
        .find("a.js_entry-link")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete!");
  });
});

// A GET route for getting all articles from the database
app.get("/articles", function(req, res) {
  db.Article.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

// A GET route for getting a specific article by id and populating with comment

// A POST route for saving/updating a specific article's associated note

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
