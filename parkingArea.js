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
  
  var nbTrucks = game.truckParkingWidth / game.tileWidth;
  for(var i = 0; i < nbTrucks; i ++) {
    var truckNo = Math.floor(Math.random()*4);
    var truckTile = new lime.fill.Frame('images/trucks.png', truckNo*this.truckWidth, 0, this.truckWidth, this.truckHeight);
    var truck = new lime.Sprite()
      .setAnchorPoint(0, 0)
      .setSize(this.truckWidth, this.truckHeight)
      .setPosition(i*game.tileWidth, game.truckParkingY)
      .setFill(truckTile);
      
    this.appendChild(truck);
  }
}

goog.inherits(robert_the_lifter.ParkingArea, lime.Sprite);