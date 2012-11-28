/**
 * In this file, we define base configs of the game and some helper functions.
 */

goog.provide('robert_the_lifter.Game');

goog.require('robert_the_lifter.Foreman');
goog.require('robert_the_lifter.PauseMenu');

robert_the_lifter.Game = function() {
  this.debug = true;
  
  // Initialize the pieces history with some default values.
  this.piecesHistory = [
    robert_the_lifter.Piece.S,
    robert_the_lifter.Piece.Z,
    robert_the_lifter.Piece.S,
    robert_the_lifter.Piece.Z
  ]
  
  this.tileWidth = 64;
  this.tileHeight = 64;
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
  this.factoryLayer.appendChild(this.score.lbl);
  
  this.oil = new robert_the_lifter.Oil(this);
  this.pauseMenu = new robert_the_lifter.PauseMenu(this);
  this.factoryLayer.appendChild(this.robert);
  this.switchPieceState(this.robert, this.robert.id);
  
  // Init the foreman
  this.foreman = new robert_the_lifter.Foreman(this);
  
  var lastGrabTime = 0;
  
  // Register to keyboard event for Robert to grab a piece.
  var game = this;
  this.grabEvent = function (ev) {
    var isTooFast = new Date().getTime() - lastGrabTime <= 100;
    console.log("Robert wanna grab something ");
    if (!isTooFast && !game.isPaused) {
      if (!game.robert.hasPiece) {
        var x = game.robert.x,
            y = game.robert.y,
            rotation = game.robert.getRotation();
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
        var pieceId = game.field[y][x];
        if (pieceId != robert_the_lifter.Game.NO_PIECE) {
          game.pieces[pieceId].state = robert_the_lifter.Piece.GRABBED;
          game.robert.grabbedPiece = game.pieces[pieceId];
          game.robert.hasPiece = true;
          console.log("Robert just grabbed piece no " + pieceId);
        }
      } else {
        console.log("Robert just released piece no " + game.robert.grabbedPiece.id);
        game.robert.grabbedPiece.state = robert_the_lifter.Piece.GETTING_PUSHED;
        game.robert.grabbedPiece = null;
        game.robert.hasPiece = false;
      }
    }
    
    lastGrabTime = new Date().getTime();
  }
  
  // Start spawning pieces.
  var stopSpawning = false;
  this.timeToNextSpawning = 0;
  this.pieces = [];
  this.spawningPieceLoop = function(number) {
    if (!this.isPaused && !stopSpawning) {
      this.timeToNextSpawning -= number;
      if (this.timeToNextSpawning <= 0) {
        this.timeToNextSpawning += this.getSpawningSpeed();
        this.addPiece();
      }
    }
  }
  lime.scheduleManager.schedule(this.spawningPieceLoop, this);
  
  // Debug event to stop spawning pieces.
  this.stopSpawningEvent = function() {
    stopSpawning = !stopSpawning;
  }
  
  this.initDebugOptions();
  this.bindKeys("left", "right", "up", "down", "space");  
}

robert_the_lifter.Game.prototype.bindKeys = function (turnLeft, turnRight, forward, backward, grab) {
  KeyboardJS.on("q", this.stopSpawningEvent);
  
  // Remove previous bindings
  if (typeof this.grabKey !== 'undefined') {
    KeyboardJS.clear(this.grabKey);
    KeyboardJS.clear(this.turnRightKey);
    KeyboardJS.clear(this.turnLeftKey);
    KeyboardJS.clear(this.backwardKey);
    KeyboardJS.clear(this.forwardKey);
  }
  
  this.grabKey = grab.toLowerCase();
  this.turnRightKey = turnRight.toLowerCase();
  this.turnLeftKey = turnLeft.toLowerCase();
  this.backwardKey = backward.toLowerCase();
  this.forwardKey = forward.toLowerCase();
  
  KeyboardJS.on(this.grabKey, this.grabEvent);
  KeyboardJS.on(this.turnRightKey, this.robert.rightEvent, this.robert.rightEvent);
  KeyboardJS.on(this.turnLeftKey, this.robert.leftEvent, this.robert.leftEvent);
  KeyboardJS.on(this.backwardKey, this.robert.backwardEvent, this.robert.backwardEvent);
  KeyboardJS.on(this.forwardKey, this.robert.forwardEvent, this.robert.forwardEvent);
}

/**
 * Stop the game.
 */
