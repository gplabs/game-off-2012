goog.provide('robert_the_lifter.Oil');

robert_the_lifter.Oil = function(game) {
    
 
}

robert_the_lifter.Oil.prototype.dropOil = function(game) {
  var drop_chance = Math.floor((Math.random()*10));
  var oil_dropped = drop_chance == 0 ? true : false;
  
  if (oil_dropped) {
    var position_robert = game.robert.getPosition();
    var oil_tile = new lime.fill.Frame('images/oil.png', 27, 0, 64, 64);
    this.img = new lime.Sprite()
      .setAnchorPoint(0, 0)
      .setSize(game.tileWidth, game.tileHeight)
      .setFill(oil_tile).setPosition(position_robert.x-game.tileWidth/2, position_robert.y-game.tileHeight/2);

    game.factoryLayer.appendChild(game.oil.img);
  }
}