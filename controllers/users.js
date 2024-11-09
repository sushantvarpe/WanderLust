const User = require("../models/user.js");


// 1. Render SignUp Form

// 1. SignUp - GET

module.exports.renderSignupForm = (req, res) => {

    res.render("./users/signup.ejs");

};


// 2. Sign Up Route

// 2. SignUp - POST

module.exports.signup = async(req, res) => {

    try {
        let {username, email, password} = req.body;
    
        const newUser = new User({email, username});
    
        const registeredUser = await User.register(newUser, password);
     
        console.log(registeredUser);
    
        req.login(registeredUser, (err) => {
    
            if(err) {
    
                return next(err);
            }
                // Flash
    
            req.flash("success", "Welcome to Wanderlust!");
    
            res.redirect("/listings");
        });
    }
    catch(e) {
        
        // Flash
         
        req.flash("error", e.message);
    
        res.redirect("/signup");
    };
    
    };


    
// 3. Render Login Form

// 3. Login - GET

module.exports.renderLoginForm = (req, res) => {

    res.render("./users/login.ejs");

};

 
// 4. Login - POST

module.exports.login = async(req, res) => {

    // Flash

    req.flash("success", "Welcome back to Wanderlust!");

    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);

};


// 5. LogOut Route

module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if(err) {

           return next(err);
        }

        // Flash

        req.flash("success", "you are logged out!");

        res.redirect("/listings");
    });
};