/**
 * In this file, we define base configs of the game and some helper functions.
 */

goog.provide('robert_the_lifter.Game');

goog.require('robert_the_lifter.Foreman');

robert_the_lifter.Game = function() {
  this.debug = true;
  
  this.tileWidth = 64;
  this.tileHeight = 64;
  this.spawningSpeed = 8000;
  this.pieces = [];
  
  this.truckParkingHeight = this.tileHeight*2 + 10; // 10 pixels for wall.
  this.truckParkingWidth = this.tileWidth*20;
  this.truckParkingX = 0;
  this.truckParkingY = 0;
  
  this.factoryNbTileWidth = 20;
  this.factoryNbTileHeight = 10;
  
  this.factoryHeight = this.tileHeight*this.factoryNbTileHeight;
  this.factoryWidth = this.tileWidth*this.factoryNbTileWidth;
  this.factoryX = 0;
  this.factoryY = this.truckParkingHeight;
  
  this.officeAreaHeight = this.tileHeight*2;
  this.officeAreaWidth = this.tileWidth*20;
  
  this.height = this.truckParkingHeight + this.factoryHeight + this.officeAreaHeight;
  this.width = this.tileWidth * 24;
  
  // fill the entire field with -1s
  this.field = [];
  for(var i = 0; i <= this.factoryNbTileHeight - 1; i++) {
    this.field[i] = [];
    for(var j = 0; j <= this.factoryNbTileWidth - 1; j++) {
      this.field[i][j] = robert_the_lifter.Game.NO_PIECE;
    }
  }
}

robert_the_lifter.Game.prototype.start = function() {
  this.robert = new robert_the_lifter.Robert(this);
  this.score = new robert_the_lifter.Score(this.factoryLayer);
  this.oil = new robert_the_lifter.Oil(this);
  this.factoryLayer.appendChild(this.robert);
  this.switchPieceState(this.robert, this.robert.id);
  
  // Init the foreman
  this.foreman = new robert_the_lifter.Foreman(this);
  
  // Register to keyboard event for Robert to grab a piece.
  this.robertGrabPieceListener = goog.events.listen(this.robert, goog.events.EventType.KEYDOWN, function (ev) {
    if (ev.event.keyCode == 32) { // 32 = spacebar.
      if (!this.hasPiece) {
        var x = this.x,
            y = this.y,
            rotation = this.getRotation();
        switch(rotation) {
          case 180: //Pointing down !
            y += 1;
            break;
          case 0: // Pointing up !
            y -= 1;
            break;
          case 90: // Pointing left !
            x -= 1;
            break;
          case 270: // Pointing right !
            x += 1;
            break;
        }
        var pieceId = this.game.field[y][x];
        if (pieceId != robert_the_lifter.Game.NO_PIECE) {
          this.game.pieces[pieceId].state = robert_the_lifter.Piece.GRABBED;
          this.game.robert.grabbedPiece = this.game.pieces[pieceId];
          this.game.robert.hasPiece = true;
        }
        
      } else {
        this.grabbedPiece.state = robert_the_lifter.Piece.GETTING_PUSHED;
        this.grabbedPiece = null;
        this.hasPiece = false;
      }
    }
  });
  
  // Start spawning pieces.
  var stopSpawning = false;
  this.timeToNextSpawning = 0;
  this.pieces = [];
  this.spawningPieceLoop = function(number) {
    if (!robert_the_lifter.Director.isPaused && !stopSpawning) {
      this.timeToNextSpawning -= number;
      if (this.timeToNextSpawning <= 0) {
        this.timeToNextSpawning += this.spawningSpeed;
        this.addPiece();
      }
    }
  }
  lime.scheduleManager.schedule(this.spawningPieceLoop, this);
  
  // Debug event to stop spawning pieces.
  this.stopSpawningListener = goog.events.listen(robert_the_lifter.Director, goog.events.EventType.KEYDOWN, function (ev) {
    if (ev.event.keyCode == 81) {
      stopSpawning = !stopSpawning;
    }
  });
}

/**
 * Stop the game.
 */
robert_the_lifter.Game.prototype.stop = function() {
  lime.scheduleManager.unschedule(this.spawningPieceLoop, this);
  goog.events.unlistenByKey(this.robertGrabPieceListener);
  goog.events.unlistenByKey(this.stopSpawningListener);
  this.robert.stop();
  this.foreman.stop();
  robert_the_lifter.endGame();
}

/**
 * Add a new piece in the game.
 */
