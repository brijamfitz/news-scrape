// Set up our dependencies
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var axios = require('axios');
var cheerio = require('cheerio');

// Require our models
// var db = require('./models');

// Set up our port
var PORT = 8080;

// Initialize express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make "public" a static folder
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(
    'mongodb://localhost/newsScrape',
    { useNewUrlParser: true }
);

// Routes
// A GET route for scraping the news site
axios.get('https://www.theonion.com/').then(function(response) {
    var $ = cheerio.load(response.data);

    var results = [];

    $('div.post-wrapper').each(function(i, element) {
        var title = $(element).find('h1.headline').text();
        var summary = $(element).find('div.excerpt').text();;
        var link = $(element).find('a.js_entry-link').attr('href');

        results.push({
            title: title,
            summary: summary,
            link: link
        });
    });
    console.log(results);
});

// A GET route for getting all articles from the database

// A GET route for getting a specific article by id and populating with comment

// A POST route for saving/updating a specific article's associated note



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});