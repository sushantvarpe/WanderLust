const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

// Require multer for parsing "multipart/form-data"

 const multer  = require('multer');

// Require cloudConfig

const { storage } = require("../cloudConfig.js");

// File cloud chya storage la upload krne

const upload = multer({ storage });

// Require Controller

const listingController = require("../controllers/listings.js");


// Use router.route method

// Combine 1. Index Route &  4. Create Route      Common Path ("/")


router.route("/")

       // 1. Index Route

      .get(wrapAsync(listingController.index))

      // 4. Create Route

      .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


      // 2. New Route
  
  router.get("/new", isLoggedIn, listingController.renderNewForm);
  


// Combine 3. Show Route & 6. Update Route & 7. Delete Route        Common Path ("/:id")


router.route("/:id")

      // 3. Show Route

      .get( wrapAsync(listingController.showListing))

      // 6. Update Route
    
      .put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))

      // 7. Delete Route

      .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));




// 5. Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
