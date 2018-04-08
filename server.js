//https://github.com/cloudant/nodejs-cloudant
//https://www.tonyerwin.com/2014/09/redirecting-http-to-https-with-nodejs.html
//https://bitcoinaverage.com/

var cloudantUsernameDirty = "511ca238-fccd-486b-b4a8-3441a50531bc-bluemix";
var cloudantPasswordDirty = "84da1dc77eccb3f811f8218aad8178d1ba45fa462ab8751a49ba85b35efe1927";

var BTCPublicDirty = "YzNiYzA2MTgzYTc4NDNkZGExNTAyZWFhZGJlZGE4YWQ";
var BTCSecretDirty = "ZGRiNWMxZDRmMDhmNDY4NTk3OWMwOWM5ZTJiZDY0ZTNlYTQzNDg3MTBmMGE0NGMxOWNjNTJiMGM3M2MwOGViOQ";

var googleKeyDirty = "AIzaSyDY7XntI3yeexRyoS-_kUAfl3yIfGxIZFE";
var darkSkyKeyDirty = "3260f4cbe8c6ad8402020d91728cda57";

console.log("VCAP SERVICES: " + JSON.stringify(process.env.VCAP_SERVICES));
var cloudantUsername;
var cloudantPassword;

var BTCPublic;
var BTCSecret;

var googleKey;
var darkSkyKey;

if(process && process.env && process.env.VCAP_SERVICES) {

  BTCPublic = process.env.BTCPublic;
  BTCSecret = process.env.BTCSecret;

  googleKey = process.env.googleKey;
  darkSkyKey = process.env.darkSkyKey;

  var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  for (var svcName in vcapServices) {
    if (svcName.match(/^cloudantNoSQLDB.*/)) {
      cloudantUsername = vcapServices[svcName][0].credentials.username;
      cloudantPassword = vcapServices[svcName][0].credentials.password;
      break;
    }
  }
}
else {
  BTCPublic = BTCPublicDirty;
  BTCSecret = BTCSecretDirty;

  googleKey = googleKeyDirty;
  darkSkyKey = darkSkyKeyDirty;

  cloudantUsername = cloudantUsernameDirty;
  cloudantPassword = cloudantPasswordDirty;

}

//import express.js
var express = require("express");
var favicon = require("serve-favicon");
//assign it to variable app
var app = express();
//create a server and pass in app as a request handler
var serv = require("http").createServer(/*httpsOptions, */app); //Server-11
var Cloudant = require("cloudant");
var crypto = require("crypto-js");
var request = require("request");

var darkSky = require("forecast.io");

var nearbyCities = require("nearby-big-cities");
var geoLib = require("geolib");

// CRYPTO / BITCOINAVERAGE API
var timestamp = Math.floor(Date.now() / 1000);
var payload = timestamp + "." + BTCPublic;
var hash = crypto.HmacSHA256(payload, BTCSecret);
var hexHash = crypto.enc.Hex.stringify(hash);
var signature = payload + "." + hexHash;
var tickerBTCUSDUrl = "https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD";
var bitcoinDataBody;

// DARKSKY
var options = {
  APIKey: darkSkyKey,
  timeout: 1000
},
darksky = new darkSky(options);

// GEOLIB
var distances = [];

// For Server events at set intervals
var lastProcessedHour = -1;

