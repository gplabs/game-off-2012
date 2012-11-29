/* 
 * The upper parking part of the field.
 */

goog.provide('robert_the_lifter.ParkingArea');

robert_the_lifter.ParkingArea = function(game, layer, wallTile, cornerWallTile) {
  var parkingTile = new lime.fill.Frame('images/tiles.png', 0, 0, game.tileWidth, game.tileHeight);
  
  
  this.truckWidth = game.tileWidth;
  this.truckHeight = game.tileHeight * 2;
  
  var cornerSprite = new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(0, game.parkingHeight*game.tileHeight + game.truckParkingY+game.wallWidth)
    .setRotation(90)
    .setSize(game.wallWidth, game.wallWidth)
    .setFill(cornerWallTile);
  layer.appendChild(cornerSprite);
  
  for(var i = 0; i < game.parkingWidth; i ++) {
    for(var j = 0; j < game.parkingHeight; j ++) {
      var parkingSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setSize(game.tileWidth, game.tileHeight)
        .setPosition((i)*game.tileWidth + game.truckParkingX, (j)*game.tileHeight + game.truckParkingY)
        .setFill(parkingTile);
      layer.appendChild(parkingSprite);
    }
    
    var truckNo = Math.floor(Math.random()*4);
    var truckTile = new lime.fill.Frame('images/trucks.png', truckNo*this.truckWidth, 0, this.truckWidth, this.truckHeight);
    var truck = new lime.Sprite()
      .setAnchorPoint(0, 0)
      .setSize(this.truckWidth, this.truckHeight)
      .setPosition(i*game.tileWidth+game.truckParkingX, game.truckParkingY+game.truckParkingY)
      .setFill(truckTile);
      
    layer.appendChild(truck);
  }
}