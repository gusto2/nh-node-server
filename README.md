# Node.js Starter Overview

The Node.js Starter demonstrates a simple, reusable Node.js web application based on the Express framework.

## Run the app locally

1. [Install Node.js][]
2. Download and extract the starter code from the Bluemix UI
3. cd into the app directory
4. Run `npm install` to install the app's dependencies
5. Run `npm start` to start the app
6. Access the running app in a browser at http://localhost:6001

[Install Node.js]: https://nodejs.org/en/download/

## environmental variables

 - running locally: VCAP_SERVICES
 - nahovno_db - CloudantDB name
 - JWT_SECRET_KEY - random
 
# create index

curl -H POST -u xxxxx:xxxxx -d '{ "index": { "fields": ["userid", "timestamp"] }, "name" : "userid-index",  "type" : "json" }' https://xxxxx.cloudant.com/nahovno/_index

