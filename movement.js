goog.provide('robert_the_lifter.Movement');

function setSpeed(robert, keyCode, speed) {
    var actual_rotation = robert.getRotation();
    if(actual_rotation <=0) {
          actual_rotation=360;
        }

    switch (keyCode) {
      case 40: // Down
          moveTo(actual_rotation/90, keyCode, robert);
        break;
      case 39: // Right
        robert.setRotation(actual_rotation-90);
        break;
      case 38: // Up
          moveTo(actual_rotation/90, keyCode, robert);          
        break;
      case 37: // Left
        robert.setRotation(actual_rotation+90);
        break;
    }
  }
  
  function moveTo(rotation, keyCode, robert) {
    var movement_value = 64;
    var actual_position = robert.getPosition();
    robert.pointing = rotation;
    
    switch(rotation) {  
      case 1:
        keyCode == 38  
          ?  robert.setPosition(actual_position.x - movement_value, actual_position.y)    
          : robert.setPosition(actual_position.x + movement_value, actual_position.y);
        break;
      
      case 2:
        keyCode == 38 
          ? robert.setPosition(actual_position.x, actual_position.y + movement_value) 
          : robert.setPosition(actual_position.x, actual_position.y - movement_value);
        break;
      
      case 3:
        keyCode == 38 
          ? robert.setPosition(actual_position.x + movement_value, actual_position.y) 
          : robert.setPosition(actual_position.x - movement_value, actual_position.y);
        break;   
        
        case 4:
        keyCode == 38 
          ? robert.setPosition(actual_position.x, actual_position.y - movement_value) 
          : robert.setPosition(actual_position.x, actual_position.y + movement_value);
        break;  
    }
  }