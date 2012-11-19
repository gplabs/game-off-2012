/**
 * A block is a square. One of the piece parts.
 */

goog.provide('robert_the_lifter.Block');

robert_the_lifter.Block = function(x, y, game) {
  this.anchor = 0.5;
  this.x = x;
  this.y = y;
  this.game = game;
  
  // getting a random image from the boxes image.
  var boxX = this.game.tileWidth * Math.floor((Math.random()*4));
  var boxesFrame = new lime.fill.Frame('images/boxes.png', boxX, 0, this.game.tileWidth, this.game.tileHeight);
  
  this.box = new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(boxesFrame)
    .setAnchorPoint(this.anchor, this.anchor);

  // Getting a random image from the skids.
  var imageX = this.game.tileWidth * Math.floor((Math.random()*4));
  var frame = new lime.fill.Frame('images/skids.png', imageX, 0, this.game.tileWidth, this.game.tileHeight);
  
  this.skid = new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(frame)
    .setAnchorPoint(this.anchor, this.anchor);
    
  // Place the block.
  this.moveTo(x, y);
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
  this.moveTo(this.x + x, this.y + y);
}

/**
 * Move the block to given coords(x, y)
 */
robert_the_lifter.Block.prototype.moveTo = function (x, y) {
  var newX = (x * this.game.tileWidth) + this.game.factoryX + (this.anchor*this.game.tileWidth),
      newY = (y * this.game.tileHeight) + this.game.factoryY + (this.anchor*this.game.tileHeight);
      
  this.x = x;
  this.y = y;
  
  this.skid.setPosition(newX, newY);
  this.box.setPosition(newX, newY);
}

/**
 * Rotate the block.
 */
robert_the_lifter.Block.prototype.rotate = function (rotation) {
  this.skid.setRotation(this.skid.getRotation() + rotation);
  this.box.setRotation(this.box.getRotation() + rotation);
}