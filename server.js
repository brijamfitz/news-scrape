// Set up dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Require models
var db = require("./models");

// Set up PORT
var PORT = 8080;

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

// Connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScrape";

mongoose.connect(
  MONGODB_URI,
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
      result.image = $(this)
        .find("img")
        .attr("src");

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
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// A POST route for saving/updating a specific article's associated note
app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body).then(function(dbComment) {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { comment: dbComment.id } },
      { new: true }
    )
      .then(function(dbComment) {
        res.json(dbComment);
      })
      .catch(function(err) {
        res.json(dbComment);
      });
  });
});

// Start the server
app.listen(process.env.PORT || PORT, function() {
  console.log("App running on port " + PORT + "!");
});
