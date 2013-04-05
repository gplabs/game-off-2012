/* 
 * The upper parking part of the field.
 */

goog.provide('robert_the_lifter.ParkingArea');

robert_the_lifter.ParkingArea = function(game) {
  var layer = new lime.Layer().setAnchorPoint(0, 0);
  var parkingTile = new lime.fill.Frame('images/sprites.png', 0, game.Constants.TileHeight*4, game.Constants.TileWidth, game.Constants.TileHeight);
  
  this.truckWidth = game.Constants.TileWidth;
  this.truckHeight = game.Constants.TileHeight * 2;
  
  for(var i = 0; i < game.Constants.ParkingWidth; i ++) {
    for(var j = 0; j < game.Constants.ParkingHeight; j ++) {
      var parkingSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setSize(game.Constants.TileWidth, game.Constants.TileHeight)
        .setPosition((i)*game.Constants.TileWidth + game.Constants.TruckParkingX, (j)*game.Constants.TileHeight + game.Constants.TruckParkingY)
        .setFill(parkingTile);
      layer.appendChild(parkingSprite);
    }
    
    var truckNo = Math.floor(Math.random()*4);
    var truckTile = new lime.fill.Frame('images/sprites.png', truckNo*this.truckWidth, game.Constants.TileHeight*2, this.truckWidth, this.truckHeight);
    var truck = new lime.Sprite()
      .setAnchorPoint(0, 0)
      .setSize(this.truckWidth, this.truckHeight)
      .setPosition(i*game.Constants.TileWidth+game.Constants.TruckParkingX, game.Constants.TruckParkingY)
      .setFill(truckTile);
      
    layer.appendChild(truck);
  }
  
  return layer;
}