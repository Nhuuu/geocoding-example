var express = require('express');
var app = express();
var db = require('./models');
var methodOverride = require('method-override');
// Import geocoding services from mapbox sdk
var mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// Create a geocoding client - client requests data from mapbox
var geocodingClient = mbxGeocoding({accessToken: 'pk.eyJ1Ijoibmh1dXUiLCJhIjoiY2pxbWt6dGp2MDFjMjQ4czhyYTJ1Z3pqMiJ9.i2weLiKlRgNrqZGilQ_Aag'});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));




app.get('/', (req, res) => {
	db.traveler.findAll()
	.then((travelers) => {
		res.render('/traveler/city-search', {travelers: travelers});
	})
});







module.exports = router;