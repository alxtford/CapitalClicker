
var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

WebFontConfig = {

  google: {
    families:["VT323"]
  }
};

var style = {font: "28px VT323", fill: "#fff", tabs: 150};


var canvas_width = 800;
var canvas_height = 600;
var scale = 1;

//make a phaser game
clientGame = new Phaser.Game(canvas_width,canvas_height, Phaser.CANVAS,
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
  var daySpeed = 2000;

  var currencyText;
  var currency = 0;

  var activeTimeText;

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
    this.load.spritesheet("sunMoon", "assets/sunmoon.png", 32, 32);
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

    uiLayer= clientGame.add.group();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    bgSprite = backgroundLayer.create(0,0, "background");
    bgSprite.height = clientGame.height;
    bgSprite.width = clientGame.width;
    bgSprite.inputEnabled = true;
    bgSprite.events.onInputDown.add(bgListener, this);

    var localHours = localTime.getHours();


    skySet(localHours);
    createText();



  }


function update() {
  updateText();
}

function createText(){
  console.log("Text Created");
  currencyText = clientGame.add.text(32,64, "Score: 0", style);
  currencyText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  activeTimeText = clientGame.add.text(32,96, "Current Time = " + localTime.toDateString(), style);
  activeTimeText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

  // return currencyText;
}

function updateText(){
  //console.log("Text Updated")
  currencyText.setText("Score: "+ currency);
}

function bgListener(){
  currency++;
}

function dayNight (){
  console.log("DayNight");

}

// this function is fired when we connect
function onsocketConnected () {
  console.log("connected to server");
}
