/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
app.set('trust proxy', true);

var bodyParser = require('body-parser');
app.use(bodyParser.json());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var extApi = require('./routes/api.js');
app.use('/api', extApi);

var YuiComboHandler = require('./lib/yuicombo.js').YuiComboHandler;
app.get('/yui-combo', YuiComboHandler('./public/js/yui') );

// api
// TBD API route

// error handlers
app.use(clientErrorHandler);


function clientErrorHandler(err, req, res, next) {
	  if (req.xhr) {
	    res.status(500).send({ error: 'Something failed!' });
	  } else {
	    next(err);
	  }
	}


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
