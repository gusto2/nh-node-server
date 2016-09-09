/**
 * API for external clients
 * atm without authorization
 * 
 * 
 * test: http://jwtbuilder.jamiekurtz.com/
 * 
 * <ul>
 * <li> GET / ?skip=20
 * <li> POST /
 * <li> POST /upload
 * <li> TBD: attachment
 * </ul>
 * 
 */


var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var cfenv = require('cfenv');


//get the client
var appConfig = cfenv.getAppEnv().services.cloudantNoSQLDB[0].credentials;
var dbName = process.env.nahovno_db;
if (!dbName) {
    trow(new Error('No nahovno_db defined'));
}

var DbClient = require('../lib/dbclient.js');
var dbClient = DbClient(
        {
            account: appConfig.username,
            password: appConfig.password
        },
        appConfig.url,
        dbName
        );


var jwtSecretKey = process.env.JWT_SECRET_KEY;
if (!jwtSecretKey) {
    trow(new Error('No JWT_SECRET_KEY defined'));
}

var DEF_LIST_LIMIT = 20;

/** 
 * authorize access
 * @param {type} param1
 * @param {type} param2
 * 
 */
router.all('*', function (req, res, next) {

    var token = getAuthorizationToken(req);
    if (!token) {
        writeUnauhorizedResponse(req, res, 'No authorization token present');
        return;
    }
    var decodedToken = null;
    try {
        decodedToken = jwt.decode(token, jwtSecretKey);
//        console.log(decodedToken);
        req.userId = decodedToken.sub;
    } catch (e) {
        console.log('Invalid token');
        res.status(403);
        res.send("Authorization failed");
        res.end();
        return;
    }
    // check the expiration
//    var timestampNow = Math.round((new Date().getTime() / 1000));
//    if (!decodedToken.exp || decodedToken.exp < timestampNow || decodedToken.exp > timestampNow + 3600) {
//        res.type('text');
//        res.status('403');
//        res.send('Expired');
//        res.end();
//        return;
//    }

    next();
});




/**
 * list records
 */
router.get('/', function (req, res, next) {
    var userId = req.userId;
    var skip = req.query['skip'];
    if(!skip) {
        skip = 0;
    }
    else {
        skip = parseInt(skip);
    }
    dbClient.listRecords(userId, DEF_LIST_LIMIT, skip, function(err, list) {
        if(err) {
            sendExceptionMessage(res, "Unable to fetch any records");
        }
        else {
            var r = {
                "docs": list
            }
            res.type('json');
            res.send(JSON.stringify(r));
            res.end();
        }
        
    });
});

/**
 * create new  record
 */
router.post('/', function (req, res, next) {
    if (req.is('json')) {
        var userid = req.userId;
        var extRecord = (req.body);


        var dbRec = {
            "userid": userid,
            "timestamp": new Date().getTime(),
            "rating": extRecord.rating
                    // TBD attachment
        };

        dbClient.addRecord(dbRec, function (err, result) {
            if (err) {
                console.log(err);
                sendExceptionMessage(res, "Unable to store the record");
            } else {
                // TBD clear att ref
                delete dbRec.userid ;
                dbRec.id = result.id;
                dbRec.version = result.version;
                res.type('json');
                res.send(JSON.stringify(dbRec));
                res.end();
            }
        });

    } else {
        sendExceptionMessage(res, "Unsupported content type ");
    }
//    next();
});


/**
 * create new  record, support multipart upload
 */
router.post('/upload', function (req, res, next) {

    next();
});

// utilities

/**
 *  return the authorization token (still encoded) from the access_token 
 *  parameter or the Authorization header
 *  
 *  example:
 *  
 * @param {type} req
 * @returns {undefined}
 */
function getAuthorizationToken(req) {
    var bearerToken = req.headers['authorization'];
    var paramToken = req.query.access_token;

    if (bearerToken) {
        if (bearerToken.indexOf('Bearer ') == 0) {
            bearerToken = bearerToken.substring(6, bearerToken.length);
            return bearerToken.trim();
        } else {
            console.log('Authorization token present, but no Bearer keyword');
            return null;
        }
    } else if (paramToken) {
        return paramToken;
    } else {

        return null;
    }
}

function sendExceptionMessage(res, msg) {
    res.status(400);
    res.type('json');
    var errMsg = {"error": msg};
    res.send(JSON.stringify(errMsg));
    res.end();
}


function writeUnauhorizedResponse(req, res, cause) {
    console.log('Unauthorized: ' + cause);
    res.status(403);
    res.type('text');
    res.send("Unauthorized");
    res.end();
}


module.exports = router;