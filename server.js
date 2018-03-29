
//https://github.com/cloudant/nodejs-cloudant
//https://www.tonyerwin.com/2014/09/redirecting-http-to-https-with-nodejs.html
//https://bitcoinaverage.com/

var httpsOptions = {

};

//import express.js
var express = require('express');
//assign it to variable app
var app = express();
//create a server and pass in app as a request handler
var serv = require('http').createServer(/*httpsOptions, */app); //Server-11
var Cloudant = require('cloudant');
var crypto = require('crypto-js');
var request = require('request');

var cloudantUser = '511ca238-fccd-486b-b4a8-3441a50531bc-bluemix'; // CLOUDANT
var cloudantPassword = "84da1dc77eccb3f811f8218aad8178d1ba45fa462ab8751a49ba85b35efe1927";

// CRYPTO / BITCOINAVERAGE API
var public_key = 'YzNiYzA2MTgzYTc4NDNkZGExNTAyZWFhZGJlZGE4YWQ';
var secret_key = 'ZGRiNWMxZDRmMDhmNDY4NTk3OWMwOWM5ZTJiZDY0ZTNlYTQzNDg3MTBmMGE0NGMxOWNjNTJiMGM3M2MwOGViOQ';
var timestamp = Math.floor(Date.now() / 1000);
var payload = timestamp + '.' + public_key;
var hash = crypto.HmacSHA256(payload, secret_key);
var hex_hash = crypto.enc.Hex.stringify(hash);
var signature = payload + "." + hex_hash;
var ticker_btcusd_url = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD';
var bitcoinDataBody;


// For Server events at set intervals
var lastProcessedHour = -1;

