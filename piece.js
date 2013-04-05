goog.provide('robert_the_lifter.Piece');

goog.require('robert_the_lifter.Block');
goog.require('lime.fill.Frame');

robert_the_lifter.Piece = function(game, id) {
  this.isFreeFalling = true; // Will be true when the lift has grabbed the piece.
  this.id = id;
  this.game = game;
  
  this.blocks = [];
  this.state = robert_the_lifter.Piece.GETTING_PUSHED;
  this.timeToNextPush = game.getPieceSpeed();
}

/**
 * Randomly choose a shape for the piece and place it at spawning point.
 */
robert_the_lifter.Piece.prototype.initSpawningPiece = function(coords) {
  this.blocks = [
    this.createBlock(coords[0].x, coords[0].y),
    this.createBlock(coords[1].x, coords[1].y),
    this.createBlock(coords[2].x, coords[2].y),
    this.createBlock(coords[3].x, coords[3].y)
  ];
  
  this.updateChains();
}

/**
 * Randomly choose a piece shape and return coordinates for a future piece.
 */
robert_the_lifter.Piece.prototype.getNewPieceCoordinates = function (exceptions, first) {
//  var x = this.game.factoryNbTileWidth - 1;
//  var y = 3;

  var x = 20,
      y = 4,
      remainingTries = 6,
      nbPieces = 7;
      
  // If it's the first piece, we never generate O S OR Z
  if (first) {
    nbPieces = 4;
  }
  
  var pieceType;
  do {
    pieceType = Math.floor((Math.random()*nbPieces)+1);
    remainingTries--;
  } while(remainingTries > 0 && exceptions.indexOf(pieceType) > 0)
  
  this.type = pieceType;

  switch(pieceType) {
    case robert_the_lifter.Piece.J:
      return this.createJ(x, y);
      break;
    case robert_the_lifter.Piece.L:
      return this.createL(x, y);
      break;
    case robert_the_lifter.Piece.I:
      return this.createI(x-1, y); // yeah... make it appear a lil bit in the factory.
      break;
    case robert_the_lifter.Piece.T:
      return this.createT(x, y);
      break;
    case robert_the_lifter.Piece.O:
      return this.createO(x, y);
      break;
    case robert_the_lifter.Piece.S:
      return this.createS(x, y);
      break;
    case robert_the_lifter.Piece.Z:
      return this.createZ(x, y);
      break;
  }
}

/**
 * Add chains to the piece.
 */
robert_the_lifter.Piece.prototype.updateChains = function () {
  // Delete existing chains
  for (var j in this.blocks) {
    this.blocks[j].removeChains();
  }
  
  var blocksToCompare = this.blocks.slice(0);
  this.chains = [];
  for (var i in this.blocks) {
    // Remove the first element so that the current block never compare to himself or previous blocks
    blocksToCompare.splice(0, 1);
    
    for (var j in blocksToCompare) {
      var height = this.game.Constants.TileHeight;
      var chainFill = new lime.fill.Frame('images/chains.png', 0, 0, 21, this.game.Constants.TileHeight);
      // If the comparing block is somewhere around the current one, we place chains accordingly.
      if (this.blocks[i].x + 1 == blocksToCompare[j].x && this.blocks[i].y == blocksToCompare[j].y) {
        // The block is right
        this.blocks[i].addChains(0);
      }
      else if (this.blocks[i].x - 1 == blocksToCompare[j].x && this.blocks[i].y == blocksToCompare[j].y) {
        // The block is left
        this.blocks[i].addChains(180);
      }
      else if (this.blocks[i].x == blocksToCompare[j].x && this.blocks[i].y + 1 == blocksToCompare[j].y) {
        // The block is down
        this.blocks[i].addChains(270);
      }
      else if (this.blocks[i].x == blocksToCompare[j].x && this.blocks[i].y - 1 == blocksToCompare[j].y) {
        // The block is up
        this.blocks[i].addChains(90);
      }
      
      function getChains(x, y, rotation, chainFill) {
        return new lime.Sprite()
          .setAnchorPoint(.5, .5)
          .setPosition(x, y)
          .setFill(chainFill)
          .setRotation(rotation)
          .setSize(21, height);
      }
    }
  }
}

/**
 * The I
 * ....
 * xxxx
 * ....
 */
robert_the_lifter.Piece.prototype.createI = function(x, y) {
  return [
    {x:x,     y:y + 1},
    {x:x + 1, y:y + 1},
    {x:x + 2, y:y + 1},
    {x:x + 3, y:y + 1}
  ];
}
  
/**
 * The L
 * xxx.
 * x...
 * ....
 */
robert_the_lifter.Piece.prototype.createL = function(x, y) {
  return [
    {x:x,     y:y},
    {x:x + 1, y:y},
    {x:x + 2, y:y},
    {x:x    , y:y + 1}
  ];
}
  
/**
 * The J
 * x...
 * xxx.
 * ....
 */
robert_the_lifter.Piece.prototype.createJ = function(x, y) {
  return [
    {x:x,     y:y},
    {x:x,     y:y + 1},
    {x:x + 1, y:y + 1},
    {x:x + 2, y:y + 1}
  ];
}
  
