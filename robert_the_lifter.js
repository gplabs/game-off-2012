//set main namespace
goog.provide('robert_the_lifter');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('robert_the_lifter.Robert');


robert_the_lifter.start = function() {
  var game = {
    width: 960,
    height: 640,
    tileWidth: 32,
    tileHeight: 32
  };
  game.leftParkingHeight = game.tileWidth*20;
  game.leftParkingWidth = game.tileHeight*10;
  game.leftParkingX = 0;
  game.leftParkingY = 0;
  
  game.factoryHeight = game.tileWidth*20;
  game.factoryWidth = game.tileHeight*10;
  game.factoryX = game.leftParkingWidth;
  game.factoryY = 0;
  
  var director = new lime.Director(document.body, game.width, game.height);
  
  // This will probably be the only scene of the game (beside a menu ?)
  var gameScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
  
  // The left parking layer
  var leftParkingLayer = new lime.Layer()
    .setAnchorPoint(0, 0)
  // Left parking area
  var leftParkingArea = new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(0, 0)
    .setSize(game.leftParkingWidth, game.leftParkingHeight)
    .setFill('#000');
  leftParkingLayer.appendChild(leftParkingArea);
  gameScene.appendChild(leftParkingLayer);  
  
  // The factory layer.
  var factoryLayer = new lime.Layer()
    .setAnchorPoint(0, 0);
  gameScene.appendChild(factoryLayer);
  
  // Init Robert :P
  var robert = new robert_the_lifter.Robert(game);
  factoryLayer.appendChild(robert);
  

//  var director = new lime.Director(document.body,1024,768),
//    scene = new lime.Scene(),
//
//    target = new lime.Layer().setPosition(512,384),
//    circle = new lime.Circle().setSize(150,150).setFill(255,150,0),
//    lbl = new lime.Label().setSize(160,50).setFontSize(30).setText('TOUCH ME!'),
//    title = new lime.Label().setSize(800,70).setFontSize(60).setText('Now move me around!')
//      .setOpacity(0).setPosition(512,80).setFontColor('#999').setFill(200,100,0,.1);
//
//
//  //add circle and label to target object
//  target.appendChild(circle);
//  target.appendChild(lbl);
//
//  //add target and title to the scene
//  scene.appendChild(target);
//  scene.appendChild(title);
//
//  director.makeMobileWebAppCapable();
//
//  //add some interaction
//  goog.events.listen(target,['mousedown','touchstart'],function(e){
//
//    //animate
//    target.runAction(new lime.animation.Spawn(
//      new lime.animation.FadeTo(.5).setDuration(.2),
//      new lime.animation.ScaleTo(1.5).setDuration(.8)
//    ));
//
//    title.runAction(new lime.animation.FadeTo(1));
//
//    //let target follow the mouse/finger
//    e.startDrag();
//
//    //listen for end event
//    e.swallow(['mouseup','touchend'],function(){
//      target.runAction(new lime.animation.Spawn(
//        new lime.animation.FadeTo(1),
//        new lime.animation.ScaleTo(1),
//        new lime.animation.MoveTo(512,384)
//      ));
//
//      title.runAction(new lime.animation.FadeTo(0));
//    });
//
//
//  });

  // set current scene active
  director.replaceScene(gameScene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('robert_the_lifter.start', robert_the_lifter.start);
