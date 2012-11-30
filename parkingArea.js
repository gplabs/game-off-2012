/* 
 * The upper parking part of the field.
 */

goog.provide('robert_the_lifter.ParkingArea');

robert_the_lifter.ParkingArea = function(game, layer) {
  var parkingTile = new lime.fill.Frame('images/sprites.png', 0, game.tileHeight*4, game.tileWidth, game.tileHeight);
  
  
  this.truckWidth = game.tileWidth;
  this.truckHeight = game.tileHeight * 2;
  
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
    var truckTile = new lime.fill.Frame('images/sprites.png', truckNo*this.truckWidth, game.tileHeight*2, this.truckWidth, this.truckHeight);
    var truck = new lime.Sprite()
      .setAnchorPoint(0, 0)
      .setSize(this.truckWidth, this.truckHeight)
      .setPosition(i*game.tileWidth+game.truckParkingX, game.truckParkingY+game.truckParkingY)
      .setFill(truckTile);
      
    layer.appendChild(truck);
  }
}