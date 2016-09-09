/**
 * db client implementation creating an universal (abstraction) layer
 * 
 * 
 * record is a structure of: { "id": "6665555554444444", "version":
 * "2-555544444", "userid": "someuser", "timestamp" : 456654123453, "attachment" :
 * "someimg.png" }
 * 
 * 
 * implemented methods are <BR>
 * <UL>
 * <LI> listRecords (userid, limit, offset, callback (err,list))
 * <LI> addRecord ( record, callback (err, record))
 * <LI> delRecord (userid,record, callback (err, record))
 * <LI> addAttachmentBytes (userid, record, callback(err, record))
 * <LI> addAttachmentStream (userid, record, request, callback (err,record))
 * <LI> getAttachmentBytes(userid, recordid, callback (err, attachment))
 * <LI> getAttachmentStream(userid, recordid, callback (err, stream,
 * contentType))
 * </UL>
 * 
 * 
 * internal cloudant record:
 * 
 */
var agentkeepalive = require('agentkeepalive');
var myagent = new agentkeepalive({
    maxSockets: 50,
    maxKeepAliveRequests: 0,
    maxKeepAliveTime: 30000
});


module.exports = exports = function DbClient(credentials, url, database) {


    var Cloudant = require("cloudant");
    var cloudant = Cloudant(credentials);
    var db = cloudant.db.use(database);



    /***************************************************************************
     * listRecords (userid, limit, offset, callback (err, list))
     * 
     * 
     * not yet implemented
     * 
     **************************************************************************/

    this.listRecords = function (userid, limit, offset, callback) {


        var selector = {
             "selector": {"userid": userid},
             "sort": [{"userid": "desc"}, {"timestamp": "desc"}],
            "fields": ["_id", "_rev", "userid", "timestamp", "rating", "_attachments"],
            "limit": limit,
            "skip": offset
        };

        db.find(selector, function(err, result) {
            if(err) {
                console.log(err);
                callback(err, null);
            }
            else {
                var resultList = [];
                for(var i=0; i<result.docs.length; i++) {
                    var d = toExtRecord(result.docs[i]);
                    resultList.push(d);
                }
                callback(null, resultList);
            }
        });
    };

    /**
     * addRecord (userid, record, callback (err, record))
     * 
     * add a record with to the db
     * 
     */
    this.addRecord = function (record, callback) {
        db.insert(record, function (err, body) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                var result = {
                    "id": body.id,
                    "version": body.rev
                };
                callback(null, result);
            }
        });
    };

    // delRecord (userid, record, callback (err, record))
    // addAttachmentBytes (userid, record, callback (err, record))
    // addAttachmentStream (userid, record, request, callback (err, record))
    // getAttachmentBytes(userid, recordid, callback (err, attachment))
    // getAttachmentStream(userid, recordid, callback (err, stream,
    // contentType))

    return this;

};


// return a DB record
function toDbRec(extRec, userid) {
    var dbRec = {
        "userid": userid,
        "timestamp": extRec.timestamp
        // TBD attachments
    };
    if(extRec.id) {
        dbRec._id = extRec.id;
    }
    if(extRec.version) {
        dbRec._rev = extRec.version;
    }
    return dbRec;
}


// return an externalized record
function toExtRecord(dbRec) {
    
    var extRec = {
        "id": dbRec._id,
        "version": dbRec._rev,
        "rating": dbRec.rating,
        "timestamp": dbRec.timestamp
        // TBD attachments
        
    };
    return extRec;
    
}