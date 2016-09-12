
var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');

var jwtSecretKey = process.env.JWT_SECRET_KEY;
if (!jwtSecretKey) {
    trow(new Error('No JWT_SECRET_KEY defined'));
}


// authorize
/**
 * authorization url 
 * return a logon page, in this case a redirect to a google client logon
 */
router.get("/authorize", function (req, res, next) {
    
});

// fech the user identity ad redirec to the localhost page
// (cordova) with the token URL fragment
router.get("/callback", function (req, res, next) {
    
});


// token


module.exports = router;