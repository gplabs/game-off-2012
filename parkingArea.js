/* 
 * The upper parking part of the field.
 */

goog.provide('robert_the_lifter.ParkingArea');

goog.require('lime.Sprite');

robert_the_lifter.ParkingArea = function(game) {
  goog.base(this);
  
  this.truckWidth = game.tileWidth;
  this.truckHeight = game.tileWidth * 2;
  
  
  var parkingTiles = new lime.fill.Frame('images/ground.png', 0, 0, game.truckParkingWidth, game.truckParkingHeight);
  this.setAnchorPoint(0,0)
      .setSize(game.truckParkingWidth, game.truckParkingHeight)
      .setPosition(game.truckParkingX, game.truckParkingY)
      .setFill(parkingTiles);
  
  // each slot of the array is a truck of a different color
  var truckTile = new Array();
  truckTile[0] = new lime.fill.Frame('images/trucks.png', 0, 0, this.truckWidth, this.truckHeight);
  truckTile[1] = new lime.fill.Frame('images/trucks.png', 60, 0, this.truckWidth, this.truckHeight);
  truckTile[2] = new lime.fill.Frame('images/trucks.png', 120, 0, this.truckWidth, this.truckHeight);
  truckTile[3] = new lime.fill.Frame('images/trucks.png', 185, 0, this.truckWidth, this.truckHeight);
  
  var nbTrucks = game.truckParkingWidth / game.tileWidth;
  for(var i = 0; i < nbTrucks; i ++) {
    var random_truck = Math.floor(Math.random()*4);
    var truck = new lime.Sprite()
      .setAnchorPoint(0, 0)
      .setSize(this.truckWidth, this.truckHeight)
      .setPosition(i*game.tileWidth, game.truckParkingY)
      .setFill(truckTile[random_truck]);
    
    this.appendChild(truck);
  }
}

goog.inherits(robert_the_lifter.ParkingArea, lime.Sprite);