goog.provide('robert_the_lifter.Media');
goog.require('goog.net.ImageLoader');

/**
 * Initialization of all media. (Preloading)
 */
robert_the_lifter.Media = function(constants, start) {
  this.imageTileSize = 64;

  var sprites = 'images/sprites.png';

  this.pauseMenuWidth = 446;
  this.pauseMenuHeight = 226;
  this.optionsMenuWidth = 446;
  this.optionsMenuHeight = 305;
  this.creditsMenuWidth = 661;
  this.creditsMenuHeight = 900;
  this.menuStatusWidth = 167;
  this.menuStatusHeight = 37;

  this.PauseMenu = new lime.fill.Frame('images/pause_menu.png', 0, 0, this.pauseMenuWidth, this.pauseMenuHeight);
  this.OptionsMenu = new lime.fill.Frame('images/options_menu.png', 0, 0, this.optionsMenuWidth, this.optionsMenuHeight);
  this.CreditsMenu = new lime.fill.Frame('images/credits_menu.png', 0, 0, this.creditsMenuWidth, this.creditsMenuHeight);
  this.MenuStatusOn = new lime.fill.Frame('images/on_status.png', 0, 0, this.menuStatusWidth, this.menuStatusHeight);
  this.MenuStatusOff = new lime.fill.Frame('images/off_status.png', 0, 0, this.menuStatusWidth, this.menuStatusHeight);

  this.chainWidth = 23;
  this.ChainFrame = new lime.fill.Frame('images/chains.png', 0, 0, this.chainWidth, this.imageTileSize);

  this.WallTile = new lime.fill.Frame('images/wall.png', 0, 0, this.imageTileSize, constants.DefaultWallWidth);
  this.CornerWallTile = new lime.fill.Frame('images/wall.png', this.imageTileSize, 0, constants.DefaultWallWidth, constants.DefaultWallWidth);
  this.FactoryTile = new lime.fill.Frame(sprites, this.imageTileSize, this.imageTileSize*4, this.imageTileSize, this.imageTileSize);
  this.ParkingTile = new lime.fill.Frame(sprites, 0, this.imageTileSize * 4, this.imageTileSize, this.imageTileSize);
  this.GradiantFogTile = new lime.fill.Frame(sprites, this.imageTileSize * 3, this.imageTileSize * 4, this.imageTileSize, this.imageTileSize);

  this.RobertFrame = new lime.fill.Frame(sprites, this.imageTileSize*4, this.imageTileSize*2, this.imageTileSize, this.imageTileSize*2);

  // Initialization of 6 box variations.
  this.Boxes = [];
  var boxX = 0;
  for (var boxId = 0; boxId < 6; boxId++) {
    boxX = this.imageTileSize * boxId;
    this.Boxes.push(new lime.fill.Frame(sprites, boxX, 0, this.imageTileSize, this.imageTileSize));
  }

  // Initialization of 4 skids variations.
  this.Skids = [];
  var skidX = 0;
  for (var skidId = 0; skidId < 4; skidId++) {
    skidX = this.imageTileSize * skidId;
    this.Skids.push(new lime.fill.Frame(sprites, skidX, this.imageTileSize, this.imageTileSize, this.imageTileSize));
  }

  // Initialization of 4 Trucks variations.
  this.Trucks = [];
  var truckX = 0;
  for (var truckId = 0; truckId < 4; truckId++) {
    truckX = this.imageTileSize * truckId;
    this.Trucks.push(new lime.fill.Frame(sprites, truckX, this.imageTileSize*2, this.imageTileSize, this.imageTileSize*2));
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
    .setFill(fill)
    .setSize(this.menuStatusWidth * this.Constants.ratio, this.menuStatusHeight * this.Constants.ratio);

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

/**
 * Get a sprite for the pause menu.
 */
robert_the_lifter.Media.prototype.GetPauseMenuSprite = function(x, y) {
  return new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(x, y)
    .setFill(this.PauseMenu)
    .setSize(this.pauseMenuWidth * this.Constants.ratio, this.pauseMenuHeight * this.Constants.ratio);
}

/**
 * Get a sprite for the chains!
 */
robert_the_lifter.Media.prototype.GetChainSprite = function() {
  return new lime.Sprite()
    .setAnchorPoint(.5, .5)
    .setFill(this.ChainFrame)
    .setSize(this.chainWidth * this.Constants.ratio, this.Constants.TileHeight);
}

/**
 * Get a sprite for the chains!
 */
robert_the_lifter.Media.prototype.GetOptionsMenuSprite = function(x, y) {
  return new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(x, y)
    .setFill(this.OptionsMenu)
    .setSize(this.optionsMenuWidth * this.Constants.ratio, this.optionsMenuHeight * this.Constants.ratio);
}

/**
 * Get a sprite for the credits!
 */
robert_the_lifter.Media.prototype.GetCreditsSprite = function() {
  var x = (this.Constants.FactoryWidth / 2) - ((this.creditsMenuWidth * this.Constants.ratio) / 2);
  var creditsRatio = (this.Constants.GameHeight / this.creditsMenuHeight);
  return new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(x, 0)
    .setFill(this.CreditsMenu)
    .setSize(this.creditsMenuWidth*creditsRatio, this.creditsMenuHeight * creditsRatio);//this.creditsMenuHeight*this.Constants.ratio);
}