var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

var canvasWidth = 800;
var canvasHeight = 600;

//make a phaser game
clientGame = new Phaser.Game(canvasWidth,canvasHeight, Phaser.AUTO, "gameDiv", {init: init, preload: preload, create:create, update: update});

var spacelayer;
var backgroundLayer;
var fogLayer;
var storeLayer;
var characterLayer;
var groundLayer;
var rainLayer;
var uiLayer;
var fadeLayer;
var shaderLayer;

var localTime;

var currencyTotal = 0;
var autoClick = 0;
var autoPerSec = 0;

var timeNow;
var visibility;
var precipProbability;

var userName;
var tick = Date.now();
var userDataLocal;

var startFlag = false;
var studyFlag = false;
var nameRegistered;

var bitcoinData;
var btcDayPercentChange = 0;
var chickenTextTween;

function init(){
  this.game.scale.setMinMax(100, 75, 600, 450);
  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  clientGame.plugins.add(PhaserInput.Plugin);

  this.game.stage.disableVisibilityChange = true;
  this.game.stage.smoothed = false;


  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.game.canvas.oncontextmenu = function(e){e.preventDefault();};

  spacelayer = clientGame.add.group();
  backgroundLayer = clientGame.add.group();
  fogLayer = clientGame.add.group();
  storeLayer = clientGame.add.group();
  characterLayer = clientGame.add.group();
  groundLayer = clientGame.add.group();
  rainLayer = clientGame.add.group();
  uiLayer = clientGame.add.group();
  fadeLayer = clientGame.add.group();
  shaderLayer = clientGame.add.group();
}

function preload() {
  assetLoad();
  testData();
  localTime = new Date();
  clientGame.scale.refresh();
}

function testData(){
  clientGame.load.json("userData", "client/lib/defaultData.JSON");
  clientGame.load.json("bitcoinData", "client/lib/defaultBTC.JSON");
}

function testDataRetrieve(){
  userDataLocal = clientGame.cache.getJSON("userData");
  currencyTotal = parseInt(userDataLocal.totalClicks);
  console.log("Starting currency total: " + currencyTotal);
  startFlag = true;
}

function distanceFormatter(num){
  return (num / 1000).toFixed(1).replace(/\.0$/, "") + "Km";
}

