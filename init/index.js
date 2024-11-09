const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Connect to Database

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then( () => {

    console.log("connected to DB");
})
. catch( (err) => {
    console.log(err); 
});

async function main() {

    await mongoose.connect(MONGO_URL);
}

// function for initilize database

const initDB = async () => {

    await Listing.deleteMany({});  // db madhil old random data delete krnar

    initData.data =  initData.data.map((obj) => ({...obj, owner: '672ae3f9178e519a8bb082f5'}));

    // old data remove zalyavr aapla data add krnar

    await Listing.insertMany(initData.data);

    console.log("Data was initilized");
};

initDB();