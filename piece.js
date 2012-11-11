goog.provide('robert_the_lifter.Piece');

goog.require('lime.fill.Frame');
goog.require('robert_the_lifter.PiecesBlock');
robert_the_lifter.Piece = function(factory, game) {
  this.game = game;
  this.anchor = 0.5;
  this.boxes = [];
  this.isFreeFalling = true; // Will be true when the lift has grabbed the piece.

  // Initialise the piece with squares.
  var startingX = (this.anchor*game.tileWidth) + game.factoryX + game.factoryWidth - game.tileWidth*2;
  var startingY = (this.anchor*game.tileHeight) + game.factoryY + game.tileHeight*3;

  var pieceType = Math.floor((Math.random()*7)+1);
  switch(pieceType) {
    case 1:
      this.squares = this.createPieceInvertedL(startingX, startingY);
      break;
    case 2:
      this.squares = this.createPieceL(startingX, startingY);
      break;
    case 3:
      this.squares = this.createPieceBar(startingX, startingY);
      break;
    case 4:
      this.squares = this.createPieceSquare(startingX, startingY);
      break;
    case 5:
      this.squares = this.createPieceT(startingX, startingY);
      break;
    case 6:
      this.squares = this.createPieceS(startingX, startingY);
      break;
    case 7:
      this.squares = this.createPieceInvertedS(startingX, startingY);
      break;
  }

  for (var i in this.squares) {
    factory.appendChild(this.squares[i]);
    factory.appendChild(this.boxes[i]);
  }

  // The loop for dropping the piece.
  lime.scheduleManager.schedule(dropLoop, this);
  this.timeToNextGoingDown = this.DEFAULT_SPEED;
  function dropLoop(number) {
    if (this.isFreeFalling) {
      if (this.canGoLeft()) {
        this.timeToNextGoingDown -= number;
        if (this.timeToNextGoingDown <= 0) {
          this.timeToNextGoingDown += this.DEFAULT_SPEED;
          this.goLeft();
        }
      } 
      // Add the piece to the block if necessary.
      else if (this.game.piecesBlock.mustBeAdded(this)) {
        this.game.piecesBlock.addPiece(this);
      }
    }
  }
}

/**
 * The bar piece
 * 
 *  x
 *  x
 *  x
 *  x
 */
robert_the_lifter.Piece.prototype.createPieceBar = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX, startingY + this.game.tileHeight*2),
    this.createSquare(startingX, startingY + this.game.tileHeight*3)
  ];
}
  
/**
 * The L piece
 * 
 *  x
 *  x
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceL = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX, startingY + this.game.tileHeight*2),
    this.createSquare(startingX + this.game.tileWidth, startingY + this.game.tileHeight*2)
  ];
}
  
/**
 * The inverted L piece
 * 
 *   x
 *   x
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceInvertedL = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX, startingY + this.game.tileHeight*2),
    this.createSquare(startingX - this.game.tileWidth, startingY + this.game.tileHeight*2)
  ];
}
  
/**
 * The square piece
 * 
 *  xx
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceSquare = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX + this.game.tileWidth, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX + this.game.tileWidth, startingY + this.game.tileHeight)
  ];
}
  
/**
 * The T piece
 * 
 *  xxx
 *   x
 */
robert_the_lifter.Piece.prototype.createPieceT = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX + this.game.tileWidth, startingY),
    this.createSquare(startingX + this.game.tileWidth*2, startingY),
    this.createSquare(startingX + this.game.tileWidth, startingY + this.game.tileHeight)
  ];
}
  
/**
 * The S piece
 * 
 *   xx
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceS = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX + this.game.tileWidth, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX - this.game.tileWidth, startingY + this.game.tileHeight)
  ];
}
  
/**
 * The inverted S piece
 * 
 *  xx
 *   xx
 */
robert_the_lifter.Piece.prototype.createPieceInvertedS = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX - this.game.tileWidth, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX + this.game.tileWidth, startingY + this.game.tileHeight)
  ];
}


/**
 * Create one of the piece squares
 */
robert_the_lifter.Piece.prototype.createSquare = function (x, y) {
  var boxX = this.game.tileWidth * Math.floor((Math.random()*3));
  var boxesFrame = new lime.fill.Frame('images/boxes.png', boxX, 0, this.game.tileWidth, this.game.tileHeight);
  this.boxes.push(new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(boxesFrame)
    .setPosition(x, y)
    .setAnchorPoint(this.anchor, this.anchor));

  var imageX = this.game.tileWidth * Math.floor((Math.random()*4));
  var frame = new lime.fill.Frame('images/skids.png', imageX, 0, this.game.tileWidth, this.game.tileHeight);
  return new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(frame)
    .setPosition(x, y)
    .setAnchorPoint(this.anchor, this.anchor);
}

/**
 * Checks if the piece can move in the direction given.
 * params coords are current coords modifiers.
 */
robert_the_lifter.Piece.prototype.canMove = function (x, y, considerRobert) {
  var canMove = true;
  
  for (var i = 0; i < this.squares.length && canMove; i ++) {
    var squarePos = this.squares[i].getPosition();
    if (!this.game.canBePlace(squarePos.x + x, squarePos.y + y, this.key, considerRobert)) {
      canMove = false;
    }
  }
  
  return canMove;
}

/**
 * Check if the next drop is a legal one !
 */
robert_the_lifter.Piece.prototype.canGoLeft = function () {
  return this.canMove(-this.game.tileWidth, 0, true);
}

/**
 * Move the piece (+x, +y)
 */
robert_the_lifter.Piece.prototype.move = function (x, y) {
  // Move the grabbed piece.
  for (var i in this.squares) {
    var squarePos = this.squares[i].getPosition(),
        boxPos = this.boxes[i].getPosition();
    
    squarePos.x += x;
    squarePos.y += y;
    boxPos.x += x;
    boxPos.y += y;
  }
}

/**
 * Move the piece to the new locations + rotate.
 */ 
robert_the_lifter.Piece.prototype.moveAndRotate = function (newPos, newRotation) {
  for(var j = 0; j < this.squares.length; j++) {
    this.squares[j].setPosition(newPos[j][0], newPos[j][1]);
    this.squares[j].setRotation(this.squares[j].getRotation() + newRotation);
    
    this.boxes[j].setPosition(newPos[j][0], newPos[j][1]);
    this.boxes[j].setRotation(this.squares[j].getRotation() + newRotation);
  }
}

/**
 * Makes the entire piece go down one tile, no matter what !
 */
robert_the_lifter.Piece.prototype.goLeft = function () {
  for (var i in this.squares) {
    var pos = this.squares[i].getPosition();
    this.squares[i].setPosition(pos.x - this.game.tileWidth, pos.y);
    this.boxes[i].setPosition(pos.x - this.game.tileWidth, pos.y);
  }
}

/**
 * Check if the piece has reached the left limit of the factory.
 */
robert_the_lifter.Piece.prototype.reachedLeftLimit = function () {
  var hasReached = false;
  
  for (var i = 0; i < this.squares.length && !hasReached; i ++) {
    var pos = this.squares[i].getPosition();
    var size = this.squares[i].getSize();
    if (pos.x - (size.width * this.anchor) <= this.game.factoryX) {
      hasReached = true;
    }
  }
  
  return hasReached;
}

robert_the_lifter.Piece.prototype.removeSquare = function (index) {
  this.game.factoryLayer.removeChild(this.squares[index]);
  this.game.factoryLayer.removeChild(this.boxes[index]);
  this.squares.splice(index, 1);
  this.boxes.splice(index, 1);
}

robert_the_lifter.Piece.prototype.DEFAULT_SPEED = 1000;