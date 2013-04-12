/* 
 * The upper parking part of the field.
 */

goog.provide('robert_the_lifter.ParkingArea');

robert_the_lifter.ParkingArea = function(game) {
  var layer = new lime.Layer().setAnchorPoint(0, 0);
  
  for(var i = 0; i < game.Constants.ParkingWidth; i ++) {
    for(var j = 0; j < game.Constants.ParkingHeight; j ++) {
      var parkingSprite = game.Media.GetParkingSprite(
        (i)*game.Constants.TileWidth + game.Constants.TruckParkingX, // x
        (j)*game.Constants.TileHeight + game.Constants.TruckParkingY // y
      );
      layer.appendChild(parkingSprite);
    }
    var truck = game.Media.GetTruckSprite(i*game.Constants.TileWidth+game.Constants.TruckParkingX, game.Constants.TruckParkingY);
    layer.appendChild(truck);
  }
  
  return layer;
}