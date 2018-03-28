var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

var canvas_width = 800;
var canvas_height = 600;
var scale = 1;

//make a phaser game
clientGame = new Phaser.Game(canvas_width,canvas_height, Phaser.AUTO, 'gameDiv', {init: init, preload: preload, create:create, update: update});

var gameProperties = {
  //this is the actual game size to determine the boundary of
  //the world
  gameWidth: 4000,
  gameHeight: 4000,
};

var localTime;
var lastActive;

var daySpeed = 2000;

var currencyTotalText;
var currencyTotal = 0;
var currencyLocal;

var click;
var lastclick;
var timeNow;
var tickCounter;

var userName;
var userNameText;
var tick = Date.now();
var userDataLocal;

var startFlag = false;
var nameRegistered;

var bitcoinData;
var btcDayPercentChange;

function init(){
  clientGame.plugins.add(PhaserInput.Plugin);

  this.game.stage.disableVisibilityChange = true;
  this.game.stage.smoothed = false;
  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.setMinMax(100, 75, 1000, 750);
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.game.canvas.oncontextmenu = function(e){e.preventDefault();};
}

function preload() {
  assetLoad();
  testData();
  localTime = new Date();
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

function create () {
  console.log("client started");
  //listen to the “connect” message from the server. The server
  //automatically emit a “connect” message when the client connects.When
  //the client connects, call onsocketConnected.
  socket.on("connect", onsocketConnected);

  socket.on('connect_failed', function() {
    document.write("Sorry, there seems to be an issue with the connection!");
  });

  socket.on("bitcoinData", function(data) {
    bitcoinData = clientGame.cache.getJSON("bitcoinData");
    console.log(bitcoinData);

    bitcoinData = JSON.parse(data);

    btcDayPercentChange = bitcoinData.changes.percent.day;
  });

  socket.on("userData", function(userData){
    //clientGame.load.json("userData", userData);
    userDataLocal = clientGame.cache.getJSON("userData");
    console.log("BEFORE SERVER WRITE:\n" + userDataLocal);
    userDataLocal = JSON.parse(userData);
    console.log("AFTER SERVER WRITE:\n" + userDataLocal);

    currencyTotal = parseInt(userDataLocal.totalClicks);
    menuOptionsCreate();

    for(var i = 0; i < userDataLocal.upgradeList.length; i++)
    {
      menuData.data[i].bought = userDataLocal.upgradeList[i].timesClicked;
      updatePrice(i);

    }
    for(var i = 3; i < 6; i++)
    {
      modifierTotal += (menuData.data[i].bought * menuData.data[i].multiplier);
    }
    for(var i = 0; i < 3; i++)
    {
      autoClick += (menuData.data[i].bought * menuData.data[i].multiplier);
    }

    modifierTotal = Math.round(modifierTotal);
    console.log("Starting Modifier: " + modifierTotal);

    console.log("Starting currency total: " + currencyTotal);

    startFlag = true;
    //userDataLocal = userData;
    console.log("Listening for User Data");
  });

  socket.on("ready", function(){
    console.log("READY! STARTING REQUEST FOR DATA, AND FORCE REQUESTING FIRST BATCH");
    demandUpdate();
  });

  var localHours = localTime.getHours();
  nameRegistered = false;



  spacelayer = clientGame.add.group();
  backgroundLayer = clientGame.add.group();
  groundLayer = clientGame.add.group();
  uiLayer = clientGame.add.group();
  fadeLayer = clientGame.add.group();
  shaderLayer = clientGame.add.group();

  uiLayer.inputEnabled = true;

  this.game.physics.startSystem(Phaser.Physics.ARCADE);


  bgDraw();
  groundDraw();
  menuAssetsCreate();
  skySet(localHours);
  createText();
  fade();
  //createStartText();
  crtDraw();

  inputListenerStart();
  testEmit();
  //testDataRetrieve();
}

function update() {
  updateText();
  crtFilter.update();
  crtScreen.moveUp();

  if(startFlag == true)
  {
    timeNow = Date.now();
    if ( timeNow - tick > 1000) {
      //userDataLocal.totalClicks = currencyTotal;
      currencyTotal += Math.round((autoClick*modifierTotal));
      tick = Date.now();
      tickCounter++;
    }
    if( tickCounter <= 3){
      userUpdate(userDataLocal, name);
      tickcounter = 0;
    }
  }

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
  userData.totalClicks = currencyTotal;
  socket.emit("userUpdate", JSON.stringify(userData), userName);
  console.log("USER DATA UPDATE:\n" + JSON.stringify(userData));
}

// this function is fired when we connect
function onsocketConnected () {
  console.log("connected to server");
  if (nameRegistered == false)
  {
    saveName(name);


  }
}
