goog.provide('robert_the_lifter.Piece');

goog.require('robert_the_lifter.Block');
goog.require('lime.fill.Frame');

robert_the_lifter.Piece = function(game, id) {
  this.isFreeFalling = true; // Will be true when the lift has grabbed the piece.
  this.id = id;
  this.game = game;
  
  this.blocks = [];
  this.state = robert_the_lifter.Piece.GETTING_PUSHED;
  this.blockingPieces = []; // Pieces that blocks me.
  this.beingBlocked = []; // Pieces I block.
  this.timeToNextPush = robert_the_lifter.Piece.DEFAULT_SPEED;
  
  var x = game.factoryNbTileWidth - 1;
  var y = 3;

  var pieceType = Math.floor((Math.random()*7)+1);
  switch(pieceType) {
    case 1:
      this.blocks = this.createPieceInvertedL(x, y);
      break;
    case 2:
      this.blocks = this.createPieceL(x, y);
      break;
    case 3:
      this.blocks = this.createPieceBar(x, y);
      break;
    case 4:
      this.blocks = this.createPieceSquare(x, y);
      break;
    case 5:
      this.blocks = this.createPieceT(x, y);
      break;
    case 6:
      this.blocks = this.createPieceS(x, y);
      break;
    case 7:
      this.blocks = this.createPieceInvertedS(x, y);
      break;
  }
  this.game.switchPieceState(this, this.id);
}

/**
 * The bar piece
 * 
 *  x
 *  x
 *  x
 *  x
 */
robert_the_lifter.Piece.prototype.createPieceBar = function(x, y) {
  return [
    this.createBlock(x, y),
    this.createBlock(x, y + 1),
    this.createBlock(x, y + 2),
    this.createBlock(x, y + 3)
  ];
}
  
/**
 * The L piece
 * 
 *  x
 *  x
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceL = function(x, y) {
  return [
    this.createBlock(x, y),
    this.createBlock(x, y + 1),
    this.createBlock(x, y + 2),
    this.createBlock(x + 1, y + 2)
  ];
}
  
/**
 * The inverted L piece
 * 
 *   x
 *   x
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceInvertedL = function(x, y) {
  return [
    this.createBlock(x, y),
    this.createBlock(x, y + 1),
    this.createBlock(x, y + 2),
    this.createBlock(x - 1, y + 2)
  ];
}
  
/**
 * The square piece
 * 
 *  xx
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceSquare = function(x, y) {
  return [
    this.createBlock(x, y),
    this.createBlock(x + 1, y),
    this.createBlock(x, y + 1),
    this.createBlock(x + 1, y + 1)
  ];
}
  
/**
 * The T piece
 * 
 *  xxx
 *   x
 */
robert_the_lifter.Piece.prototype.createPieceT = function(x, y) {
  return [
    this.createBlock(x, y),
    this.createBlock(x + 1, y),
    this.createBlock(x + 2, y),
    this.createBlock(x + 1, y + 1)
  ];
}
  
/**
 * The S piece
 * 
 *   xx
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceS = function(x, y) {
  return [
    this.createBlock(x, y),
    this.createBlock(x + 1, y),
    this.createBlock(x, y + 1),
    this.createBlock(x - 1, y + 1)
  ];
}
  
/**
 * The inverted S piece
 * 
 *  xx
 *   xx
 */
robert_the_lifter.Piece.prototype.createPieceInvertedS = function(x, y) {
  return [
    this.createBlock(x, y),
    this.createBlock(x - 1, y),
    this.createBlock(x, y + 1),
    this.createBlock(x + 1, y + 1)
  ];
}


/**
 * Create one of the piece squares
 */
robert_the_lifter.Piece.prototype.createBlock = function (x, y) {
  return new robert_the_lifter.Block(x, y, this.game);
}

/**
 * Move the piece (+x, +y)
 */
robert_the_lifter.Piece.prototype.move = function (x, y) {
  this.game.switchPieceState(this, robert_the_lifter.Game.NO_PIECE);
  this.game.switchPieceState(this, this.id, x, y);
  
  // Move the grabbed piece.
  for (var i in this.blocks) {
    this.blocks[i].move(x, y);
  }
}

/**
 * Move the piece to the new locations + rotate.
 */ 
robert_the_lifter.Piece.prototype.moveAndRotate = function (newPos, newRotation) {
  for(var j = 0; j < this.blocks.length; j++) {
    var oldX = this.blocks[j].x,
        oldY = this.blocks[j].y;
    
    this.game.switchState(oldX, oldY, robert_the_lifter.Game.NO_PIECE);
    this.game.switchState(newPos[j][0], newPos[j][1], this.id);
    
    this.blocks[j].moveTo(newPos[j][0], newPos[j][1]);
    this.blocks[j].rotate(newRotation);
  }
}

/**
 * Check if the piece has reached the left limit of the factory.
 */
robert_the_lifter.Piece.prototype.reachedLeftLimit = function () {
  var hasReached = false;
  
  for (var i = 0; i < this.blocks.length && !hasReached; i ++) {
    var pos = this.blocks[i].getPosition();
    var size = this.blocks[i].getSize();
    if (pos.x - (size.width * this.anchor) <= this.game.factoryX) {
      hasReached = true;
    }
  }
  
  return hasReached;
}

/**
 * Remove the block from the piece.
 */
robert_the_lifter.Piece.prototype.removeBlock = function (index) {
  var blockToDelete = this.blocks[index];
  blockToDelete.remove();
  
  this.blocks.splice(index, 1);
  delete blockToDelete;
}

/**
 * Add the current piece to a layer.
 */
robert_the_lifter.Piece.prototype.appendTo = function (layer) {
  for (var i in this.blocks) {
    this.blocks[i].appendTo(layer);
  }
}

robert_the_lifter.Piece.DEFAULT_SPEED = 1000;
robert_the_lifter.Piece.GETTING_PUSHED = 1;
robert_the_lifter.Piece.GRABBED = 2;
robert_the_lifter.Piece.BLOCKED = 3;
