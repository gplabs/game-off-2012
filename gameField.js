
goog.provide('robert_the_lifter.GameField');

robert_the_lifter.GameField = function(game) {
  this.game = game;
  
  
}

/**
 * Initialize the entire field with -1
 */
robert_the_lifter.GameField.prototype.init = function (nbTileWidth, nbTileHeight) {
  this.field = [];
  this.nbTileHeight = nbTileHeight;
  this.nbTileWidth = nbTileWidth;
  for(var i = 0; i <= this.nbTileHeight - 1; i++) {
    this.field[i] = [];
    for(var j = 0; j <= this.nbTileWidth - 1; j++) {
      this.field[i][j] = robert_the_lifter.GameField.NO_PIECE;
    }
  }
  
  this.printField();
}

/**
 * Move a piece.
 */
robert_the_lifter.GameField.prototype.movePiece = function (x, y, piece) {
  // Set the current coordinates to a temp value.
  for(var i in piece.blocks) {
    this.field[piece.blocks[i].y][piece.blocks[i].x] = robert_the_lifter.GameField.TEMP;
  }
  
  // Set the new coordinates of the piece.
  for(var j in piece.blocks) {
    piece.blocks[j].move(x, y);
    this.field[piece.blocks[j].y][piece.blocks[j].x] = piece.id;
  }
  
  // Set back the temp values to NO_PIECE.
  for(var k in piece.blocks) {
    if (this.field[piece.blocks[k].y - y][piece.blocks[k].x - x] == robert_the_lifter.GameField.TEMP) {
      this.field[piece.blocks[k].y - y][piece.blocks[k].x - x] = robert_the_lifter.GameField.NO_PIECE;
    }
  }
  
  this.printField();
}

/**
 * Move Robert.
 */
robert_the_lifter.GameField.prototype.moveRobert = function (x, y, robert) {
  var pos = robert.getPosition();
  var newX = robert.x + x,
      newY = robert.y + y,
      oldX = robert.x,
      oldY = robert.y;
  
  robert.setPosition(pos.x + (x*this.game.tileWidth), pos.y + (y*this.game.tileHeight));
  this.field[newY][newX] = robert.id;
  robert.x = newX;
  robert.y = newY;
  this.field[oldY][oldX] = robert_the_lifter.GameField.NO_PIECE;
}

/**
 * Move Robert and his grabbed Piece.
 */
robert_the_lifter.GameField.prototype.moveRobertAndPiece = function (x, y, robert) {
  // Set the current coordinates to a temp value.
  this.field[robert.y][robert.x] = robert_the_lifter.GameField.TEMP;
  for(var i in robert.grabbedPiece.blocks) {
    this.field[robert.grabbedPiece.blocks[i].y][robert.grabbedPiece.blocks[i].x] = robert_the_lifter.GameField.TEMP;
  }
  
  // Set the new coordinates of the piece.
  var pos = robert.getPosition(),
      oldX = robert.x,
      oldY = robert.y;
  
  
  robert.x += x;
  robert.y += y;
  robert.setPosition(pos.x + (x*this.game.tileWidth), pos.y + (y*this.game.tileHeight));
  for(var j in robert.grabbedPiece.blocks) {
    robert.grabbedPiece.blocks[j].move(x, y);
    this.field[robert.grabbedPiece.blocks[j].y][robert.grabbedPiece.blocks[j].x] = robert.grabbedPiece.id;
  }
  
  // Set back the temp values to NO_PIECE.
  if (this.field[oldY][oldX] == robert_the_lifter.GameField.TEMP) {
    this.field[oldY][oldX] = robert_the_lifter.GameField.NO_PIECE
  }
  for(var k in robert.grabbedPiece.blocks) {
    if (this.field[robert.grabbedPiece.blocks[k].y - y][robert.grabbedPiece.blocks[k].x - x] == robert_the_lifter.GameField.TEMP) {
      this.field[robert.grabbedPiece.blocks[k].y - y][robert.grabbedPiece.blocks[k].x - x] = robert_the_lifter.GameField.NO_PIECE;
    }
  }
  
  this.printField();
}

/**
 * Rotate and move a piece.
 */
