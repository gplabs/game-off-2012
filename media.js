goog.provide('robert_the_lifter.Media');
goog.require('goog.net.ImageLoader');

/**
 * Initialization of all media. (Preloading)
 */
robert_the_lifter.Media = function(constants) {
//  var imageLoader = new goog.net.ImageLoader();
//  goog.events.listen(imageLoader, goog.net.EventType.COMPLETE,
//  function(e) { 
//    this._imagesLoaded = true;
//    console.log("Images has finished loading.");
//  });
//  imageLoader.addImage("sprites", "images/sprites.png");
//  imageLoader.start();
  
//  while(!this._imagesLoaded) { 
//    break;
//    console.log("sprites are still not loaded :o");
//  }
  
  
  this.PauseMenu = new lime.fill.Frame('images/pause_menu.png', 0, 0, 446, 226);
  this.OptionsMenu = new lime.fill.Frame('images/options_menu.png', 0, 0, 446, 305);
  this.CreditsMenu = new lime.fill.Frame('images/credits_menu.png', 0, 0, 661, 900);
  
//  this._sprite = new lime.fill.Image('images/sprites.png');
//  while(!this._sprite.isLoaded()) { 
//    break;
//    console.log("sprites are still not loaded :o");
//  }
  
  
  this.FactoryTile = new lime.fill.Frame('images/sprites.png', constants.TileWidth, constants.TileHeight*4, constants.TileWidth, constants.TileHeight);
  
  this.RobertFrame = new lime.fill.Frame('images/sprites.png', constants.TileWidth*4, constants.TileHeight*2, constants.TileWidth + 0, constants.TileHeight + 64);
  
  // Initialization of 6 box variations.
  this.Boxes = [];
  var boxX = 0;
  for (var boxId = 0; boxId < 6; boxId++) {
    boxX = constants.TileWidth * boxId;
    this.Boxes.push(new lime.fill.Frame('images/sprites.png', boxX, 0, constants.TileWidth, constants.TileHeight));
  }
  
  // Initialization of 4 skids variations.
  this.Skids = [];
  var skidX = 0;
  for (var skidId = 0; skidId < 4; skidId++) {
    skidX = constants.TileWidth * skidId;
    this.Skids.push(new lime.fill.Frame('images/sprites.png', skidX, constants.TileHeight, constants.TileWidth, constants.TileHeight));
  }
  
  this.Constants = constants;
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

