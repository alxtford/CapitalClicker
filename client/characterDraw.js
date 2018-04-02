var hireling1;
var hireling2;

var employee1;
var employee2;

var trader1;
var trader2;

var chicken;
var chest;

function characterSplit(){

hireling1 = characterLayer.add.sprite(100,100, "characters");
hireling2 = characterLayer.add.sprite(100,100, "characters");

employee1 = characterLayer.add.sprite(100,100, "characters");
employee2 = characterLayer.add.sprite(100,100, "characters");

trader1 = characterLayer.add.sprite(100,100, "characters");
trader2 = characterLayer.add.sprite(100,100, "characters");

chicken = characterLayer.add.sprite(100,100, "characters");
chest = characterLayer.add.sprite(100,100, "characters");

chest.frame = 76;

hireling1.animations.add("walk", [0,1,2,3,4,5], 10, true);
hireling1.animations.add("idle", [6,7,8,9,10,11], 10, true);
hireling2.animations.add("walk", [12,13,14,15,16,17], 10, true);
hireling2.animations.add("idle", [18,19,20,21,22,23], 10, true);

employee1.animations.add("walk", [24,25,26,27,28,29], 10, true);
employee1.animations.add("idle", [30,31,32,33,34,35], 10, true);
employee2.animations.add("walk", [36,37,38,39,40,41], 10, true);
employee2.animations.add("idle", [42,43,44,45,46,47], 10, true);

trader1.animations.add("walk", [48,49,50,51,52,53], 10, true);
trader1.animations.add("idle", [54,55,56,57,58,59], 10, true);
trader2.animations.add("walk", [60,61,62,63,64,65], 10, true);
trader2.animations.add("idle", [66,67,68,69,70,71], 10, true);

chicken.animations.add("walk", [72,73,74,75], 10, true);
chicken.animations.add("explode", [78,79,80,81,82,83], 10, true);



}
