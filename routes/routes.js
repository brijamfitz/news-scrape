// Require models
var db = require("../models");

module.exports = function(app, cheerio, axios) {
  // Routes
  // A GET route for scraping the news site
  app.get("/scrape", function(req, res) {
    axios.get("https://www.theonion.com/").then(function(response) {
      var $ = cheerio.load(response.data);

      $("div.js_post-wrapper").each(function(i, element) {
        var result = {};

        result.title = $(this)
          .find("h1.card-headline")
          .text();
        result.summary = $(this)
          .find("p")
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

  // A POST route for saving/updating a specific article's associated comment
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

  // A DELETE route for deleting a specific article's associated comment
  // app.delete("/:id", function(req, res) {
  //   console.log(req.body) // This is the title and body of comment
  //   console.log(req.params.id); // This is the id of the article
  //   db.Article.findOne({ _id:req.params.id }, function(err, data){
  //     console.log(data.comment); // This is the comment id
  //     db.Comment.findByIdAndRemove({ _id: data.comment });
  //   })
  //     // db.Comment.remove(req.body).then(function(dbComment) {
  //     //   db.Article.findOneAndRemove(
  //     //     { _id: req.params.id }
  //     //   ).then(function(dbComment) {
  //     //     res.json(dbComment)
  //     //   }).catch(function(err) {
  //     //     res.json(dbComment);
  //     //   })
  //     // })
  // })

  // A GET route to displaying all comments
};
