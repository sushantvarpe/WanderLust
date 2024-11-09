// Require the Cloudinary library

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



// Configure krnar

// Backend la cloudinary Account la jodne

cloudinary.config({

    cloud_name: process.env.CLOUD_NAME,

    api_key: process.env.CLOUD_API_KEY,

    api_secret: process.env.CLOUD_API_SECRET,

});


// Store la define krnar

const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {

      folder: 'wanderlust_DEV',

      allowedFormats: ["png", "jpg", "jpeg"], 

    },

  });


  module.exports = {

    cloudinary,

    storage,
    
  };