
var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

WebFontConfig = {

  google: {
    families:["VT323"]
  }
};

var style = {font: "28px VT323", fill: "#fff", tabs: 150};
var notificationStyle = {font: "128px VT323", fill: "#fff", tabs: 150};

var canvas_width = 800;
var canvas_height = 600;
var scale = 1;

//make a phaser game
clientGame = new Phaser.Game(canvas_width,canvas_height, Phaser.AUTO,
  'gameDiv', {init: init, preload: preload, create:create, update: update});

  var gameProperties = {
    //this is the actual game size to determine the boundary of
    //the world
    gameWidth: 4000,
    gameHeight: 4000,
  };

  var localTime;
  var lastActive;
  var sunSprite;
  var moonSprite;

  var ground;
  var groundSway;

  var daySpeed = 2000;

  var currencyTotalText;
  var currencyTotal = 0;
  var currencyLocal = 0;

  var activeTimeText;

  var clickmarker;
  var click;
  var clickText;

  var fadeScreen;

  var crtFilter;
  var crtScreen;

  function init(){
    this.game.stage.smoothed = false;
    this.game.stage.minWidth = clientGame.canvas_width;
    this.game.stage.minHeight = clientGame.canvas_height;
    this.game.stage.maxWidth = clientGame.canvas_width * clientGame.scale;
    this.game.stage.maxHeight = clientGame.canvas_height * clientGame.scale;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.canvas.oncontextmenu = function(e){e.preventDefault();};
  }

  function preload() {
    this.load.image("background", "assets/background.png");
    this.load.spritesheet("ground", "assets/ground.png", 80, 10);
    this.load.spritesheet("sunMoon", "assets/sunmoon.png", 32, 32);
    this.load.spritesheet("clickmarker", "assets/clickmarker.png", 16, 16);
    this.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");

    localTime = new Date();
  }
  //this function is fired once when we load the game
  function create () {
    console.log("client started");
    //listen to the “connect” message from the server. The server
    //automatically emit a “connect” message when the client connects.When
    //the client connects, call onsocketConnected.
    socket.on("connect", onsocketConnected);

    spacelayer = clientGame.add.group();
    backgroundLayer = clientGame.add.group();
    groundLayer = clientGame.add.group();
    uiLayer = clientGame.add.group();
    fadeLayer = clientGame.add.group();
    shaderLayer = clientGame.add.group();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    bgSprite = backgroundLayer.create(0,0, "background");
    bgSprite.height = clientGame.height;
    bgSprite.width = clientGame.width;
    bgSprite.inputEnabled = true;
    //bgSprite.events.onInputDown.add(bgListener, this);

    ground = groundLayer.create(0, 500, "ground");
    ground.scale.setTo(10);
    wind = ground.animations.add("wind");
    ground.animations.play("wind", 1, true);

    clientGame.input.onDown.add(clickListener, this);


    var localHours = localTime.getHours();


    skySet(localHours);
    createText();

    //fadeScreen = new Phaser.Rectangle(0,0, 800, 600);
    fadeScreen = clientGame.add.graphics(0,0);
    fadeScreen.beginFill(0x000000);
    fadeScreen.drawRect(0,0, 800, 600 );
    fadeScreen.endFill();

    createStartText();

    crtFilter = new Phaser.Filter(clientGame, null, CRTFragmentSrc);
    crtFilter.setResolution(canvas_width, canvas_height);

    crtScreen = this.add.sprite();
    crtScreen.width = canvas_width;
    crtScreen.height = canvas_height;
    crtScreen.filters = [ crtFilter ];
    //console.log(crtScreen.filters);
  }

function fade(){


}


function update() {
  updateText();
  crtFilter.update();
  crtScreen.moveUp();

  if (currencyLocal < 2)
  {
    fadeScreen.alpha = 0;
    clickText.destroy();
  }

}

function createText(){
  console.log("Text Created");
  currencyTotalText = clientGame.add.text(32,64, "Score: 0", style);
  currencyTotalText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  activeTimeText = clientGame.add.text(32,96, ("Current Time: " + localTime.toDateString()), style);
  activeTimeText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

  clickText = clientGame.add.text(250, 200, "Click", notificationStyle);
  clickText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);


  // return currencyTotalText;
}

function createStartText(){
  console.log("Start Text Created");
  clickText = clientGame.add.text(250, 200, "Click", notificationStyle);
  clickText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
}

function updateText(){
  //console.log("Text Updated")
  currencyTotalText.setText("Score: "+ currencyTotal);
}

function clickListener(){
  currencyTotal++;



  clickmarker = uiLayer.create(0,0,"clickmarker");
  clickmarker.scale.setTo(4);
  click = clickmarker.animations.add("click");
  clickmarker.x = clientGame.input.activePointer.x - 32;
  clickmarker.y = clientGame.input.activePointer.y - 32;
  clickmarker.animations.play("click", 20, false, true);
  //clickmarker.destroy();
}

function dayNight (){
  console.log("DayNight");

}

// this function is fired when we connect
function onsocketConnected () {
  console.log("connected to server");
}