robert_the_lifter.GameField.prototype.moveAndRotate = function (newPos, newRotation, piece) {
  var oldCoords = [];
  
  // Set the current coordinates to a temp value.
  for(var i in piece.blocks) {
    oldCoords.push({x:piece.blocks[i].x, y:piece.blocks[i].y});
    this.field[piece.blocks[i].y][piece.blocks[i].x] = robert_the_lifter.GameField.TEMP;
  }
  
  // Set the new coordinates of the piece.
  for(var j in piece.blocks) {
    piece.blocks[j].moveTo(newPos[j][0], newPos[j][1]);
    piece.blocks[j].rotate(newRotation);
    
    this.field[newPos[i][1]][newPos[i][0]] = piece.id;
  }
  
  // Set back the temp values to NO_PIECE.
  for(var k in oldCoords) {
    if (this.field[oldCoords[k].y][oldCoords[k].x] == robert_the_lifter.GameField.TEMP) {
      this.field[oldCoords[k].y][oldCoords[k].x] = robert_the_lifter.GameField.NO_PIECE;
    }
  }
}

/**
 * Check what blocks the piece.
 * Possible values:
 * 
 * NOTHING
 * ROBERT
 * ROBERT'S GRABBED PIECE
 * GROUND
 */
robert_the_lifter.GameField.prototype.whatBlocksPiece = function(piece) {
  // Recursively check what blocks the piece.
  // If robert if found, we keep it and continue.
  // If Robert's grabbed piece is found, we keep it and continu
  // As soon as the GROUND is found, we stop and return it.
  var blocking = robert_the_lifter.GameField.NO_PIECE;
  for(var i = 0;i < piece.blocks.length && blocking !== robert_the_lifter.GameField.GROUND;i ++) {
    var newX = piece.blocks[i].x - 1,
        newY = piece.blocks[i].y;
    
    // Check if the block has reached the 'ground'
    if (newX < 0) {
      blocking = robert_the_lifter.GameField.GROUND;
    } else {
      var state = this.field[newY][newX];
      if  (typeof state != 'undefined' && state !== robert_the_lifter.GameField.NO_PIECE) {
        if (state === robert_the_lifter.GameField.ROBERT) {
          blocking = robert_the_lifter.GameField.ROBERT;
        } else if (this.game.robert.hasPiece && state === this.game.robert.grabbedPiece.id) {
          blocking = robert_the_lifter.GameField.GRABBED_PIECE;
        } else if (state != piece.id) {
          blocking = this.whatBlocksPiece(this.game.pieces[state]);
        }
      }
    }
  }
  
  return blocking;
}

robert_the_lifter.GameField.prototype.getId = function (x, y) {
  return this.field[y][x];
}

/**
 * Check if there is something at given coords.
 */
robert_the_lifter.GameField.prototype.containsSomething = function(x, y) {
  return (this.field[y][x] !== robert_the_lifter.GameField.NO_PIECE);
}

/**
 * Check if the given coords contains another piece that is not the piece given.
 */
robert_the_lifter.GameField.prototype.containsAnotherPiece = function(x, y, key) {
  return (this.field[y][x] !== robert_the_lifter.GameField.NO_PIECE &&
          this.field[y][x] !== robert_the_lifter.GameField.ROBERT &&
          this.field[y][x] !== key);
}

/**
 * Change the state of the location of the piece in the field to whatever we want.
 */
robert_the_lifter.GameField.prototype.switchPieceState = function(piece, newState, xMod, yMod) {
  if (typeof xMod == 'undefined') {
    xMod = 0;
  }
  if (typeof yMod == 'undefined') {
    yMod = 0;
  }
  
  for(var i in piece.blocks) {
    this.switchState(piece.blocks[i].x + xMod, piece.blocks[i].y + yMod, newState);
  }
}

robert_the_lifter.GameField.prototype.switchState = function (x, y, newState) {
  this.field[y][x] = newState;
  this.printField();
}




/**
 * DEBUG
 */
robert_the_lifter.GameField.prototype.printField = function() {
  if (document.getElementById('debug')) {
    var output = "";
    for(var i in this.field) {
      for(var j in this.field[i]) {
        
        var pad = "00";
        var n = this.field[i][j];
        var result = (pad+n).slice(-pad.length);
        var cssClass = "fill";
        
        if (this.field[i][j] == robert_the_lifter.GameField.NO_PIECE) {
          cssClass = "empty";
        } else if (this.field[i][j] == robert_the_lifter.GameField.ROBERT){
          cssClass = "robert";
        }
        
        output += "<span class='" + cssClass + "'>" + result + ", </span>";
      }
      output += "<br />";
    }

    document.getElementById('debug').innerHTML = output;
  }
}

robert_the_lifter.GameField.NO_PIECE = -1;
robert_the_lifter.GameField.ROBERT = -2;
robert_the_lifter.GameField.GROUND = "GROUND";
robert_the_lifter.GameField.GRABBED_PIECE = "GRABBED_PIECE";
robert_the_lifter.GameField.TEMP = -3;