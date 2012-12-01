/**
 * A block is a square. One of the piece parts.
 */

goog.provide('robert_the_lifter.Block');

robert_the_lifter.Block = function(x, y, game) {
  this.anchor = 0.5;
  this.x = x;
  this.y = y;
  this.game = game;
  this.chainFill = new lime.fill.Frame('images/chains.png', 0, 0, 23, this.game.tileHeight);
  this.chains = [];
  
  // getting a random image from the boxes image.
  var boxX = this.game.tileWidth * Math.floor((Math.random()*6));
  var boxesFrame = new lime.fill.Frame('images/sprites.png', boxX, 0, this.game.tileWidth, this.game.tileHeight);
  
  this.box = new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(boxesFrame)
    .setAnchorPoint(this.anchor, this.anchor);

  // Getting a random image from the skids.
  var imageX = this.game.tileWidth * Math.floor((Math.random()*4));
  var frame = new lime.fill.Frame('images/sprites.png', imageX, this.game.tileHeight, this.game.tileWidth, this.game.tileHeight);
  
  this.skid = new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(frame)
    .setAnchorPoint(this.anchor, this.anchor);
    
  // Place the block.
  this.moveTo(x, y);
}

/**
 * Add a set of chains to the block.
 * rotation :
 * 0  : right
 * 90 : up
 * 180: left
 * 270: down
 */
robert_the_lifter.Block.prototype.addChains = function(rotation) {
  var chains = new lime.Sprite()
    .setAnchorPoint(.5, .5)
    .setFill(this.chainFill)
    .setSize(21, this.game.tileHeight);
  this.rotateChain(chains, rotation);
  this.chains.push(chains);
  
  if (typeof this.layer != "undefined") {
    this.layer.appendChild(chains);
  }
}

robert_the_lifter.Block.prototype.removeChains = function (layer) {
  for (var i in this.chains) {
    this.layer.removeChild(this.chains[i]);
  }
  this.chains = [];
}

/**
 * Append the block to a layer
 */
robert_the_lifter.Block.prototype.appendTo = function (layer) {
  this.layer = layer;
  layer.appendChild(this.skid);
  layer.appendChild(this.box);
  
  for (var i in this.chains) {
    layer.appendChild(this.chains[i]);
  }
}
robert_the_lifter.Block.prototype.updateChainsIndex = function () {
  if (typeof this.layer !== "undefined") {

    var index = this.layer.getNumberOfChildren() + 1;

    for (var i in this.chains) {
      this.layer.setChildIndex(this.chains[i], index + i);
    }
  }
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
  
  for (var i in this.chains) {
    var chainsPos = this.chains[i].getPosition();
    chainsPos.x += x*this.game.tileWidth;
    chainsPos.y += y*this.game.tileHeight;
  }
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
  for(var i in this.chains) {
    this.rotateChain(this.chains[i], this.chains[i].getRotation() + rotation);
  }
}

robert_the_lifter.Block.prototype.rotateChain = function(chains, rotation) {
  if (rotation < 0) {
    rotation += 360;
  } else if (rotation == 360) {
    rotation = 0;
  }
  var pos = this.skid.getPosition();
  var chainX, chainY;
  
  switch(rotation) {
    case 0:
      chainX = pos.x + (this.game.tileWidth * this.anchor);
      chainY = pos.y;
      break;
    case 90:
      chainX = pos.x;
      chainY = pos.y - (this.game.tileHeight * this.anchor);
      break;
    case 180:
      chainX = pos.x - (this.game.tileWidth * this.anchor);
      chainY = pos.y;
      break
    case 270:
      chainX = pos.x;
      chainY = pos.y + (this.game.tileHeight * this.anchor);
      break;
  }
  
  chains.setPosition(chainX, chainY).setRotation(rotation);
}