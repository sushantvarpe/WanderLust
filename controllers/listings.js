const Listing = require("../models/listing");

// Require Geocoding service

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');        // Service use krnar Geocoding

// Require Access Token

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// Add Coordinate after edit location

const addCoordinates = async (listing) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: listing.location,
      limit: 1,
    })
    .send();

  listing.geometry = response.body.features[0].geometry;
  return listing;
};


// 1. Index Route Callback

module.exports.index = async (req, res) => {

    const allListings = await Listing.find({});
  
    res.render("./listings/index.ejs", {allListings});

  };


// 2. New Route

module.exports.renderNewForm = (req, res) => {

  res.render("./listings/new.ejs");

};


// 3. Show Route

module.exports.showListing = async (req, res) => {
  
  let {id} = req.params;

  const listing = await Listing.findById(id).populate( {path: "reviews", populate: { path: "author"}, }).populate("owner");

  // Error Flash

  if(!listing) {

    req.flash("error", "Listing you requested for does not exits!");

   return res.redirect("/listings");

  }

  res.render("./listings/show.ejs", {listing});

};



// 4. Create Route

module.exports.createListing = async (req, res, next) => {

  // Forward Geocoding

 let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();  

// Cloudinary URL / Link save in MongoDb

let url = req.file.path;
let filename = req.file.filename;


const newListing = new Listing (req.body.listing);

newListing.owner = req.user._id;

newListing.image = {url, filename};

 // Location che Co-ordinates Database madhe store krne

newListing.geometry =  response.body.features[0].geometry; 

let savedListing = await newListing.save(); 

console.log(savedListing);      



// Flash

req.flash("success", "New Listing Created!");

res.redirect("/listings");   

};



// 5. Edit Route

module.exports.renderEditForm = async (req, res) => {
 
  let {id} = req.params;

  const listing = await Listing.findById(id);

      // Error Flash

      if(!listing) {

        req.flash("error", "Listing you requested for does not exits!");

       return res.redirect("/listings");

      }

      // Changes in Image Quality  ( Edit Image )

    let originalImageUrl = listing.image.url;
    
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("./listings/edit.ejs", { listing, originalImageUrl });

};


// 6. Update Route

module.exports.updateListing = async (req, res) => {

  let { id } = req.params;

  // let {title, description, image, price, country, location} = req.body;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {

    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {
      url,
      filename,
    };

  }


   listing = await addCoordinates(listing);
  
  await listing.save();

  // Flash 

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};


// 7. Delete Route

module.exports.destroyListing = async (req, res) => {

  let { id } = req.params;

 let deletedListing = await Listing.findByIdAndDelete(id);

 console.log(deletedListing);

  // Flash

  req.flash("success", "Listing Deleted!");

 res.redirect("/listings"); 
};