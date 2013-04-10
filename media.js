goog.provide('robert_the_lifter.Media');
goog.require('goog.net.ImageLoader');

/**
 * Initialization of all media. (Preloading)
 */
robert_the_lifter.Media = function(constants, start) {
  var sprites = 'images/sprites.png';
  
  this.PauseMenu = new lime.fill.Frame('images/pause_menu.png', 0, 0, 446, 226);
  this.OptionsMenu = new lime.fill.Frame('images/options_menu.png', 0, 0, 446, 305);
  this.CreditsMenu = new lime.fill.Frame('images/credits_menu.png', 0, 0, 661, 900);
  this.MenuStatusOn = new lime.fill.Frame('images/on_status.png', 0, 0, 167, 37);
  this.MenuStatusOff = new lime.fill.Frame('images/off_status.png', 0, 0, 167, 37);
  
  this.ChainFrame = new lime.fill.Frame('images/chains.png', 0, 0, 23, constants.TileHeight);
  
  this.WallTile = new lime.fill.Frame('images/wall.png', 0, 0, constants.TileWidth, constants.WallWidth);
  this.CornerWallTile = new lime.fill.Frame('images/wall.png', constants.TileWidth, 0, constants.WallWidth, constants.WallWidth);
  this.FactoryTile = new lime.fill.Frame(sprites, constants.TileWidth, constants.TileHeight*4, constants.TileWidth, constants.TileHeight);
  this.ParkingTile = new lime.fill.Frame(sprites, 0, constants.TileHeight * 4, constants.TileWidth, constants.TileHeight);
  this.GradiantFogTile = new lime.fill.Frame(sprites, constants.TileWidth * 3, constants.TileHeight * 4, constants.TileWidth, constants.TileHeight);
  
  this.RobertFrame = new lime.fill.Frame(sprites, constants.TileWidth*4, constants.TileHeight*2, constants.TileWidth + 0, constants.TileHeight + 64);
  
  // Initialization of 6 box variations.
  this.Boxes = [];
  var boxX = 0;
  for (var boxId = 0; boxId < 6; boxId++) {
    boxX = constants.TileWidth * boxId;
    this.Boxes.push(new lime.fill.Frame(sprites, boxX, 0, constants.TileWidth, constants.TileHeight));
  }
  
  // Initialization of 4 skids variations.
  this.Skids = [];
  var skidX = 0;
  for (var skidId = 0; skidId < 4; skidId++) {
    skidX = constants.TileWidth * skidId;
    this.Skids.push(new lime.fill.Frame(sprites, skidX, constants.TileHeight, constants.TileWidth, constants.TileHeight));
  }
  
  // Initialization of 4 Trucks variations.
  this.Trucks = [];
  var truckX = 0;
  for (var truckId = 0; truckId < 4; truckId++) {
    truckX = constants.TileWidth * truckId;
    this.Trucks.push(new lime.fill.Frame(sprites, truckX, constants.TileHeight*2, constants.TileWidth, constants.TileHeight*2));
  }
  
  this.Constants = constants;
  
  // Wait for images to be loaded before starting the game.
  var factoryTile = this.FactoryTile;
  var isLoaded = function(){
    if (factoryTile.isLoaded()){
      clearInterval(interval);
      start();
    }
  }
  var interval = setInterval(isLoaded, 1);
}

/**
 * Generate the sprite for Robert.
 */
robert_the_lifter.Media.prototype.GetRobertSprite = function() {
  var skidIndex = Math.floor((Math.random()*this.Skids.length));
  
  return new lime.Sprite()
    .setSize(this.Constants.TileWidth, this.Constants.TileHeight)
    .setFill(this.Skids[skidIndex])
    .setAnchorPoint(0.5, 0.5);
}

/**
 * Generate the sprite for box.
 */
robert_the_lifter.Media.prototype.GetBoxSprite = function() {
  var boxIndex = Math.floor((Math.random()*this.Boxes.length));
  
  return new lime.Sprite()
    .setSize(this.Constants.TileWidth, this.Constants.TileHeight)
    .setFill(this.Boxes[boxIndex])
    .setAnchorPoint(0.5, 0.5);
}

/**
 * Generate the sprite for skid.
 */
robert_the_lifter.Media.prototype.GetSkidSprite = function() {
  var skidIndex = Math.floor((Math.random()*this.Skids.length));
  
  return new lime.Sprite()
    .setSize(this.Constants.TileWidth, this.Constants.TileHeight)
    .setFill(this.Skids[skidIndex])
    .setAnchorPoint(0.5, 0.5);
}

/**
 * Generate the sprite for Truck.
 */
robert_the_lifter.Media.prototype.GetTruckSprite = function(x, y) {
  var truckIndex = Math.floor((Math.random()*this.Trucks.length));
  
  return new lime.Sprite()
    .setSize(this.Constants.TileWidth, this.Constants.TileHeight * 2)
    .setFill(this.Trucks[truckIndex])
    .setAnchorPoint(0, 0)
    .setPosition(x, y);
}

/**
 * Generate the sprite for Parking.
 */
robert_the_lifter.Media.prototype.GetParkingSprite = function(x, y) {
  return new lime.Sprite()
    .setAnchorPoint(0,0)
    .setSize(this.Constants.TileWidth, this.Constants.TileHeight)
    .setPosition(x, y)
    .setFill(this.ParkingTile);
}

/**
 * Get a sprite of the on/off image.
 */
robert_the_lifter.Media.prototype.GetStatusSprite = function(status, x, y) {
  var fill = status ? this.MenuStatusOn : this.MenuStatusOff
  
  var statusSprite = new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(x, y)
    .setFill(fill);
        
  return statusSprite;
}

/**
 * Get a sprite of the wall.
 */
robert_the_lifter.Media.prototype.GetWallSprite = function(x, y) {
  return new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(x, y)
    .setSize(this.Constants.TileWidth, this.Constants.WallWidth)
    .setFill(this.WallTile);
}

/**
 * Get a sprite of the wall corner.
 */
robert_the_lifter.Media.prototype.GetWallCornerSprite = function(x, y, rotation) {
  return new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(x, y)
    .setRotation(rotation)
    .setSize(this.Constants.WallWidth, this.Constants.WallWidth)
    .setFill(this.CornerWallTile);
}

/**
 * Get a sprite of the wall corner.
 */
robert_the_lifter.Media.prototype.GetGradiantFogSprite = function(x, y) {
  return new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(x, y)
    .setSize(this.Constants.TileWidth, this.Constants.TileHeight * this.Constants.FactoryNbTileHeight)
    .setFill(this.GradiantFogTile);
}