robert_the_lifter.Game.prototype.addPiece = function() {
  var id = this.pieces.length;
  var piece = new robert_the_lifter.Piece(this, id);
  
  this.factoryLayer.removeChild(this.score.lbl);
  var actual_score = this.score.getScore();
  this.score.setScore(actual_score - 40);
  this.factoryLayer.appendChild(this.score.lbl);
  
  var newPieceCoords = piece.getNewPieceCoordinates();
  // If there is something where the new piece should be, the game ends.
  var gameStop = false;
  for(var i in newPieceCoords) {
    var fieldstate = this.field[newPieceCoords[i].y][newPieceCoords[i].x];
    if (typeof fieldstate != 'undefined' && fieldstate != robert_the_lifter.Game.NO_PIECE) {
      gameStop = true;
    }
  }
  
  piece.initSpawningPiece(newPieceCoords);
  
  // If the game is stopped, we must not change state.
  if (gameStop) {
    this.stop();
  } else {
    this.switchPieceState(piece, id);
  }
  
  piece.appendTo(this.factoryLayer);
  this.pieces[id] = piece;
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
robert_the_lifter.Game.prototype.whatBlocksPiece = function(piece) {
  // Recursively check what blocks the piece.
  // If robert if found, we keep it and continue.
  // If Robert's grabbed piece is found, we keep it and continu
  // As soon as the GROUND is found, we stop and return it.
  var blocking = robert_the_lifter.Game.NO_PIECE;
  for(var i = 0;i < piece.blocks.length && blocking !== robert_the_lifter.Game.GROUND;i ++) {
    var newX = piece.blocks[i].x - 1,
        newY = piece.blocks[i].y;
    
    // Check if the block has reached the 'ground'
    if (newX < 0) {
      blocking = robert_the_lifter.Game.GROUND;
    } else {
      var state = this.field[newY][newX];
      if  (typeof state != 'undefined' && state !== robert_the_lifter.Game.NO_PIECE) {
        if (state === this.robert.id) {
          blocking = robert_the_lifter.Game.ROBERT;
        } else if (this.robert.hasPiece && state === this.robert.grabbedPiece.id) {
          blocking = robert_the_lifter.Game.GRABBED_PIECE;
        } else if (state != piece.id) {
          blocking = this.whatBlocksPiece(this.pieces[state]);
        }
      }
    }
  }
  
  return blocking;
}

/**
 * Check if the coords are inside the field.
 */
robert_the_lifter.Game.prototype.isInside = function(x, y) {
  return x >= 0 && x < this.factoryNbTileWidth &&
         y >= 0 && y < this.factoryNbTileHeight;
}

/**
 * Check if there is something at given coords.
 */
robert_the_lifter.Game.prototype.containsSomething = function(x, y) {
  return (this.field[y][x] !== robert_the_lifter.Game.NO_PIECE);
}

/**
 * Check if the given coords contains another piece that is not the piece given.
 */
robert_the_lifter.Game.prototype.containsAnotherPiece = function(x, y, key) {
  return (this.field[y][x] !== robert_the_lifter.Game.NO_PIECE &&
          this.field[y][x] !== robert_the_lifter.Game.ROBERT &&
          this.field[y][x] !== key);
}

/**
 * Push the piece to the left.
 */
robert_the_lifter.Game.prototype.push = function(piece) {
  piece.move(-1, 0); // move the piece left.
}

/**
 * Change the state of the location of the piece in the field to whatever we want.
 */
robert_the_lifter.Game.prototype.switchPieceState = function(piece, newState, xMod, yMod) {
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

robert_the_lifter.Game.prototype.switchState = function (x, y, newState) {
  this.field[y][x] = newState;
  this.printField();
}

/**
 * Check each line and clear the full ones.
 */
robert_the_lifter.Game.prototype.checkAndClearLine = function() {
  for(var x = 0; x < this.factoryNbTileWidth; x ++) {
    var lineFull = true;
    
    // If we find something that is not a blocked piece, the line isn't full.
    for(var y = 0; y < this.factoryNbTileHeight && lineFull; y ++) {
      var id = this.field[y][x];
      if (id == robert_the_lifter.Game.ROBERT || id == robert_the_lifter.Game.NO_PIECE || (id > robert_the_lifter.Game.NO_PIECE && this.pieces[id].state != robert_the_lifter.Piece.BLOCKED)) {
        lineFull = false;
      }
    }
    
    if (lineFull) {
      
      this.factoryLayer.removeChild(this.score.lbl);
      var actual_score = this.score.getScore();
      this.score.setScore(actual_score + 300);
      this.factoryLayer.appendChild(this.score.lbl);

      var squareRemaining = this.factoryNbTileHeight;
      var piecesToSplit = [];
      for(var i = 0; i < this.pieces.length && squareRemaining > 0; i ++) {
        for(var j = this.pieces[i].blocks.length - 1; j >= 0  && squareRemaining > 0; j --) {
          var block = this.pieces[i].blocks[j];
          if (block.x == x) {
            squareRemaining--;
            this.switchState(block.x, block.y, robert_the_lifter.Game.NO_PIECE);
            
            // Remove the crate form the game.
            this.pieces[i].removeBlock(j);
            if (piecesToSplit.indexOf(this.pieces[i]) === -1) {
              piecesToSplit.push(this.pieces[i]);
            }
          }
        }
      }
      
      for (var k in piecesToSplit) {
        piecesToSplit[k].split();
      }
      
    }
  }
}

robert_the_lifter.Game.NO_PIECE = -1;
robert_the_lifter.Game.ROBERT = -2;
robert_the_lifter.Game.GROUND = "GROUND";
robert_the_lifter.Game.GRABBED_PIECE = "GRABBED_PIECE";






robert_the_lifter.Game.prototype.printField = function() {
  if (document.getElementById('debug') && this.debug) {
    var output = "";
    for(var i in this.field) {
      for(var j in this.field[i]) {
        
        var pad = "00";
        var n = this.field[i][j];
        var result = (pad+n).slice(-pad.length);
        var cssClass = "fill";
        
        if (this.field[i][j] == robert_the_lifter.Game.NO_PIECE) {
          cssClass = "empty";
        } else if (this.field[i][j] == robert_the_lifter.Game.ROBERT){
          cssClass = "robert";
        }
        
        output += "<span class='" + cssClass + "'>" + result + ", </span>";
      }
      output += "<br />";
    }

    document.getElementById('debug').innerHTML = output;
  }
}