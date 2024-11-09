// Require dotenv

if(process.env.NODE_ENV != "production") {

    require("dotenv").config();
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const exp = require("constants");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Connect to Database

const dbUrl = process.env.ATLASDB_URL;

main()
.then( () => {

    console.log("connected to DB"); 
})
. catch( (err) => {
    console.log(err); 
});

async function main() {

    await mongoose.connect(dbUrl);
}

// Ejs la set krnar

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded( {extended: true}));   // request madhil data parse honyasathi

app.use(methodOverride("_method"));

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "/public")));


// Create Mongo Store

const store = MongoStore.create({

    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,         // For encryption
    },
    touchAfter: 24 * 3600,      // in seconds
});

// Error in Mongo Store

store.on("error", ( )=> {

    console.log("ERROR in MONGO SESSION STORE", err);
});


// Create Session Options

const sessionOptions = {

    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    cookies: {

        // 7 days later cookies expire honyasathi

        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,   // 1 week mili seconds

        maxAge: 7 * 24 * 60 * 60 * 1000,

        httpOnly: true,  // Prevent from cross scripting attack

    },
};

/*

// 1. Root Router

app.get( "/", (req, res) => {

    res.send("Hi, i am root");
});

*/



// Session la use krnya sathi

app.use(session(sessionOptions));

// Flash la use krnya sathi

app.use(flash());


// Implement Passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware for flash 

app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;       // Store current user information
    next();

});


// 1. Listing Route
 
app.use("/listings", listingRouter);


//  2. Review Route

app.use("/listings/:id/reviews", reviewRouter);


// 3. User Route

app.use("/", userRouter);


// 2. testListing Route     
/*
app.get("/testListing", async (req, res) => {

    let sampleListing = new Listing ( {

        title: "My New Villa",
        description: "By the beach",
        price: 12000,
        location: "Calangute, Goa",
        country: "India",
    });

    // sampleListing la Database madhe Store krnar

    await sampleListing.save();

    console.log("Sample was  Saved");
    
    res.send("Successful testing");
});

*/

// 1. Page not found error

app.use("*", (req, res, next) => {

    next(new ExpressError(404, "Page Not Found!"));

});


// Middleware for handle error
 
app.use((err, req, res, next) => {

    // de-construct express error

    let {statusCode=500, message="Something went wrong!"} = err;

   res.status(statusCode).render("./listings/error.ejs", { message });

   // res.status(statusCode).send(message);

});


app.listen(8080, () => {

    console.log("server is listening on port 8080");
});
