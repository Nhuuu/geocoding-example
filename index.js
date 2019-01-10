var express = require('express');
var app = express();
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var methodOverride = require('method-override');
// Import geocoding services from mapbox sdk
var mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// Create a geocoding client - client requests data from mapbox
var geocodingClient = mbxGeocoding({accessToken: 'pk.eyJ1Ijoibmh1dXUiLCJhIjoiY2pxbWt6dGp2MDFjMjQ4czhyYTJ1Z3pqMiJ9.i2weLiKlRgNrqZGilQ_Aag'});


app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('static'));


// Home route, search form
app.get('/', (req, res) => {
	db.traveler.findAll()
	.then((travelers) => {
		res.render('city-search', {travelers: travelers});
	})
});

// Search-results page, req.query.city comes from the query url which comes from the city-search form.
// Getting query inputs from city-search > req.query > able to use in the search-results form.
app.get('/results', (req, res) => {
	geocodingClient
	.forwardGeocode({
		query: req.query.city + ", " + req.query.state,
		types: ['place'],
		countries: ['us']
	})
	.send()
	.then((response) => {
		// Get all info/parse it and then take the results to put in my search-results.ejs
		var results = response.body.features.map((city) => {
			var placeNameArr = city.place_name.split(", ");
			return {
				city: placeNameArr[0],
				state: placeNameArr[1],
				lat: city.center[1],
				long: city.center[0]
			}
		})
		// console.log(req.query); // travelerId shows up here
		res.render('search-results', {searchTerms: req.query, results: results});
	})

});

// Favorites: find all in the table, render object for ability to use all columns
app.get('/favorites', (req, res) => {
	db.city.findAll()
	.then((faveCities) => {
		var markers = faveCities.map((place) => {
			var markerObj = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [place.long, place.lat]
                },
                "properties": {
                "title": place.city,
                "icon": "airport"
                }
			};
			// The way it originally shows up in mapbox
			return JSON.stringify(markerObj);
		});
		res.render('favorites', {faveCities: faveCities, markers: markers});
	})
	.catch((err) => {
		res.send('error in finding all')
	});
});


// Coming from the search-results from the form (req.body). 
// The add route here, just needs to match the form action. Could accomplish the same thing with /favorites route.
app.post('/add', (req, res) => {
	db.city.findOrCreate({
		where: {
			city: req.body.city,
			state: req.body.state,
			long: req.body.long,
			lat: req.body.lat
		}
	})
	.spread((city, created) => {
		// Make the association with traveler
		db.traveler.findById(req.body.travelerId)
		.then((traveler) => {
			city.addTraveler(traveler)
			.then((traveler) => {
				console.log('Association happened!');
			})
			.catch((err) => {
				console.log('Problem adding association');
			})
		})
		res.redirect('/favorites');
	})
	.catch((err) => {
		res.send('error: ', err)
	})
})

// Delete route from url that is tied to the form
app.delete('/favorites/:idx', (req, res) => {
	db.city.destroy({
		where: {id: req.params.idx}
	})
	.then((deletedCity) => {
		db.cityTraveler.destroy({
			where: { cityId: req.params.idx }
		})
		.then((deletedAssociation) => {
			res.redirect('/favorites');
		})
	})
})

// GET route for `travelers` view 
app.get('/travelers', (req, res) => {
	db.traveler.findAll()
	.then((newTraveler) => {
		res.render('travelers', {newTraveler: newTraveler})
	})
})

// `POST`route for adding travelers to your db 
app.post('/travelers', (req, res) => {
	db.traveler.findOrCreate({
		where: {
			firstName: req.body.firstName,
			lastName: req.body.lastName
		}
	})
	.spread((traveler, created) => {
		res.redirect('/travelers');
	})
})

//  TRAVELER SHOW ROUTE, two ways to make the association
app.get('/travelers/:idx', (req, res) => {
	// db.traveler.findOne({
		// where: {
			// id: req.params.idx
		// }, 
		// include: [db.city]
	// })
	// .then((traveler) => {
		// var markers = traveler.faveCities.map((place) => {
		// 	var markerObj = {
                // "type": "Feature",
                // "geometry": {
                //     "type": "Point",
                //     "coordinates": [place.long, place.lat]
                // },
                // "properties": {
                // "title": place.city,
                // "icon": "airport"
                // }
		// 	};
		// 	// The way it originally shows up in mapbox
		// 	return JSON.stringify(markerObj);
		// });
		// res.render('travelerShow', {traveler: traveler})
	// })
	db.traveler.findById(req.params.idx) 
	.then((traveler) => {
		traveler.getCities()
		.then((cities) => {
			var markers = cities.map((place) => {
				var markerObj = {
	                "type": "Feature",
	                "geometry": {
	                    "type": "Point",
	                    "coordinates": [place.long, place.lat]
	                },
	                "properties": {
	                "title": place.city,
	                "icon": "airport"
	                }
				};
				return JSON.stringify(markerObj);
			});
			res.render('travelerShow', { traveler: traveler, cities: cities, markers: markers })			
		})
	})
})

// DELETE CITY FROM TRAVELER
app.delete('/association', (req, res) => {
	db.cityTraveler.destroy({
		where: {
			cityId: req.body.cityId,
			travelerId: req.body.travelerId
		}
	})
	.then((deletedAssociation) => {
		res.redirect('/travelers/'+req.body.travelerId);
	})
})



// DELETE TRAVELERS
app.delete('/travelers/:idx', (req, res) => {
	db.traveler.destroy({
		where: {
			id: req.params.idx
		}
	})
	.then(() => {
		res.redirect('/travelers');
	})
})





app.listen(8000);