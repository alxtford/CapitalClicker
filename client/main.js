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
var currencyLocal = 0;

var click;
var lastclick;

var userName;
var userNameText;
var tick = Date.now();
var userDataLocal;

var startFlag = false;
var nameRegistered;

function init(){
  clientGame.plugins.add(PhaserInput.Plugin);
  //clientGame.plugins.add(PhaserNineSlice.Plugin);

  this.game.stage.disableVisibilityChange = true;
  this.game.stage.smoothed = false;
  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.setMinMax(100, 75, 1600, 1200);
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
  clientGame.load.json("userData", "client/defaultData.JSON");
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

  socket.on("userData", function(userData){
    //clientGame.load.json("userData", userData);
    userDataLocal = clientGame.cache.getJSON("userData");
    console.log("BEFORE SERVER WRITE:\n" + userDataLocal);
    userDataLocal = JSON.parse(userData);
    console.log("AFTER SERVER WRITE:\n" + userDataLocal);

    localUpgradeUpdate();

    currencyTotal = parseInt(userDataLocal.totalClicks);

    console.log("Starting currency total: " + currencyTotal);
    menuOptionsCreate();
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
  createStartText();
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
    var timeNow = Date.now();
    if ( timeNow - tick > 3000) {
      //userDataLocal.totalClicks = currencyTotal;
      userUpdate(userDataLocal, name);
      tick = Date.now();
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
  serverUpgradeUpdate(userData);
  socket.emit("userUpdate", JSON.stringify(userData), userName);
  console.log("USER DATA UPDATE:\n" + JSON.stringify(userData));
}

function localUpgradeUpdate(){
  for(var i = 0; i < userDataLocal.upgradeList.length; i++)
  {
    menuData.data[i].bought = userDataLocal.upgradeList[i].timesClicked;
  }
}

function serverUpgradeUpdate(userData){
  for(var i = 0; i < userDataLocal.upgradeList.length; i++)
  {
   userData.upgradeList[0].timesClicked =  menuData.data[i].bought;
  }
}

// this function is fired when we connect
function onsocketConnected () {
  console.log("connected to server");
  if (nameRegistered == false)
  {
    saveName(name);


  }
}
