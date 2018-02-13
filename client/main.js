
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


    backgroundLayer = clientGame.add.group();
    spacelayer = clientGame.add.group();
    groundLayer = clientGame.add.group();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.stage.backgroundColor = '0x556270';




    //moonSprite.scale = 3;

    bgSprite = backgroundLayer.create(0,0, "background");
    bgSprite.height = clientGame.height;
    bgSprite.width = clientGame.width;

    // var bgBitMap = clientGame.add.bitmapData(clientGame.width, clientGame.height);
    // backgroundLayer.add(bgBitMap);


    var backgroundSprite = this.game.add.sprite(0, 0);

    let backgroundSprites = [
      {sprite: backgroundSprite, from: 0x6481a1, to: 0x1f202a}
    ];

    // shadingInit(backgroundSprites);
    // sunInit(sunSprite, daySpeed);
    // moonInit(moonSprite, daySpeed);

    var localHours = localTime.getHours();

    if(localHours < 18 && localHours > 7)
    {
      sunSprite = spacelayer.create(0,0, "sunMoon")
      sunSprite.frame = 0;
      sunSprite.width = 100;
      sunSprite.height = 100;
    }
    else
    {
      // bgBitMap.ctx.rect(0, 0, this.game.width, this.game.height);
      // bgBitMap.ctx.fillStyle = '#676481a1';
      // bgBitMap.ctx.fill();
      // bgBitMap.ctx.alpha = 0.1;

      moonSprite = spacelayer.create(40,40, "sunMoon")
      moonSprite.frame = 1;
      moonSprite.width = 100;
      moonSprite.height = 100;
    }

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
