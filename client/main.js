
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
  var lastclick;

  var menubutton;
  var menuexitbutton;
  var menubuttonText;
  var menubuttonClickAnim;
  var menuback;
  var menuTween;

  var fadeScreen;

  var crtFilter;
  var crtScreen;

  function init(){
    this.game.stage.smoothed = false;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.setMinMax(400, 300, 1200, 900);
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.canvas.oncontextmenu = function(e){e.preventDefault();};
  }

  function preload() {
    // LANDSCAPE
    this.load.image("background", "assets/background.png");
    this.load.spritesheet("ground", "assets/ground.png", 80, 10);
    this.load.spritesheet("sunMoon", "assets/sunmoon.png", 32, 32);

    // UI ASSETS
    this.load.spritesheet("clickmarker", "assets/clickmarker.png", 16, 16);
    this.load.spritesheet("menubutton", "assets/menubutton.png", 15, 5);
    this.load.spritesheet("menuback", "assets/menuback.png", 40, 70);
    this.load.spritesheet("menuexitbutton", "assets/menuexitbutton.png", 3, 3);

    // TYPEFACE
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
    clickregisterLayer = clientGame.add.group();
    uiLayer = clientGame.add.group();
    fadeLayer = clientGame.add.group();
    shaderLayer = clientGame.add.group();

    uiLayer.inputEnabled = true;

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

    menubutton = uiLayer.create(10, 80, "menubutton");
    menubutton.scale.setTo(8);
    menubuttonClickAnim = menubutton.animations.add("click");

    menubutton.inputEnabled = true;
    menubutton.events.onInputDown.add(menubuttonClickDown, this);
    menubutton.events.onInputUp.add(menubuttonClickUp, this);
    menubutton.input.priorityID = 1;
    menubutton.input.useHandCursor = true;

    menubuttonText = clientGame.add.text(60,85, "Menu", style);
    menubuttonText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    uiLayer.add(menubuttonText);

    menuback = uiLayer.create(-400, 20, "menuback");
    menuback.scale.setTo(8);

    clientGame.input.onDown.add(clickListener, this);

    var localHours = localTime.getHours();

    skySet(localHours);
    createText();

    fadeScreen = clientGame.add.graphics(0,0);
    fadeScreen.inputEnabled = true;

    fadeScreen.beginFill(0x000000);
    fadeScreen.drawRect(0,0, 800, 600 );
    fadeScreen.endFill();

    fadeScreen.inputEnabled = true;
    fadeScreen.events.onInputDown.add(firstClick, this);

    createStartText();

    crtFilter = new Phaser.Filter(clientGame, null, CRTFragmentSrc);
    crtFilter.setResolution(canvas_width, canvas_height);

    crtScreen = this.add.sprite();
    crtScreen.width = canvas_width;
    crtScreen.height = canvas_height;
    crtScreen.filters = [ crtFilter ];
    //console.log(crtScreen.filters);



    console.log(shaderLayer);

  }

function fade(){


}


function update() {
  updateText();
  crtFilter.update();
  crtScreen.moveUp();

}

function createText(){
  console.log("Text Created");
  currencyTotalText = clientGame.add.text(20,30, "Clicks: 0", style);
  currencyTotalText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  // activeTimeText = clientGame.add.text(20,60, ("Current Time: " + localTime.toDateString()), style);
  // activeTimeText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

  // return currencyTotalText;
}

function createStartText(){
  console.log("Start Text Created");
  clickText = clientGame.add.text(250, 200, "Click", notificationStyle);
  clickText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
}

function updateText(){
  //console.log("Text Updated")
  currencyTotalText.setText("Clicks: "+ currencyTotal);
}

function menubuttonClickDown(){
  console.log("MOUSE DOWN ON MENU BUTTON");
  menubutton.animations.play("click", 30, false);
}

function menubuttonClickUp(){
  console.log("MOUSE UP ON MENU BUTTON");
  menuTween = clientGame.add.tween(menuback);
  menuTween.to({x:-10}, 1000,Phaser.Easing.Bounce.Out, false);
  menuTween.onComplete.add(menuexitbuttonCreate, this);
  menuTween.start();
  menubutton.visible = false;
  menubuttonText.visible = false;

  var currencyTotalTextTween = clientGame.add.tween(currencyTotalText).to({x:320}, 1000,Phaser.Easing.Bounce.Out, false);
  currencyTotalTextTween.start();
}

function menuexitbuttonCreate(){
  menuexitbutton = uiLayer.create(270, 36, "menuexitbutton");
  menuexitbutton.scale.setTo(8);
  menuexitbutton.animations.add("Click");
  menuexitbutton.inputEnabled = true;
  menuexitbutton.input.useHandCursor = true;
  menuexitbutton.events.onInputDown.add(OnmenuexitbuttonClickDown,this);
  menuexitbutton.events.onInputUp.add(OnmenuexitbuttonClickUp,this);
}

function OnmenuexitbuttonClickDown(){
  menuexitbutton.animations.play("click", 30, false);
}

function OnmenuexitbuttonClickUp(){
  console.log("MOUSE UP non-menu Item");
  var menuTween = clientGame.add.tween(menuback).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, true);
  var currencyTotalTextTween = clientGame.add.tween(currencyTotalText).to({x:20}, 1000,Phaser.Easing.Bounce.Out, false);
  currencyTotalTextTween.start();
  menubutton.visible = true;
  menubuttonText.visible = true;
  menuexitbutton.visible = false
}

function firstClick() {
  fadeScreen.destroy();
  clickText.destroy();
  console.log(clickText);

}

function clickListener(sprite){
  currencyLocal++;
  currencyTotal ++;

  lastclick = sprite.name;


  if(menuback.x < -350)
  {

  }


  clickmarker = uiLayer.create(0,0,"clickmarker");
  clickmarker.scale.setTo(4);
  click = clickmarker.animations.add("click");
  clickmarker.x = clientGame.input.activePointer.x - 32;
  clickmarker.y = clientGame.input.activePointer.y - 32;
  clickmarker.animations.play("click", 20, false, true);

  console.log("CLICK");

  //clickmarker.destroy();
}

function dayNight (){
  console.log("DayNight");

}

// this function is fired when we connect
function onsocketConnected () {
  console.log("connected to server");
}
