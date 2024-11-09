const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require("./schema.js");



// 1. Middleware for Check Authenticate


module.exports.isLoggedIn = (req, res, next) => {

    if(!req.isAuthenticated()) {

      // Redirect Url

      req.session.redirectUrl = req.originalUrl;

        // Flash
  
        req.flash("error", "you must be logged in to create listing!");
  
        return res.redirect("/login");
  
      }
      next();
};


// 2. Save redirectUrl to locals


module.exports.saveRedirectUrl = (req, res, next) => {

  if (req.session.redirectUrl) {

    res.locals.redirectUrl = req.session.redirectUrl;

  }

  next();
};


// 3. For Listing Authorization


module.exports.isOwner = async(req, res, next) => {

  let {id} = req.params;

  let listing = await Listing.findById(id);

  if(!listing.owner._id.equals(res.locals.currUser._id)) {

    req.flash("error", "You are not the owner of this listing");

   return res.redirect(`/listings/${id}`);

  }

  next();

};


// 4. Server side Validation for Listing ( Middleware )


module.exports.validateListing = (req, res, next) => {

  const {error} = listingSchema.validate(req.body);  // aapn jo schema define kela aahe to req.body satisfy krte ka ?

  if(error) {

      const errMsg = error.details.map((el) => el.message).join(",");

      throw new ExpressError(400, errMsg);
  } 
  else {
      next();
  };

};


// 5. Server side validation for Review


module.exports.validateReview = (req, res, next) => {

  let {error} = reviewSchema.validate(req.body);  // aapn jo schema define kela aahe to req.body satisfy krte ka ?

  if(error) {

      let errMsg = error.details.map((el) => el.message).join(",");

      throw new ExpressError(400, errMsg);
  } 
  else {
      next();
  };

};


// 6. For Review Authorization


module.exports.isReviewAuthor = async(req, res, next) => {

  let { id, reviewId } = req.params;

  let review = await Review.findById(reviewId);

  if(!review.author.equals(res.locals.currUser._id)) {

    req.flash("error", "You are not the author of this review");

   return res.redirect(`/listings/${id}`);

  }

  next();

};