// Initialize the library with my account.
var cloudant = Cloudant({account:cloudantUser, password:cloudantPassword, maxAttempt: 5, plugins: { retry: { retryErrors: true, retryStatusCodes: [ 429, 404 ] } } }, function(err, cloudant) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }});

  cloudant.db.list(function(err, allDbs) { console.log('All my databases: %s', allDbs.join(', '))});

  var db = cloudant.db.use("user_data");

  var sdb = cloudant.db.use("survey_data");

  var update;

  //send a index.html file when a get request is fired to the given
  //route, which is ‘/’ in this case
  // app.get('/',function(req, res) {
  // 	res.sendFile(__dirname + '/client/index.html');
  // });
  //this means when a get request is made to ‘/client’, put all the
  //static files inside the client folder
  //Under ‘/client’. See for more details below

  app.use('/client',express.static(__dirname + '/client'));
  app.use('/assets',express.static(__dirname + '/client/assets'));
  app.use('/lib',express.static(__dirname + '/lib'));
  //app.use('/socket.io',express.static(__dirname + '/node_modules/socket.io'));

  app.get('/',function(req,res){
    res.sendFile(__dirname+'/client/index.html');
  });

  //listen on port 2000
  serv.listen(process.env.PORT || process.env.VCAP_APP_PORT || 2000);

  // Enable reverse proxy support in Express. This causes the
  // the "X-Forwarded-Proto" header field to be trusted so its
  // value can be used to determine the protocol. See
  // http://expressjs.com/api#app-settings for more details.
  app.enable('trust proxy');

  // Add a handler to inspect the req.secure flag (see
  // http://expressjs.com/api#req.secure). This allows us
  // to know whether the request was via http or https.
  app.use (function (req, res, next) {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });

  console.log("Server started.");


  var btcOptions = {
    url: ticker_btcusd_url,
    headers: {
      'X-Signature': signature
    }
  };


  function btcCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("BITCOIN DATA SUCESSFULLY RECEIVED");
      bitcoinDataBody = JSON.parse(body);
    }
  }

  // Request bitcoin data on server start
  console.log("REQUESTING BITCOIN DATA");
  request(btcOptions, btcCallback);

  // set interval to request bitcoin data every 6 hours, 4 times a day
  setInterval(function() {
    var d = new Date();
    var currentHour = d.getHours();
    if(currentHour == 0 || currentHour == 6 || currentHour == 12 || currentHour == 18)
    {
      if (currentHour != lastProcessedHour) {
        console.log("GETTING BITCOIN DATA. HOUR IS: " + currentHour);

        request(btcOptions, btcCallback);

        lastProcessedHour = currentHour;
      }
    }
  }, 10000);


  process.on('exit', function() {
    console.log('Server is shutting down!');
  });

  function testEmit(){
    console.log("EMIT RECEIVED");
  }

  // binds the serv object we created to socket.io
  var io = require('socket.io')(serv);

  // listen for a connection request from any client
  io.sockets.on('connection', function(socket){
    console.log("socket connected");

    //output a unique socket.id
    console.log(socket.id);

    // Test Socket Emits
    socket.on("testEmit", testEmit);

    socket.on("likertResult", function likertResult(data){
      var time = new Date();
      sdb.insert(data, data._id + time, function(err, body, header) {
      if (err) {
        return console.log('Survey Insert ', err.message);
      }
      console.log('Likert result inserted.');
    });
    });

    // Listen for userName
    socket.on("saveName", function saveName(name){

      db.get(name, { include_docs: true }, function(err, body, data){
        if (err && err.statusCode == 404)
        {
          console.log("UNABLE TO FIND " + name +". CREATING...");
          db.copy("Default", name, { overwrite: false }, function(err, headers) {
            if (!err)
            { console.log("HEADER: " + headers);}

            db.get(name, function(err, body, data){
              if(err)
              {
                console.log("ERROR ON DOC GET\n" + err);
              }
              else {

                var date = new Date();
                // var dateInt = parseInt(date.getDate() + "" + (date.getMonth()+1) + "" + date.getFullYear());
                update = body;
                //console.log(body);
                update.dateCreated= date;
                update.dateLastLogin= date;
                update.totalLoginIn ++;

                db.insert(update, function(err, body, doc) {
                  if (err) {
                    console.log('Error inserting data\n' + err);
                    return 500;
                  }
                  console.log('UPDATED BOTH TIMES');
                  //console.log(body);
                  socket.emit("ready");
                  //socket.emit("userData", body);
                  return 200;
                });
              }
            });
          });

        }
        else {
          console.log(err);
          var date = new Date();
          update = body;
          update.dateLastLogin= date;
          update.totalLoginIn ++;
          db.insert(update, function(err, body, doc) {
            if (err) {
              console.log('Error inserting data on Login\n' + err);
              return 500;
            }
            console.log('UPDATED LAST LOGIN TIME');
            console.log(body);
            //socket.emit("userData", body);
            socket.emit("ready");
            return 200;
          });


        }
      });
      //doc.dateLastLogin
    });

    // Listen for user data update
    socket.on("userUpdate", function userUpdate(userData, name){
      var serverReceive = JSON.parse(userData);
      db.find({selector:{_id:  name}}, function(err, result){
        // console.log("PRINTING BODY FROM DOC:\n" + body);
        var dataUpdate = result.docs[0];
        //console.log("DATA UPDATE:\n" + JSON.stringify(dataUpdate));
        //console.log("SERVER HAS RECEIVED, PARSED:\n" + JSON.stringify(serverReceive));
        if(dataUpdate != serverReceive)
        {
          dataUpdate = serverReceive;
          dataUpdate._rev = result.docs[0]._rev;
          //console.log("SERVER HAS RECEIVED:\n" + JSON.stringify(dataUpdate));

          db.insert(dataUpdate, function(err, body, doc) {
            if (err) {
              console.log('Error inserting data on update\n' + err);
              console.log(doc + "\n" + JSON.stringify(dataUpdate));
              return 500;
            }
            // console.log('UPDATED SAVED USER DATA');
            // console.log("SAVED BODY:\n" + body);
            return 200;

          });
        }
      });
    });

    socket.on("demandUpdate", function demandUpdate(name)
    {
      console.log("NAME SUPPLIED: " + name);
      db.find({selector:{_id:  name}}, function(err, result){
        if(err)
        {
          console.log(err);
        }
        // else {
        //   body.rows.forEach(function(doc) {
        //     console.log(doc);
        //   });
        // }
        //console.log("DEMANDED DOC:\n" + JSON.stringify(result.docs[0]));
        socket.emit("userData", JSON.stringify(result.docs[0]));
        socket.emit("bitcoinData", JSON.stringify(bitcoinDataBody));
      });

    });

  });
