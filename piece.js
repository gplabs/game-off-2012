goog.provide('robert_the_lifter.Piece');

robert_the_lifter.Piece = function(factory, game) {
  this.game = game;
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
  
  /**
   * Create one of the piece squares
   */
  function createSquare(x, y) {
    return new lime.Sprite()
      .setSize(game.tileWidth, game.tileHeight)
      .setAnchorPoint(0,0)
      .setFill(0,0,0)
      .setStroke(1, '#F55')
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
 * Makes the entire piece go down one tile.
 * Return true if it can continue down.
 */
robert_the_lifter.Piece.prototype.goDown = function (){
  var canContinue = true;
  for (var i in this.squares) {
    var pos = this.squares[i].getPosition();
    this.squares[i].setPosition(pos.x, pos.y + this.game.tileHeight);

    // If the next drop of this square would go too deep, we stop the entire drop.
    var size = this.squares[i].getSize();
    if (pos.y + this.game.tileHeight >= this.game.factoryHeight - size.height) {
      canContinue = false;
    }
  }
  
  return canContinue;
}