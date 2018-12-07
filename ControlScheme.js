function ControlScheme(context){
    this.game = context;
    this.game.controls = this.game.input;
    this.moveUp;
    this.moveLeft;
    this.moveDown;
    this.moveRight;
    this.focusShot;
    this.shootA;
    this.shootB;
    
    this.switchShotLeft_A;
    this.switchShotLeft_B;
    this.switchShotRight_A;
    this.switchShotRight_B;    
    
    this.arrowControls;
}

ControlScheme.prototype.setup = function(){
    /* 
        Movement controls for both WASD and arrow control schemes.
    */
    this.game.controls.upKey = this.game.input.keyboard.addKey(87); 
    this.game.controls.downKey = this.game.input.keyboard.addKey(83);
    this.game.controls.leftKey = this.game.input.keyboard.addKey(65);
    this.game.controls.rightKey = this.game.input.keyboard.addKey(68);
    this.game.controls.shotKeyA = this.game.input.keyboard.addKey(74);
    this.game.controls.shotKeyB = this.game.input.keyboard.addKey(90);
    this.game.controls.bombKeyA = this.game.input.keyboard.addKey(88);
    this.game.controls.bombKeyB = this.game.input.keyboard.addKey(75);
    this.game.controls.focusKey = this.game.input.keyboard.addKey(16);
    this.game.arrowControls = this.game.input.keyboard.createCursorKeys();
    
    /*These are the keys to switch shot types.
        LeftA is [I]; RightA is [O]
        LeftB is [C]; RIghtB is [V]
    */
    this.game.controls.switchShotLeft_A = this.game.input.keyboard.addKey(73);
    this.game.controls.switchShotLeft_B = this.game.input.keyboard.addKey(67);
    this.game.controls.switchShotRight_A = this.game.input.keyboard.addKey(79);
    this.game.controls.switchShotRight_B = this.game.input.keyboard.addKey(86);
    
    /*
        These are the references contained in the Control Scheme object.
    */
    
    this.moveUp = this.game.controls.upKey;
    this.moveLeft = this.game.controls.leftKey;
    this.moveDown = this.game.controls.downKey;
    this.moveRight = this.game.controls.rightKey;
    this.focusShot = this.game.controls.focusKey;
    this.shootA = this.game.controls.shotKeyA;
    this.shootB = this.game.controls.shotKeyB;
    this.bombA = this.game.controls.bombKeyA;
    this.bombB = this.game.controls.bombKeyB;
    this.arrowControls = this.game.arrowControls;
    this.switchShotLeft_A = this.game.controls.switchShotLeft_A;
    this.switchShotLeft_B = this.game.controls.switchShotLeft_B;
    this.switchShotRight_A = this.game.controls.switchShotRight_A;
    this.switchShotRight_B = this.game.controls.switchShotRight_B; 
}


/*
    These are the functions that are called, in order to check for both of the control schemes.
*/

ControlScheme.prototype.isMoveUp = function(){
    if(this.moveUp.isDown || this.arrowControls.up.isDown){
       return true;
    }else{
        return false;
    }
}

ControlScheme.prototype.isMoveDown = function(){
    if(this.moveDown.isDown || this.arrowControls.down.isDown){
       return true;
    }else{
        return false;
    }
}

ControlScheme.prototype.isMoveLeft = function(){
    if(this.moveLeft.isDown || this.arrowControls.left.isDown){
       return true;
    }else{
        return false;
    }
}

ControlScheme.prototype.isMoveRight = function(){
    if(this.moveRight.isDown || this.arrowControls.right.isDown){
       return true;
    }else{
        return false;
    }
}

ControlScheme.prototype.isShooting = function(){
    if(this.shootA.isDown || this.shootB.isDown){
       return true;
    }else{
        return false;
    }
}

ControlScheme.prototype.isBombing = function(){
    if(this.bombA.isDown || this.bombB.isDown){
       return true;
    }else{
        return false;
    }
}

ControlScheme.prototype.isSwitchLeft = function(){
    if(Phaser.Input.Keyboard.JustDown(this.switchShotLeft_A) || Phaser.Input.Keyboard.JustDown(this.switchShotLeft_B)){
        return true;
    }else{
        return false;
    }
}

ControlScheme.prototype.isSwitchRight = function(){
    if(Phaser.Input.Keyboard.JustDown(this.switchShotRight_A) || Phaser.Input.Keyboard.JustDown(this.switchShotRight_B)){
       return true;
    }else{
        return false;
    }
}