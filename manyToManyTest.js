var db = require('./models');

// First, get a reference to a city, doesn't matter which way you do first.
db.city.findOrCreate({
	where: { city: "Portland"}
	})
	.spread((city, created) => {
		//second, get a reference to a traveler
		db.traveler.findOrCreate({
			where: { firstName: "Nhu"}
		})
		.spread((traveler, created) => {
		// Now use the addModel method to attach one piece of data to another.
			city.addTraveler(traveler)
		})
		.then((traveler) => {
			console.log(traveler, " added to ", city);
	});
})