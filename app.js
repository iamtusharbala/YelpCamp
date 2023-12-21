const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const mongoose = require('mongoose');
const logger = require('morgan')
const Campground = require('./models/campgrounds');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const AppError = require('./AppError')


app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(methodOverride('_method'))
app.get("/", (req, res) => {
    res.render("home")
})


app.get("/campgrounds", async (req, res, next) => {
    try {
        const campgrounds = await Campground.find();
        res.render("campgrounds/all", { campgrounds });
    } catch (error) {
        next(error)
    }
})

app.post("/campgrounds", async (req, res, next) => {
    try {
        console.log(req.body);
        const { title, location, price, description, image } = req.body;
        await Campground.insertMany({
            title,
            price,
            image,
            description,
            location
        }, { runValidators: true })
        console.log('Data entered successfully');
        res.redirect('/campgrounds')
    } catch (error) {
        next(error)
    }
})


app.put("/campgrounds/:id", async (req, res, next) => {
    try {
        const { title, location } = req.body;
        const { id } = req.params;
        await Campground.findByIdAndUpdate(id, {
            title,
            location
        }, { runValidators: true })
        console.log('Data updated successfully');
        res.redirect(`/campgrounds/${id}`)
    } catch (error) {
        next(error);
    }
})


app.delete("/campgrounds/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        console.log('Data deleted successfully');
        res.redirect('/campgrounds')
    } catch (error) {
        next(error);
    }
})
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
            throw new AppError('Did not find campground puttar', 404);
        }
        res.render("campgrounds/show", { campground });
    } catch (error) {
        next(error)
    }
})

app.get("/campgrounds/:id/edit", async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render("campgrounds/edit", { campground });
    } catch (error) {
        next(error)
    }
})

///Error Handler -- put at last
app.use((err, req, res, next) => {
    const { message = 'Something happened', status = 500 } = err;
    res.status(status).send(message);
})



mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp").then(() => {
    console.log("DB Connected");
}).catch(err => console.log("Error connecting to db....", err));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}....`);
})