robert_the_lifter.Game.prototype.stop = function() {
  lime.scheduleManager.unschedule(this.spawningPieceLoop, this);
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
    
  var newPieceCoords = piece.getNewPieceCoordinates(this.piecesHistory, (id === 0));
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
  
  this.piecesHistory.push(piece.type);
  if (this.piecesHistory.length > 6) {
    this.piecesHistory.splice(0, 1);
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
  var piecesToSplit = [];
  this.linesProcessing = []; // Those are lines to ignore, because we are clearing them already.
  var linesToClear = [];
  
  for(var x = 0; x < this.factoryNbTileWidth; x ++) {
    if (this.linesProcessing.indexOf(x) == -1) {
      var lineFull = true;

      // If we find something that is not a blocked piece, the line isn't full.
      for(var y = 0; y < this.factoryNbTileHeight && lineFull; y ++) {
        var id = this.field[y][x];
        if (id == robert_the_lifter.Game.ROBERT || id == robert_the_lifter.Game.NO_PIECE || (id > robert_the_lifter.Game.NO_PIECE && this.pieces[id].state != robert_the_lifter.Piece.BLOCKED)) {
          lineFull = false;
        }
      }

      if (lineFull) {
        this.linesProcessing.push(x);
        linesToClear.push(x);
      }
    }
  }
  
  if (linesToClear.length > 0) {
    console.log(linesToClear.length + " lines are full (" + linesToClear.toString() + ")");
  }
  
  for(var k in linesToClear) {
    var xLine = linesToClear[k];
    console.log("Clearing line " + xLine + ".");
    
    var squareRemaining = this.factoryNbTileHeight;
    for(var i = 0; i < this.pieces.length && squareRemaining > 0; i ++) {
      for(var j = this.pieces[i].blocks.length - 1; j >= 0  && squareRemaining > 0; j --) {
        var block = this.pieces[i].blocks[j];
        if (block.x == xLine) {
          squareRemaining--;
          this.switchState(block.x, block.y, robert_the_lifter.Game.NO_PIECE);

          // Remove the crate from the game.
          console.log("Line " + xLine + ": " + squareRemaining + " more to go.");
          this.pieces[i].removeBlock(j);
          if (piecesToSplit.indexOf(this.pieces[i]) === -1) {
            piecesToSplit.push(this.pieces[i]);
          }
        }
      }
    }
    
    this.linesProcessing.splice(this.linesProcessing.indexOf(x), 1);
    
//    this.linesProcessing
  }
  
  for (var k in piecesToSplit) {
    piecesToSplit[k].split();
  }
  
  switch(linesToClear.length) {
    case 1:
      var nbPoints = this.score.pointsPerLine;
      this.score.addPointsAndDisplayScore(nbPoints, this.score, this.factoryLayer);
      break;
    case 2:
      nbPoints = this.score.pointsPerLine*2 + this.score.pointsPerLine/2;
      this.score.addPointsAndDisplayScore(nbPoints, this.score, this.factoryLayer);
      break;
    case 3:
      nbPoints = this.score.pointsPerLine*3 + this.score.pointsPerLine;
      this.score.addPointsAndDisplayScore(nbPoints, this.score, this.factoryLayer);
      break;
    case 4:
      nbPoints = this.score.pointsPerLine*4 + this.score.pointsPerLine*2;
      this.score.addPointsAndDisplayScore(nbPoints, this.score, this.factoryLayer);
      break;
  }
}

robert_the_lifter.Game.prototype.initDebugOptions = function() {
  if (document.getElementById('debug_options')) {
    document.getElementById('pieces_speed').value = robert_the_lifter.Game.DEFAULT_PIECE_SPEED;
    document.getElementById('spawning_speed').value = robert_the_lifter.Game.DEFAULT_SPAWNING_SPEED;
    document.getElementById('lift_speed').value = robert_the_lifter.Game.DEFAULT_ROBERT_SPEED;
  }
}

robert_the_lifter.Game.prototype.getRobertSpeed = function() {
  if (document.getElementById('debug_options')) {
    return parseInt(document.getElementById('lift_speed').value);
  }else {
    return robert_the_lifter.Game.DEFAULT_ROBERT_SPEED;
  }
}

robert_the_lifter.Game.prototype.getPieceSpeed = function() {
  if (document.getElementById('debug_options')) {
    return parseInt(document.getElementById('pieces_speed').value);
  }else {
    return robert_the_lifter.Game.DEFAULT_PIECE_SPEED;
  }
}

robert_the_lifter.Game.prototype.getSpawningSpeed = function() {
  if (document.getElementById('debug_options')) {
    return parseInt(document.getElementById('spawning_speed').value);
  }else {
    return robert_the_lifter.Game.DEFAULT_SPAWNING_SPEED;
  }
}

robert_the_lifter.Game.NO_PIECE = -1;
robert_the_lifter.Game.ROBERT = -2;
robert_the_lifter.Game.GROUND = "GROUND";
robert_the_lifter.Game.GRABBED_PIECE = "GRABBED_PIECE";

robert_the_lifter.Game.DEFAULT_PIECE_SPEED = 1000;
robert_the_lifter.Game.DEFAULT_SPAWNING_SPEED = 8000;
robert_the_lifter.Game.DEFAULT_ROBERT_SPEED = 250;




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