function create () {
  console.log("client started");

  audioAssign();

  //listen to the “connect” message from the server. The server
  //automatically emit a “connect” message when the client connects.When
  //the client connects, call onsocketConnected.
  socket.on("connect", onsocketConnected);
  socket.on("disconnect", function(reason){
    console.log("DISCONNECTED! Reason: " + reason);
    setTimeout(function(){
      console.log("Retrying Connection...");
      socket.open();
    }, 5000);
  });

  socket.on("reconnect", function(){
    console.log("RECONNECTED");
  });

  socket.on("connect_failed", function() {
    console.log("Sorry, there seems to be an issue with the connection!");
  });

  socket.on("bitcoinData", function(data) {
    if(userDataLocal.coinflip === 1){
      bitcoinData = clientGame.cache.getJSON("bitcoinData");

      bitcoinData = JSON.parse(data);

      btcDayPercentChange = bitcoinData.changes.percent.day;
    }
  });

  socket.on("weatherSet", function(data){
    console.log("Weather data received");
    visibility = data.currently.visibility;
    precipProbability = data.currently.precipProbability;

    addFog();
    addRain();
  });

  socket.on("nearbyCities", function(cities, distances){
    console.log(cities);
    console.log(distances);

    if(userDataLocal.coinflip === 1){
      var name;
      for(var i = 0; i < cities.length; i++)
      {
        if(cities[i].name.length > 8)
        {
          name = cities[i].name.substring(0,7) + "': ";
        }
        else{
          name = cities[i].name + ": ";
        }
        signTexts[i].setText(name + distanceFormatter(distances[i]));
      }
    }

  });

  socket.on("userData", function(userData){
    userDataLocal = clientGame.cache.getJSON("userData");
    //console.log("BEFORE SERVER WRITE:\n" + userDataLocal);
    userDataLocal = JSON.parse(userData);
    //console.log("AFTER SERVER WRITE:\n" + userDataLocal);

    currencyTotal = btcPlusMinus(parseInt(userDataLocal.currency));
    menuOptionsCreate();

    autoPerSec = userDataLocal.autoPerSec;

    for(var i = 0; i < userDataLocal.upgradeList.length; i++)
    {
      menuData.data[i].bought = userDataLocal.upgradeList[i].timesClicked;
      updatePrice(i);

    }

    modifierTotal = Math.round(modifierTotal);
    console.log("Starting Modifier: " + modifierTotal);
    console.log("Starting currency total: " + currencyTotal);

    // Draw the Store
    storeDraw(frameGet());
    signDraw();
    // Create the Employees
    employeeNum();

    // If the user is part of the Data group of the study
    if(userDataLocal.coinflip === 1){
      studyCreate();
      skySet(localHours);
    }
    else{
      skySet(12);
    }

    // Allow User Input, starting the game
    startFlag = true;

    createChicken();


    console.log("Listening for User Data");
  });

  socket.on("userDataRefresh", function(userData){

    userDataLocal = JSON.parse(userData);
    //console.log("AFTER SERVER WRITE:\n" + userDataLocal);

  });

  socket.on("ready", function(){
    console.log("READY! STARTING REQUEST FOR DATA, AND FORCE REQUESTING FIRST BATCH");
    demandUpdate();
  });

  socket.on("hourBonus", function(){
    console.log("Hour Bonus!");
    var hourlyBonus = 1 +(userDataLocal.upgradeList[8].timesClicked * menuData.data[8].multiplier) +  (userDataLocal.totalClicks *  userDataLocal.totalBought);
    currencyTotal +=  Math.round((1+hourlyBonus) * 10)/10;
    console.log("HOURLY BONUS: " + hourlyBonus);

    chickenText = clientGame.add.text(220,80, "HOURLY BONUS!\n+" + intStringFormatter(hourlyBonus), notificationStyle);
    chickenText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    chickenTextTween = clientGame.add.tween(chickenText).to({alpha:0}, 5000,Phaser.Easing.Linear.None, true);
  });

  socket.on("dayBonus", function(){
    console.log("Day Bonus!");
    var dailyBonus = 1 +(userDataLocal.upgradeList[9].timesClicked * menuData.data[9].multiplier) + (userDataLocal.totalClicks *  userDataLocal.totalBought)* 1000;

    currencyTotal += Math.round((1+dailyBonus) * 10)/10;

    console.log("DAILY BONUS: " + dailyBonus);

    chickenText = clientGame.add.text(220,80, "Daily BONUS!\n+" + intStringFormatter(dailyBonus), notificationStyle);
    chickenText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    var chickenTextTween = clientGame.add.tween(chickenText).to({alpha:0}, 5000,Phaser.Easing.Linear.None, true);
  });

  var localHours = localTime.getHours();
  nameRegistered = false;


  uiLayer.inputEnabled = true;

  this.game.physics.startSystem(Phaser.Physics.ARCADE);


  bgDraw();
  groundDraw();
  menuAssetsCreate();
  createText();
  fade();
  //createStartText();
  crtDraw();
  inputListenerStart();
  testEmit();
  //testDataRetrieve();


  setInterval(function() {
    if(startFlag){
      // FIXED BY ROBSON NEWTON, 2018. HIS RECORD 'autoPerSec' OF 43312356670044 WILL NOT GO FORGOTTEN
      modifierTotal = 0;
      autoClick = 0;
      clickCount = 0;

      for(var i = 3; i < 6; i++)
      {
        modifierTotal += (menuData.data[i].bought * menuData.data[i].multiplier);
      }
      for(var i = 0; i < 3; i++)
      {
        autoClick += (menuData.data[i].bought * menuData.data[i].multiplier);
      }
      autoPerSec = Math.round(autoClick*(modifierTotal * btcPlusMinus((1+ btcDayPercentChange))));
      console.log("AUTOPERSEC: " + autoPerSec);
      userDataLocal.autoPerSec = autoPerSec;

      currencyTotal += autoPerSec;
    }
  }, 1000);

  createLikert();
  createComment();
}

//Function only fired if coinflip of 1
function studyCreate(){
  btcText = clientGame.add.text(20,50, "BTC day change: 0%", style);
  btcText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  uiLayer.add(btcText);

  geoFindMe();

  studyFlag = true;
}

function update() {
  updateText();
  crtFilter.update();
  crtScreen.moveUp();

  if(startFlag == true)
  {
    timeNow = Date.now();
    if ( timeNow - tick > 3000) {
      //userDataLocal.totalClicks = currencyTotal;
      userUpdate(userDataLocal, name);

      tick = Date.now();
    }

  }
}

function frameGet(){
  if(userDataLocal.totalClicks < 500){
    return 0;
  }
  else if(userDataLocal.totalClicks < 1500){
    return 1;
  }
  else {
    return 2;
  }
}

function employeeNum(){


        createHireling(userDataLocal.upgradeList[0].timesClicked /10);

        createEmployee(userDataLocal.upgradeList[1].timesClicked /10);

        createTrader(userDataLocal.upgradeList[2].timesClicked /10);

}

function btcPlusMinus(btc){
  if (btc < 0)
  {
    btc *= -1;
  }
  return btc;
}

function testEmit(){
  socket.emit("testEmit");
}

function demandUpdate(){
  socket.emit("demandUpdate", userName);
  console.log("UPDATE DEMANDED");
}

function saveName(name){
  socket.emit("saveName", name);
  console.log("NAME SENT");
  nameRegistered = true;
}

function userUpdate(userData, name){
  userData.currency = currencyTotal;
  socket.emit("userUpdate", JSON.stringify(userData), userName);
}

// this function is fired when we connect
function onsocketConnected () {
  console.log("connected to server");
  if (nameRegistered == false)
  {
    saveName(name);
  }
}
function coinFlip() {
  return Math.floor(Math.random() * 2);
}