/**
 * The O
 * .xx.
 * .xx.
 * ....
 */
robert_the_lifter.Piece.prototype.createO = function(x, y) {
  return [
    {x:x + 1, y:y},
    {x:x + 1, y:y + 1},
    {x:x + 2, y:y},
    {x:x + 2, y:y + 1}
  ];
}
  
/**
 * The T piece
 * .x..
 * xxx.
 * ....
 */
robert_the_lifter.Piece.prototype.createT = function(x, y) {
  return [
    {x:x + 1, y:y},
    {x:x,     y:y + 1},
    {x:x + 1, y:y + 1},
    {x:x + 2, y:y + 1}
  ];
}
  
/**
 * The S piece
 * .xx.
 * xx..
 * ....
 */
robert_the_lifter.Piece.prototype.createS = function(x, y) {
  return [
    {x:x + 1, y:y},
    {x:x + 2, y:y},
    {x:x,     y:y + 1},
    {x:x + 1, y:y + 1}
  ];
}

/**
 * The Z
 * xx..
 * .xx.
 * ....
 */
robert_the_lifter.Piece.prototype.createZ = function(x, y) {
  return [
    {x:x,     y:y},
    {x:x + 1, y:y},
    {x:x + 1, y:y + 1},
    {x:x + 2, y:y + 1}
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
  
  // Move the chains
  for (var j in this.chains) {
    var pos = this.chains[j].getPosition();
    pos.x += (x * this.game.Constants.TileWidth);
    pos.y += (y * this.game.Constants.TileHeight);
  }
}

/**
 * Move the piece to the new locations + rotate.
 */ 
robert_the_lifter.Piece.prototype.moveAndRotate = function (newPos, newRotation) {
  this.game.switchPieceState(this, robert_the_lifter.Game.NO_PIECE);
  for(var j = 0; j < this.blocks.length; j++) {
    var oldX = this.blocks[j].x,
        oldY = this.blocks[j].y;
    
    this.game.switchState(oldX, oldY, robert_the_lifter.Game.NO_PIECE);
    this.game.switchState(newPos[j][0], newPos[j][1], this.id);
    
    this.blocks[j].moveTo(newPos[j][0], newPos[j][1]);
    this.blocks[j].rotate(newRotation);
  }
  this.game.switchPieceState(this, this.id);
}

/**
 * Check if the piece has reached the left limit of the factory.
 */
robert_the_lifter.Piece.prototype.reachedLeftLimit = function () {
  var hasReached = false;
  
  for (var i = 0; i < this.blocks.length && !hasReached; i ++) {
    var pos = this.blocks[i].getPosition();
    var size = this.blocks[i].getSize();
    if (pos.x - (size.width * this.anchor) <= this.game.Constants.FactoryX) {
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
  blockToDelete.removeChains();
  // Remove the block.
  blockToDelete.remove();
  this.blocks.splice(index, 1);
  delete blockToDelete;
}

/**
 * Check if the piece must be split and do it if necessary.
 */
robert_the_lifter.Piece.prototype.split = function () {
  var array1 = [this.blocks[0]], array2 = [];
  
  // as Soon as we find a block that is 2 blocks way from any block of the 
  // first array, we put it in the 2nd array. That means there will be a split.
  for(var i = 1; i < this.blocks.length; i++) {
    var putInArray1 = false;
    
    // If the block is beside anothe block in array1, this one belongs to array1 too
    for (var j in array1) {
      if (!putInArray1 && (array1[j].x == this.blocks[i].x || array1[j].x == this.blocks[i].x + 1 || array1[j].x == this.blocks[i].x - 1)) {
        putInArray1 = true;
      }
    }
    
    if (putInArray1) {
      array1.push(this.blocks[i]);
    } else {
      array2.push(this.blocks[i]);
    }
  }
  
  // If there are block in array2 AND array1, that means we split.
  if (array2.length > 0 && array1.length > 0) {
    var newId = this.game.pieces.length;
    var newPiece = new robert_the_lifter.Piece(this.game, newId);
    newPiece.blocks = array2;
    newPiece.state = this.state;
    this.game.pieces[newId] = newPiece;
    newPiece.updateChains();
    this.game.switchPieceState(newPiece, newPiece.id);    
    this.blocks = array1;
  }
  this.updateChains();
}

/**
 * Add the current piece to a layer.
 */
robert_the_lifter.Piece.prototype.appendTo = function (layer) {
  for (var i in this.blocks) {
    this.blocks[i].appendTo(layer);
  }
  
  // After appending blocks, we must adjust chains index.
  for (var j in this.blocks) {
    this.blocks[j].updateChainsIndex();
  }
}

robert_the_lifter.Piece.GETTING_PUSHED = 1;
robert_the_lifter.Piece.GRABBED = 2;
robert_the_lifter.Piece.BLOCKED = 3;

robert_the_lifter.Piece.J = 1;
robert_the_lifter.Piece.L = 2;
robert_the_lifter.Piece.I = 3;
robert_the_lifter.Piece.T = 4;
robert_the_lifter.Piece.O = 5;
robert_the_lifter.Piece.S = 6;
robert_the_lifter.Piece.Z = 7;