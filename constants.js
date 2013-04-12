goog.provide('robert_the_lifter.Constants');

/**
 * Initialization of all constants.
 */
robert_the_lifter.Constants = function() {
  this.ratio = 0.75;

  this.DefaultTileWidth = 64;
  this.DefaultTileHeight = 64;
  this.DefaultWallWidth = 10;

  this.TileWidth = Math.ceil(this.DefaultTileWidth * this.ratio);
  this.TileHeight = Math.ceil(this.DefaultTileWidth * this.ratio);
  this.WallWidth = Math.ceil(this.DefaultWallWidth * this.ratio);

  // Constants for parking area.
  this.ParkingWidth = 20;
  this.ParkingHeight = 2;
  this.TruckParkingHeight = this.TileHeight * this.ParkingHeight + this.WallWidth; // 10 pixels for wall.
  this.TruckParkingWidth = this.TileWidth * this.ParkingWidth;
  this.TruckParkingX = this.WallWidth;
  this.TruckParkingY = 0;

  // Constants for factory area
  this.FactoryNbTileWidth = 20;
  this.FactoryNbTileHeight = 10;
  this.FactoryHeight = this.TileHeight * this.FactoryNbTileHeight;
  this.FactoryWidth = this.TileWidth * this.FactoryNbTileWidth;
  this.FactoryX = this.WallWidth;
  this.FactoryY = this.TruckParkingHeight;

  //Constants for the hidden (to the right) area
  this.RightAreaTileWidth = 3;
  this.RightAreaTileHeight = this.FactoryNbTileHeight;

  //Constants for the Office area
  this.OfficeAreaHeight = 0;
  this.OfficeAreaWidth = 0;

  this.GameHeight = this.TruckParkingHeight + this.FactoryHeight + this.OfficeAreaHeight + this.WallWidth;
  this.GameWidth = this.TileWidth * 23 + 2*this.WallWidth;
}