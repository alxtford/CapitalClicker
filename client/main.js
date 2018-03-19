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

var upgradeData;

function init(){
  clientGame.plugins.add(PhaserInput.Plugin);

  this.game.stage.disableVisibilityChange = true;
  this.game.stage.smoothed = false;
  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.setMinMax(400, 300, 1000, 750);
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.game.canvas.oncontextmenu = function(e){e.preventDefault();};
}

function preload() {
  assetLoad();
  localTime = new Date();
}

function create () {
  console.log("client started");
  //listen to the “connect” message from the server. The server
  //automatically emit a “connect” message when the client connects.When
  //the client connects, call onsocketConnected.
  socket.on("connect", onsocketConnected);

  var localHours = localTime.getHours();

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
}

function update() {
  updateText();
  crtFilter.update();
  crtScreen.moveUp();

}

function testEmit(){
  socket.emit("testEmit");
}

// this function is fired when we connect
function onsocketConnected () {
  console.log("connected to server");

}
