/**
 * In this file, we define base configs of the game and some helper functions.
 */

goog.provide('robert_the_lifter.Game');

robert_the_lifter.Game = function() {
  this.tileWidth = 64,
  this.tileHeight = 64,
  this.spawningSpeed = 8000,
  this.pieces = []
  this.piecesBlock = new robert_the_lifter.PiecesBlock(this);
  
  this.truckParkingHeight = this.tileHeight*5;
  this.truckParkingWidth = this.tileWidth*20;
  this.truckParkingX = 0;
  this.truckParkingY = 0;
  
  this.factoryHeight = this.tileWidth*10;
  this.factoryWidth = this.tileHeight*20;
  this.factoryX = 0;
  this.factoryY = this.truckParkingHeight;
  
  this.officeAreaHeight = this.tileHeight*2;
  this.officeAreaWidth = this.tileWidth*20;
  
  this.height = this.truckParkingHeight + this.factoryHeight + this.officeAreaHeight;
  this.width = this.tileWidth * 24;
}

/**
 * Check if something can be places at given coords.
 * 
 * Check wether it's ousite the factory or if there is anything else at given location.
 * 
 * The key is used in case of a crate, so that it doesn't compare to itself.
 */
robert_the_lifter.Game.prototype.canBePlace = function(x ,y, key, considerRobert) {
  var canPlace = true;
  
  // check if the location is out of the factory.
  if (x < this.factoryX || x > this.factoryX + this.factoryWidth ||
      y < this.factoryY || y > this.factoryY + this.factoryHeight) {
    canPlace = false;
  }
  
  // check if there is a square at location.
  for (var i = 0; i < this.pieces.length && canPlace; i++) {
    if (this.pieces[i].key != key) { // Must not compare to myself.
      for (var j = 0; j < this.pieces[i].squares.length && canPlace; j++) {
        var otherPos = this.pieces[i].squares[j].getPosition();
        if (x == otherPos.x && y == otherPos.y) {
          canPlace = false;
        }
      }
    }
  }
  
  // Check if robert is there !
  if (canPlace && considerRobert) {
    var robertPos = this.robert.getPosition();
    if (x == robertPos.x && y == robertPos.y) {
      canPlace = false;
    }
  }
  return canPlace;
}