goog.provide('robert_the_lifter.Movement');

function setSpeed(robert, keyCode, speed) {
    var actual_rotation = robert.getRotation();
    
    switch (keyCode) {
      case 40: // Down
          moveTo(actual_rotation/15, keyCode, robert);
//        robert.downSpeed = speed;
//        robert.pointing = robert.POINTING_DOWN;
        break;
      case 39: // Right
        if(actual_rotation <=0) {
          actual_rotation=360;
        }
        robert.setRotation(actual_rotation-15);
//        robert.rightSpeed = speed;
//        robert.pointing = robert.POINTING_RIGHT;
        break;
      case 38: // Up
          moveTo(actual_rotation/15, keyCode, robert);          
   //     robert.upSpeed = speed;
//        robert.pointing = robert.POINTING_UP;
        break;
      case 37: // Left
        if(actual_rotation <=0) {
          actual_rotation=360;
        }
        robert.setRotation(actual_rotation+15);
//        robert.leftSpeed = speed;
//        robert.pointing = robert.POINTING_LEFT;
        break;
    }
  }
  
  function moveTo(rotation, keyCode, robert) {
    //alert(rotation);
    var movement_value = 10;
    var actual_position = robert.getPosition();
    switch(rotation) {
      
      case 0:
        keyCode == 38 ? robert.setPosition(actual_position.x, actual_position.y-movement_value) : robert.setPosition(actual_position.x, actual_position.y+movement_value);
        break;
      
      case 1:
        keyCode == 38 ? robert.setPosition(actual_position.x-movement_value*0.33, actual_position.y-movement_value) : robert.setPosition(actual_position.x+movement_value*0.33, actual_position.y);
        break;
      
      case 2:
        keyCode == 38 ? robert.setPosition(actual_position.x-movement_value*0.66, actual_position.y-movement_value) : robert.setPosition(actual_position.x+movement_value*0.66, actual_position.y+movement_value);
        break;
      
      case 3:
        keyCode == 38 ? robert.setPosition(actual_position.x-movement_value, actual_position.y-movement_value) : robert.setPosition(actual_position.x+movement_value, actual_position.y+movement_value);
        break;
      
      case 4:
        keyCode == 38 ? robert.setPosition(actual_position.x-movement_value, actual_position.y-movement_value*0.66) : robert.setPosition(actual_position.x+movement_value, actual_position.y+movement_value*0.66);
        break;
      
      case 5:
        keyCode == 38 ? robert.setPosition(actual_position.x-movement_value, actual_position.y-movement_value*0.33) : robert.setPosition(actual_position.x+movement_value, actual_position.y+movement_value*0.33);
        break;
      
      case 6:
        keyCode == 38 ? robert.setPosition(actual_position.x-movement_value, actual_position.y) : robert.setPosition(actual_position.x+movement_value, actual_position.y);
        break;
    
      case 7:
        keyCode == 38 ? robert.setPosition(actual_position.x-movement_value, actual_position.y+movement_value*0.33) : robert.setPosition(actual_position.x+movement_value, actual_position.y-movement_value*0.33);
        break;

      case 8:
        keyCode == 38 ? robert.setPosition(actual_position.x-movement_value, actual_position.y+movement_value*0.66) : robert.setPosition(actual_position.x+movement_value, actual_position.y-movement_value*0.66);
        break;
        
      case 9:
       keyCode == 38 ? robert.setPosition(actual_position.x-movement_value, actual_position.y+movement_value) : robert.setPosition(actual_position.x+movement_value, actual_position.y-movement_value);
       break; 
       
      case 10:
       keyCode == 38 ? robert.setPosition(actual_position.x-movement_value*0.66, actual_position.y+movement_value) : robert.setPosition(actual_position.x+movement_value*0.66, actual_position.y-movement_value);
       break; 
       
       case 11:
       keyCode == 38 ? robert.setPosition(actual_position.x-movement_value*0.33, actual_position.y+movement_value) : robert.setPosition(actual_position.x+movement_value*0.33, actual_position.y-movement_value);
       break;
       
       case 12:
       keyCode == 38 ? robert.setPosition(actual_position.x, actual_position.y+movement_value) : robert.setPosition(actual_position.x, actual_position.y-movement_value);
       break;
       
       case 13:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value*0.33, actual_position.y+movement_value) : robert.setPosition(actual_position.x-movement_value*0.33, actual_position.y-movement_value);
       break;
       
       case 14:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value*0.66, actual_position.y+movement_value) : robert.setPosition(actual_position.x-movement_value*0.66, actual_position.y-movement_value);
       break;
       
       case 15:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value, actual_position.y+movement_value) : robert.setPosition(actual_position.x-movement_value, actual_position.y-movement_value);
       break;
       
       case 16:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value, actual_position.y+movement_value*0.66) : robert.setPosition(actual_position.x-movement_value, actual_position.y-movement_value*0.66);
       break;
       
       case 17:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value, actual_position.y+movement_value*0.33) : robert.setPosition(actual_position.x-movement_value, actual_position.y-movement_value*0.33);
       break;
       
       case 18:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value, actual_position.y) : robert.setPosition(actual_position.x-movement_value, actual_position.y);
       break;
       
       case 19:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value, actual_position.y-movement_value*0.33) : robert.setPosition(actual_position.x-movement_value, actual_position.y+movement_value*0.33);
       break;
       
       case 20:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value, actual_position.y-movement_value*0.66) : robert.setPosition(actual_position.x-movement_value, actual_position.y+movement_value*0.66);
       break;
       
       case 21:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value, actual_position.y-movement_value) : robert.setPosition(actual_position.x-movement_value, actual_position.y+movement_value);
       break;
       
       case 22:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value*0.33, actual_position.y-movement_value) : robert.setPosition(actual_position.x-movement_value*0.33, actual_position.y+movement_value);
       break;
       
       case 23:
       keyCode == 38 ? robert.setPosition(actual_position.x+movement_value*0.66, actual_position.y-movement_value) : robert.setPosition(actual_position.x-movement_value*0.66, actual_position.y+movement_value);
       break;  
    }
    
  }