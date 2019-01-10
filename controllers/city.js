var express = require('express');
var app = express();
var db = require('./models');
var methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));












module.exports = router;