/*Amber Darby 2018, came up with sun->moon idea*/
function skySet(localHours)
{

  switch(localHours)
  {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    moonSprite = spacelayer.create(340,50, "sunMoon")
    moonSprite.frame = 1;
    moonSprite.width = 100;
    moonSprite.height = 100;
    moonSprite.alpha = 0.7;
    clientGame.stage.backgroundColor = '0x556270';
    break;
    case 5:
    case 6:
    case 7:
    moonSprite = spacelayer.create(150,100, "sunMoon")
    moonSprite.frame = 1;
    moonSprite.width = 100;
    moonSprite.height = 100;
    moonSprite.alpha = 0.5;

    sunSprite = spacelayer.create(550,200, "sunMoon")
    sunSprite.frame = 0;
    sunSprite.width = 100;
    sunSprite.height = 100;
    sunSprite.alpha = 0.7;
    clientGame.stage.backgroundColor = '0x476B91';
    break;

    case 8:
    case 9:
    case 10:
    case 11:
    moonSprite = spacelayer.create(100,150, "sunMoon")
    moonSprite.frame = 1;
    moonSprite.width = 100;
    moonSprite.height = 100;
    moonSprite.alpha = 0.2;

    sunSprite = spacelayer.create(450,100, "sunMoon")
    sunSprite.frame = 0;
    sunSprite.width = 100;
    sunSprite.height = 100;
    sunSprite.alpha = 0.7;
    clientGame.stage.backgroundColor = '0x3D70A6';
    break;

    case 12:
    case 13:
    sunSprite = spacelayer.create(340,50, "sunMoon")
    sunSprite.frame = 0;
    sunSprite.width = 100;
    sunSprite.height = 100;
    sunSprite.alpha = 0.7;
    clientGame.stage.backgroundColor = '0x4186D1';
    break;

    case 14:
    case 15:
    case 16:
    sunSprite = spacelayer.create(200,100, "sunMoon")
    sunSprite.frame = 0;
    sunSprite.width = 100;
    sunSprite.height = 100;
    sunSprite.alpha = 0.7;
    clientGame.stage.backgroundColor = '0x3D70A6';
    break;

    case 17:
    case 18:
    case 19:
    moonSprite = spacelayer.create(550,200, "sunMoon")
    moonSprite.frame = 1;
    moonSprite.width = 100;
    moonSprite.height = 100;
    moonSprite.alpha = 0.5;

    sunSprite = spacelayer.create(150,100, "sunMoon")
    sunSprite.frame = 0;
    sunSprite.width = 100;
    sunSprite.height = 100;
    sunSprite.alpha = 0.7;
    clientGame.stage.backgroundColor = '0x476B91';
    break;

    case 20:
    case 21:
    case 22:
    case 23:
    //moonSprite = spacelayer.create(250,40, "sunMoon");
    moonSprite = spacelayer.create(340,100, "sunMoon");
    moonSprite.frame = 1;
    moonSprite.width = 100;
    moonSprite.height = 100;
    moonSprite.alpha = 0.7;
    clientGame.stage.backgroundColor = '0x556270';
    break;

  }
}
