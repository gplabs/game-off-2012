/**
 * A block is a square. One of the piece parts.
 */

goog.provide('robert_the_lifter.Block');

robert_the_lifter.Block = function(x, y, game) {
  this.anchor = 0.5;
  this.x = x;
  this.y = y;
  this.game = game;
  
  // Convert coords into pixels.
  var posX = (this.x * game.tileWidth) + game.factoryX + (this.anchor*game.tileWidth);
  var posY = (this.y * game.tileHeight) + game.factoryY + (this.anchor*game.tileHeight);
  
  // getting a random image from the boxes image.
  var boxX = this.game.tileWidth * Math.floor((Math.random()*3));
  var boxesFrame = new lime.fill.Frame('images/boxes.png', boxX, 0, this.game.tileWidth, this.game.tileHeight);
  
  this.box = new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(boxesFrame)
    .setPosition(posX, posY)
    .setAnchorPoint(this.anchor, this.anchor);

  // Getting a random image from the skids.
  var imageX = this.game.tileWidth * Math.floor((Math.random()*4));
  var frame = new lime.fill.Frame('images/skids.png', imageX, 0, this.game.tileWidth, this.game.tileHeight);
  
  this.skid = new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(frame)
    .setPosition(posX, posY)
    .setAnchorPoint(this.anchor, this.anchor);
}

/**
 * Append the block to a layer
 */
robert_the_lifter.Block.prototype.appendTo = function (layer) {
  this.layer = layer;
  layer.appendChild(this.skid);
  layer.appendChild(this.box);
}

/**
 * Remove the block from it's layer.
 */
robert_the_lifter.Block.prototype.remove = function () {
  this.layer.removeChild(this.skid);
  this.layer.removeChild(this.box);
}

/**
 * Move the block (+x, +y)
 */
robert_the_lifter.Block.prototype.move = function (x, y) {
  var skidPos = this.skid.getPosition(),
      boxPos = this.box.getPosition(),
      pixelX = x * this.game.tileWidth,
      pixelY = y * this.game.tileHeight;
  
  this.x += x;
  this.y += y;
  
  skidPos.x += pixelX;
  skidPos.y += pixelY;
  boxPos.x += pixelX;
  boxPos.y += pixelY;
  
  this.skid.setPosition(skidPos);
  this.box.setPosition(boxPos);
}