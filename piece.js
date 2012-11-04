goog.provide('robert_the_lifter.Piece');

goog.require('lime.fill.Frame');
robert_the_lifter.Piece = function(factory, game) {
  this.game = game;

  this.isGrabbed = false; // Will be true when the lift has grabbed the piece.

  // Initialise the piece with squares.
  var startingX = game.factoryX + game.tileWidth*6;
  var startingY = game.factoryY + 0;

  var pieceType = Math.floor((Math.random()*7)+1);

  switch(pieceType) {
    case 1:
      this.squares = createPieceInvertedL();
      break;
    case 2:
      this.squares = createPieceL();
      break;
    case 3:
      this.squares = createPieceBar();
      break;
    case 4:
      this.squares = createPieceSquare();
      break;
    case 5:
      this.squares = createPieceT();
      break;
    case 6:
      this.squares = createPieceS();
      break;
    case 7:
      this.squares = createPieceInvertedS();
      break;
  }

  for (var i in this.squares) {
    factory.appendChild(this.squares[i]);
  }

  // The loop for dropping the piece.
  lime.scheduleManager.schedule(dropLoop, this);
  this.timeToNextGoingDown = this.DEFAULT_SPEED;
  function dropLoop(number) {
    if (this.canGoDown(this.game.pieces)) {
      this.timeToNextGoingDown -= number;
      if (this.timeToNextGoingDown <= 0) {
        this.timeToNextGoingDown += this.DEFAULT_SPEED;
        this.goDown();
      }
    }
  }

  /**
   * Create one of the piece squares
   */
  function createSquare(x, y) {
    var frame = new lime.fill.Frame('images/boxes.png', 0, 0, game.tileWidth, game.tileHeight);
    return new lime.Sprite()
      .setSize(game.tileWidth, game.tileHeight)
      .setAnchorPoint(0,0)
      .setFill(frame)
      .setPosition(x, y);
  }
  
  /**
   * The bar piece
   * 
   *  x
   *  x
   *  x
   *  x
   */
  function createPieceBar() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX, startingY + game.tileHeight*2),
      createSquare(startingX, startingY + game.tileHeight*3)
    ];
  }
  
  /**
   * The L piece
   * 
   *  x
   *  x
   *  xx
   */
  function createPieceL() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX, startingY + game.tileHeight*2),
      createSquare(startingX + game.tileWidth, startingY + game.tileHeight*2)
    ];
  }
  
  /**
   * The inverted L piece
   * 
   *   x
   *   x
   *  xx
   */
  function createPieceInvertedL() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX, startingY + game.tileHeight*2),
      createSquare(startingX - game.tileWidth, startingY + game.tileHeight*2)
    ];
  }
  
  /**
   * The square piece
   * 
   *  xx
   *  xx
   */
  function createPieceSquare() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX + game.tileWidth, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX + game.tileWidth, startingY + game.tileHeight)
    ];
  }
  
  /**
   * The T piece
   * 
   *  xxx
   *   x
   */
  function createPieceT() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX + game.tileWidth, startingY),
      createSquare(startingX + game.tileWidth*2, startingY),
      createSquare(startingX + game.tileWidth, startingY + game.tileHeight)
    ];
  }
  
  /**
   * The S piece
   * 
   *   xx
   *  xx
   */
  function createPieceS() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX + game.tileWidth, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX - game.tileWidth, startingY + game.tileHeight)
    ];
  }
  
  /**
   * The inverted S piece
   * 
   *  xx
   *   xx
   */
  function createPieceInvertedS() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX - game.tileWidth, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX + game.tileWidth, startingY + game.tileHeight)
    ];
  }
}

/**
 * Check if the next drop is a legal one !
 */
robert_the_lifter.Piece.prototype.canGoDown = function (otherPieces) {
  var canContinue = true;
  
  if (this.isGrabbed) {
    canContinue = false;
  }
  else 
  {
    for (var i in this.squares) {
      var pos = this.squares[i].getPosition();
      var y = pos.y + this.game.tileHeight;
      var x = pos.x;

      // If the next drop of this square would go too deep, we stop the entire drop.
      var size = this.squares[i].getSize();
      if (y > this.game.factoryHeight - size.height) {
        canContinue = false;
      }

      // If the next drop would overlap another piece, we stop it also.
      for (var j = 0; j < otherPieces.length && canContinue; j++) {
        if (j != this.key) { // Must not compare to myself.
          for (var k = 0; k < otherPieces[j].squares.length && canContinue; k++) {
            var otherPos = otherPieces[j].squares[k].getPosition();
            if (x == otherPos.x && y == otherPos.y) {
              canContinue = false;
            }
          }
        }
      }
    }
  }
  
  return canContinue;
}

/**
 * Makes the entire piece go down one tile, no matter what !
 */
robert_the_lifter.Piece.prototype.goDown = function (){
  for (var i in this.squares) {
    var pos = this.squares[i].getPosition();
    this.squares[i].setPosition(pos.x, pos.y + this.game.tileHeight);
  }
}

robert_the_lifter.Piece.prototype.DEFAULT_SPEED = 1000;