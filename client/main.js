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
var studyFlag = false;
var nameRegistered;

var bitcoinData;
var btcDayPercentChange = 0;

var likertFlag;

function init(){
  clientGame.plugins.add(PhaserInput.Plugin);

  this.game.stage.disableVisibilityChange = true;
  this.game.stage.smoothed = false;
  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.setMinMax(100, 75, 600, 450);
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.game.canvas.oncontextmenu = function(e){e.preventDefault();};

  spacelayer = clientGame.add.group();
  backgroundLayer = clientGame.add.group();
  groundLayer = clientGame.add.group();
  storeLayer = clientGame.add.group();
  characterLayer = clientGame.add.group();
  uiLayer = clientGame.add.group();
  fadeLayer = clientGame.add.group();
  shaderLayer = clientGame.add.group();
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

  audioAssign();

  //listen to the “connect” message from the server. The server
  //automatically emit a “connect” message when the client connects.When
  //the client connects, call onsocketConnected.
  socket.on("connect", onsocketConnected);

  socket.on('connect_failed', function() {
    document.write("Sorry, there seems to be an issue with the connection!");
  });

  socket.on("bitcoinData", function(data) {
    if(userDataLocal.coinflip === 1){
      bitcoinData = clientGame.cache.getJSON("bitcoinData");

      bitcoinData = JSON.parse(data);

      btcDayPercentChange = bitcoinData.changes.percent.day;
    }
  });

  socket.on("shopsNearbyReply", function(shopNum){
    console.log("NUMBEROF NEARBY SHOPS: " + shopNum);
  });

  socket.on("userData", function(userData){
    userDataLocal = clientGame.cache.getJSON("userData");
    //console.log("BEFORE SERVER WRITE:\n" + userDataLocal);
    userDataLocal = JSON.parse(userData);
    //console.log("AFTER SERVER WRITE:\n" + userDataLocal);

    currencyTotal = btcPlusMinus(parseInt(userDataLocal.currency));
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

    storeDraw(frameGet());
    employeeNum();

    if(userDataLocal.coinflip === 1){
      studyCreate();
    }

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


  setInterval(function() {
    currencyTotal += Math.round(autoClick*(modifierTotal * btcPlusMinus((1+ btcDayPercentChange))));
  }, 1000);


}

//Function only fired if coinflip of 1
function studyCreate(){
  btcText = clientGame.add.text(20,50, "BTC day change: 0%", style);
  btcText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

  createLikert();
  clientGame.time.events.add(Phaser.Timer.MINUTE * 1.5, likertShow, this);
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
  for(var i = 0; i < 3; i++){
    for(var j = 0; j < Math.floor(userDataLocal.upgradeList[i].timesClicked /10); j++){
      switch(i){
        case 0:
          createHireling();
          break;
        case 1:
          createEmployee();
          break;
        case 2:
          createTrader();
          break;
        default:
          console.log("INVALID ITERATOR");
          break;
      }
    }
  }
}

function btcPlusMinus(btc){
  if (btc < 0)
  {
    btc *= -1;
    console.log("negative value found");
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
