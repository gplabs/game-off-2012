//set main namespace
goog.provide('robert_the_lifter');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.GlossyButton');

//entrypoint
robert_the_lifter.start = function() {
  var gameObj = {
    width: 320,
    height: 480
  }

  var director = new lime.Director(document.body, gameObj.width, gameObj.height);
    director.makeMobileWebAppCapable();
    director.setDisplayFPS(false);

  var gameScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
  var landLayer = new lime.Layer().setAnchorPoint(0,0);
  var controlsLayer = new lime.Layer().setAnchorPoint(0,0);

  gameScene.appendChild(landLayer);
  gameScene.appendChild(controlsLayer);

  director.replaceScene(gameScene);
}



//Game object
var tile_size = 32;
var gameObj = {

  width: 320,
  height: 480,
  tile_size: tile_size,
  num_tiles_x: 8,
  num_tiles_y: 16,
  landLayer_w: tile_size*8,
  landLayer_h: tile_size*16,
  controlsLayer_w: tile_size*8,
  controlsLayer_h: tile_size*1.5,

  //shop
  shop_margin_x: 50,
  shop_margin_y: 20
  }

//player object
var playerObj = {
  money: 300,
  currentCrop: 0
}

//controls area
var controlArea = new lime.Sprite().setAnchorPoint(0,0).setPosition(0, gameObj.height-gameObj.controlsLayer_h).setSize(gameObj.controlsLayer_w, gameObj.controlsLayer_h).setFill('#0d0d0d').controlsLayer.appendChild(controlArea);

//shop button
