// Require models
var db = require("../models");

module.exports = function(app, cheerio, axios) {
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
  app.get("/", function(req, res) {
    db.Article.find({}, function(err, data) {
      console.log(data);
      if (err) {
        console.log(err);
      } else {
        res.render("index", { articles: data });
      }
    });
  });

  // A GET route for getting a specific article by id and populating with comment
  app.get("/:id", function(req, res) {
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
  app.post("/:id", function(req, res) {
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

  app.delete("/clear", function(req, res) {
      db.Article.remove({}, function(err, data) {
          if (err) {
              console.log(err)
          } else {
              res.json(data)
          }
      }).then(function(response) {
          res.json(response)
      }).catch(function(err) {
          res.json(err);
      })
  })
};
