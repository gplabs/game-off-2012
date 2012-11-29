/* 
 * The upper parking part of the field.
 */

goog.provide('robert_the_lifter.ParkingArea');

//goog.require('lime.Sprite');

robert_the_lifter.ParkingArea = function(game, layer) {
  var parkingTile = new lime.fill.Frame('images/tiles.png', 0, 0, game.tileWidth, game.tileHeight);
  
  this.truckWidth = game.tileWidth;
  this.truckHeight = game.tileHeight * 2;
  
  for(var i = 0; i < game.parkingWidth; i ++) {
    for(var j = 0; j < game.parkingHeight; j ++) {
      var parkingSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setSize(game.tileWidth, game.tileHeight)
        .setPosition((i)*game.tileWidth, (j)*game.tileHeight)
        .setFill(parkingTile);
      layer.appendChild(parkingSprite);
    }
    
    var truckNo = Math.floor(Math.random()*4);
    var truckTile = new lime.fill.Frame('images/trucks.png', truckNo*this.truckWidth, 0, this.truckWidth, this.truckHeight);
    var truck = new lime.Sprite()
      .setAnchorPoint(0, 0)
      .setSize(this.truckWidth, this.truckHeight)
      .setPosition(i*game.tileWidth, game.truckParkingY)
      .setFill(truckTile);
      
    layer.appendChild(truck);
  }
}