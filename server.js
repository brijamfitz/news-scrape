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



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});