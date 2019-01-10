// Import geocoding services from mapbox sdk
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// Create a geocoding client - client requests data from mapbox
const geocodingClient = mbxGeocoding({accessToken: 'pk.eyJ1Ijoibmh1dXUiLCJhIjoiY2pxbWt6dGp2MDFjMjQ4czhyYTJ1Z3pqMiJ9.i2weLiKlRgNrqZGilQ_Aag'});

// Forward geocoding, use center for coord and geometry to put markers with coord
// geocodingClient
// 	.forwardGeocode({
// 		query: 'Seattle, WA'
// 	})
// 	.send()
// 	.then(response => {
// 		console.log(response.body.features[0].geometry);
// 	})

// Reverse geocoding
geocodingClient
	.reverseGeocode({
		query: [ -122.3301, 47.6038 ],
		types: ['place']
	})
	.send()
	.then(response => {
		console.log(response.body.features);
	})