const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Review Schema

const reviewSchema = new Schema( {

    comment: String,

    rating: {

        type: Number,
        min: 1, 
        max: 5,
    },

    createdAt: {

        type: Date,
        default: Date.now(),
    },

    // Updated Part

    author: {

        type: Schema.Types.ObjectId,
        ref: "User",

    },
    
});

module.exports = mongoose.model("Review", reviewSchema);