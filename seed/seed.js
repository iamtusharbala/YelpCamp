const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const { descriptors, places } = require('./seedHelpers');
const cities = require('./cities');


mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp").then(() => {
    console.log("DB Connected");
}).catch(err => console.log("Error connecting to db....", err));


const addToDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < descriptors.length; i++) {
        const campName = `${descriptors[i]} ${places[i]}`;
        const randNo = Math.floor(Math.random() * 100);
        const randomPrice = Math.floor(Math.random() * 30);
        // console.log(campName, cities[randNo].city, cities[randNo].state);
        await Campground.insertMany({
            title: campName,
            location: `${cities[randNo].city}, ${cities[randNo].state}`,
            image: 'https://source.unsplash.com/collection/484351',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet laborum omnis, perferendis odio eos consectetur suntaut sint, laboriosam soluta, molestias recusandae.Ipsam officiis dolor architecto, impedit iste tempore sint.',
            price: randomPrice
        })
    }

}

addToDB()