// Initialize the library with my account.
var cloudant = Cloudant({account:cloudantUsername, password:cloudantPassword, maxAttempt: 5, plugins: { retry: { retryErrors: true, retryStatusCodes: [ 429, 404 ] } } }, function(err, cloudant) {
  if (err) {
    return console.log("Failed to initialize Cloudant: " + err.message);
  }});

  cloudant.db.list(function(err, allDbs) { console.log("All my databases: %s", allDbs.join(", "))});

  var db = cloudant.db.use("user_data");

  var sdb = cloudant.db.use("survey_data");

  var update;
  var ldbArray = []; // Leaderboard array


  function leaderboardPopulate(){
    db.view("Docs", "view-users", {limit: 10}, function(err, body){
      if(!err){
        console.log(body);
        body.rows.forEach(function(doc){
          console.log(doc.key[0]);
        });
      }
      else{
        console.log(err);
      }
    });

  }
  //send a index.html file when a get request is fired to the given
  //route, which is ‘/’ in this case
  // app.get("/",function(req, res) {
  // 	res.sendFile(__dirname + "/client/index.html");
  // });
  //this means when a get request is made to ‘/client’, put all the
  //static files inside the client folder
  //Under ‘/client’. See for more details below
  app.use(favicon(__dirname + "/client/assets/favicon.ico"));
  app.use("/client",express.static(__dirname + "/client"));
  app.use("/assets",express.static(__dirname + "/client/assets"));
  app.use("/lib",express.static(__dirname + "/lib"));
  //app.use("/socket.io",express.static(__dirname + "/node_modules/socket.io"));

  app.get("/",function(req,res){
    res.sendFile(__dirname+"/client/index.html");
  });

  //listen on port 2000
  serv.listen(process.env.PORT || process.env.VCAP_APP_PORT || 2000);

  // Enable reverse proxy support in Express. This causes the
  // the "X-Forwarded-Proto" header field to be trusted so its
  // value can be used to determine the protocol. See
  // http://expressjs.com/api#app-settings for more details.
  app.enable("trust proxy");

  // Add a handler to inspect the req.secure flag (see
  // http://expressjs.com/api#req.secure). This allows us
  // to know whether the request was via http or https.
  app.use (function (req, res, next) {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect("https://" + req.headers.host + req.url);
    }
  });

  console.log("Server started.");


  var btcOptions = {
    url: tickerBTCUSDUrl,
    headers: {
      "X-Signature": signature
    }
  };


  function btcCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("BITCOIN DATA SUCESSFULLY RECEIVED");
      bitcoinDataBody = JSON.parse(body);
    }
  }

  function coinFlip() {
    return Math.floor(Math.random()*2);
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


  process.on("exit", function() {
    console.log("Server is shutting down!");
  });

  function testEmit(){
    console.log("EMIT RECEIVED");
  }



  // binds the serv object we created to socket.io
  var io = require("socket.io")(serv);

  // listen for a connection request from any client
  io.sockets.on("connection", function(socket){
    console.log("socket connected");

    //output a unique socket.id
    console.log(socket.id);

    function bonusUpdate(dateNow, lastLogin){

      var elapsed = Date.parse(dateNow) - Date.parse(lastLogin);
      //console.log("ELAPSED SINCE LAST LOG IN: " + elapsed);

      //if(elapsed > 10000){
      if(elapsed > 86400000){
        socket.emit("dayBonus");
        console.log("DAY BONUS");
        return true;
      }
      else if(elapsed > 3600000){
        socket.emit("hourBonus");
        console.log("HOUR BONUS");
        return true;
      }
      return false;
    }

    // Test Socket Emits
    socket.on("testEmit", testEmit);

    socket.on("locDataGet", function locDataGet(lat, long){
      console.log("LOCATION DATA: " + lat + "\n" + long);

      var dsParams = {exclude: "minutely,hourly,daily,flags,alerts"};

      darksky.get(lat, long, dsParams, function (err, res, data) {
        if (err){
          console.log(err);
        }

        socket.emit("weatherSet", data);
      });

      var query = {latitude: lat, longitude: long};

      var cities = nearbyCities(query, 2);
      distances[0] = geoLib.getDistance(query, cities[0], 100, 1);
      distances[1] = geoLib.getDistance(query, cities[1], 100, 1);
      distances[2] = geoLib.getDistance(cities[0], cities[1], 100, 1);

      socket.emit("nearbyCities", cities, distances);

    });

    socket.on("likertResult", function likertResult(data){
      var time = new Date();
      sdb.insert(data, data._id + time, function(err) {
        if (err) {
          return console.log("Survey Insert ", err.message);
        }
        console.log("Likert result inserted.");
      });
    });

    socket.on("commentResult", function commentResult(data){
      var time = new Date();
      sdb.insert(data, data._id + " COMMENT " + time, function(err) {
        if (err) {
          return console.log("Survey Comment Insert ", err.message);
        }
        console.log("Comment result inserted.");
      });
    });


    // Listen for userName
    socket.on("saveName", function saveName(name){
      leaderboardPopulate();

      db.get(name, { include_docs: true }, function(err, body){
        if (err && err.statusCode == 404)
        {
          console.log("UNABLE TO FIND " + name +". CREATING...");
          db.copy("Default", name, { overwrite: false }, function(err, headers) {
            if (!err)
            { console.log("HEADER: " + headers);}

            db.get(name, function(err, body){
              if(err)
              {
                console.log("ERROR ON DOC GET\n" + err);
              }
              else {

                var date = new Date();
                update = body;

                update.dateCreated= date;
                update.dateLastLogin= date;
                update.coinflip = coinFlip();
                console.log("NEW COINFLIP: " + update.coinflip);
                update.totalLoginIn ++;

                db.insert(update, function(err) {
                  if (err) {
                    console.log("Error inserting data\n" + err);
                    return 500;
                  }
                  console.log("UPDATED BOTH TIMES");
                  socket.emit("ready");

                  return 200;
                });
              }
            });
          });

        }

        else {
          update = body;

          console.log("SAVE NAME LAST LOGIN: " + update.dateLastLogin);

          // bonusUpdate(date, update.dateLastLogin);
          // update.dateLastLogin= date;
          update.totalLoginIn ++;
          db.insert(update, function(err) {
            if (err) {
              console.log("Error inserting data on Login\n" + err);
              return 500;
            }
            console.log("UPDATED LAST LOGIN TIME");
            socket.emit("ready");
            return 200;
          });
          console.log(err);

        }
      });
    });

    // Listen for user data update
    socket.on("userUpdate", function userUpdate(userData, name){
      var date = new Date();
      var serverReceive = JSON.parse(userData);

      if(bonusUpdate(date.toISOString(), serverReceive.dateLastLogin)){
        console.log("BONUS TRIGGERED");

        serverReceive.dateLastLogin = date.toISOString();
      }

      db.find({selector:{_id: name}}, function(err, result){
        if(err){
          console.log(err);
        }
        // console.log("PRINTING BODY FROM DOC:\n" + body);
        var dataUpdate = result.docs[0];

        if(dataUpdate != serverReceive)
        {
          dataUpdate = serverReceive;
          dataUpdate._rev = result.docs[0]._rev;

          db.insert(dataUpdate, function(err, body, doc) {
            if (err) {
              console.log("Error inserting data on update\n" + err);
              console.log(doc + "\n" + JSON.stringify(dataUpdate));
              return 500;
            }
            socket.emit("userDataRefresh", JSON.stringify(dataUpdate));
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

        socket.emit("userData", JSON.stringify(result.docs[0]));
        socket.emit("bitcoinData", JSON.stringify(bitcoinDataBody));
      });

    });

  });
