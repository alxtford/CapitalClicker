
var socket; // define a global variable called socket
socket = io.connect(); // send a connection request to the server

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
  var sunSprite;
  var moonSprite;
  var daySpeed = 2000;

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

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    bgSprite = backgroundLayer.create(0,0, "background");
    bgSprite.height = clientGame.height;
    bgSprite.width = clientGame.width;


    var localHours = localTime.getHours();

    skySet(localHours);

  }


function update() {
}


function dayNight (){
  console.log("DayNight");

}

// this function is fired when we connect
function onsocketConnected () {
  console.log("connected to server");
}
