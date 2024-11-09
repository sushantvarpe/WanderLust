const express = require("express");

const router = express.Router();

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// Require User Controller

const userController = require("../controllers/users.js");


// Use router.route() method

// Combine 1. Render Signup Form & 2. SignUp - POST        Common Path ("/signup")


router.route("/signup")

// 1. Render SignUp Form

.get(userController.renderSignupForm)

// 2. SignUp - POST

.post( wrapAsync(userController.signup));



// Combine 3. Render Login From &  4. Login - POST         Common Path = ("/login")


router.route("/login")

// 3. Render Login Form

.get(userController.renderLoginForm)

// 4. Login  - POST

.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),  userController.login);


// 5. LogOut Route

router.get("/logout", userController.logout);


module.exports = router;  