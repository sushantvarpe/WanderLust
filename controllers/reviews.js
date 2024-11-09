const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


//  Reviews Route

//  1.  POST Review Route

// 1. Create Review Route

module.exports.createReview = async(req, res) => {

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    // Author of Review

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

     // Flash

    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);
    
};


// 2. Delete Review Route

module.exports.destroyReview = async(req, res) => {

    let { id, reviewId } = req.params;

    // Listing madhil review id delete krnyasathi

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});

    await Review.findByIdAndDelete(reviewId);

     // Flash

    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);

};