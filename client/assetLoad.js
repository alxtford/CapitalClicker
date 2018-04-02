WebFontConfig = {

  // When finished loading, create text
  active: function() { clientGame.time.events.add(250, createStartText, this); },

  google: {
    families:["VT323"]
  }
};

var clickEffect;
var invalidEffect;
var menuCloseEffect;
var menuOpenEffect;
var selectEffect;

function assetLoad(){

  // LANDSCAPE
  clientGame.load.image("background", "assets/background.png");
  clientGame.load.spritesheet("ground", "assets/ground.png", 80, 10);
  clientGame.load.spritesheet("sunMoon", "assets/sunmoon.png", 32, 32);

  // CHARACTERS
  clientGame.load.spritesheet("characters", "assets/employees.png", 16, 32, 84);

  // STORES
  clientGame.load.spritesheet("stores", "assets/stores.png", 68, 48);

  // UI ASSETS
  clientGame.load.spritesheet("clickmarker", "assets/clickmarker.png", 16, 16);
  clientGame.load.spritesheet("menubutton", "assets/menubutton.png", 15, 5);
  clientGame.load.spritesheet("menuback", "assets/menuback.png", 40, 70);
  clientGame.load.spritesheet("menuexitbutton", "assets/menuexitbutton.png", 3, 3);
  clientGame.load.image("menuItemButton","assets/button.png", 35, 5);
  clientGame.load.spritesheet("likertBackground", "assets/likertBackground.png", 100, 15);
  clientGame.load.spritesheet("likertToggle", "assets/toggle.png", 8, 8);

  // AUDIO
  clientGame.load.audio("click", "assets/audio/click.wav");
  clientGame.load.audio("invalid", "assets/audio/invalid.wav");
  clientGame.load.audio("menuClose", "assets/audio/menuclose.wav");
  clientGame.load.audio("menuOpen", "assets/audio/menuopen.wav");
  clientGame.load.audio("select", "assets/audio/select.wav");

  // TYPEFACE
  clientGame.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");

}

function audioAssign(){
  invalidEffect = clientGame.add.audio("invalid");
  invalidEffect.allowMultiple = true;

  clickEffect = clientGame.add.audio("click");
  clickEffect.allowMultiple = true;

  menuCloseEffect = clientGame.add.audio("menuClose");
  menuCloseEffect.allowMultiple = true;

  menuOpenEffect = clientGame.add.audio("menuOpen");
  menuOpenEffect.allowMultiple = true;

  selectEffect = clientGame.add.audio("select");
  selectEffect.allowMultiple = true;
}
