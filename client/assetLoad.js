WebFontConfig = {

  google: {
    families:["VT323"]
  }
};

function assetLoad(){
  // LANDSCAPE
  clientGame.load.image("background", "assets/background.png");
  clientGame.load.spritesheet("ground", "assets/ground.png", 80, 10);
  clientGame.load.spritesheet("sunMoon", "assets/sunmoon.png", 32, 32);

  // UI ASSETS
  clientGame.load.spritesheet("clickmarker", "assets/clickmarker.png", 16, 16);
  clientGame.load.spritesheet("menubutton", "assets/menubutton.png", 15, 5);
  clientGame.load.spritesheet("menuback", "assets/menuback.png", 40, 70);
  clientGame.load.spritesheet("menuexitbutton", "assets/menuexitbutton.png", 3, 3);
  clientGame.load.image("menuItemButton","assets/button.png", 35, 5);

  // TYPEFACE
  clientGame.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
}
