/*Amber Darby 2018, came up with sun->moon idea*/

function moonCreate(x, y, alpha)
{
  moonSprite = spacelayer.create(x,y, "sunMoon")
  moonSprite.frame = 1;
  moonSprite.width = 100;
  moonSprite.height = 100;
  moonSprite.alpha = alpha;
}

function sunCreate(x, y, alpha)
{
  sunSprite = spacelayer.create(x,y, "sunMoon")
  sunSprite.frame = 0;
  sunSprite.width = 100;
  sunSprite.height = 100;
  sunSprite.alpha = alpha;
}

function skySet(localHours)
{

  switch(localHours)
  {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    moonCreate(340, 50, 0.7);
    clientGame.stage.backgroundColor = '0x556270';
    break;

    case 5:
    case 6:
    case 7:
    moonCreate(150, 100, 0.5);
    sunCreate(550, 200, 0.7);
    clientGame.stage.backgroundColor = '0x476B91';
    break;

    case 8:
    case 9:
    case 10:
    case 11:
    moonCreate(100, 150, 0.2);
    sunCreate(450, 100, 0.7);
    clientGame.stage.backgroundColor = '0x3D70A6';
    break;

    case 12:
    case 13:
    sunCreate(340, 50, 0.7);
    clientGame.stage.backgroundColor = '0x4186D1';
    break;

    case 14:
    case 15:
    case 16:
    sunCreate(200, 100, 0.7);
    clientGame.stage.backgroundColor = '0x3D70A6';
    break;

    case 17:
    case 18:
    case 19:
    moonCreate(550, 200, 0.5);
    sunCreate(150, 100, 0.7);
    clientGame.stage.backgroundColor = '0x476B91';
    break;

    case 20:
    case 21:
    case 22:
    case 23:
    moonCreate(340, 50, 0.7);
    clientGame.stage.backgroundColor = '0x556270';
    break;

  }
}
