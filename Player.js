function Player(context, initLives, initHealth, initSpells, spriteID, bulletTypes = null){ //The player object, self-explanatory.
    this.game = context;
    this.lives = initLives; //An unused variable for life, made obsolete by the counter object.
    this.maxHealth = initHealth; //Never implemented health bars, so this is cut.
    this.curHealth = this.maxHealth; //Again, unused, since the Counter object reigns jurisdiction over tracking life.
    this.curSpells = initSpells; //How many bombs does the player start with?
    this.isFocused = false; //Is the player focused?
    this.isInvince = false; //Is the player invincible?
    this.spriteID = spriteID;
    this.phaserObject = null; //The phaser object for the player.
    this.controls = null;
    this.bulletTypes = []; //All of the attack types that the player can switch between.
    for(var i = 0; i < bulletTypes.length; i += 1){
        this.bulletTypes.push(bulletTypes[i]);
    }
    this.bulletTypes.curBulletType = 1; //The current attack type that the player is using.
    this.isCooldown = false;
    this.bombCooldown = false;
    this.phaserGroup_Bullets; //A Phaser group containing the player's bullets.
    this.phaserObject_hitbox; //The phaser object for the player's hitbox. This is meant for a sprite to make the hitbox visible when the player is focused.
}

Player.prototype.setup = function(){
    this.phaserObject = this.game.physics.add.sprite(360, 452, this.spriteID); //Create the player phaser object.
    if(this.controls == null){
        this.setup_Controls();
    }
    this.setup_BulletGroup(); //Calls a function to actually create the phaser group for the bullets.
    this.phaserObject.object = this; //This is so this object's data can be called/used through the phaserObject if scope becomes an issue.
    this.setup_Hitbox(); //Setup the hitbox sprite.
}

Player.prototype.setup = function(locX, locY){ //This is the same function as before, but the user is able to spawn the player up in any location.
    this.phaserObject = this.game.physics.add.sprite(locX, locY, this.spriteID);
    this.phaserObject.setSize(10, 10, true);
    if(this.controls == null){
        this.setup_Controls();
    }
    this.setup_BulletGroup();
    this.phaserObject.object = this;
    this.phaserObject.object = this;
    this.setup_Hitbox();
}

Player.prototype.setup_Hitbox = function(){
    this.phaserObject_hitbox = this.game.physics.add.sprite(this.phaserObject.x, this.phaserObject.y, 'hitbox');
    this.phaserObject_hitbox.alpha = 0;
}

Player.prototype.update_Hitbox = function(){ //This function is responsible for having the visible hitbox move with the player.
    this.phaserObject_hitbox.x = this.phaserObject.x;
    this.phaserObject_hitbox.y = this.phaserObject.y;
}

Player.prototype.setup_BulletGroup = function(){
    this.phaserGroup_Bullets = this.game.add.group();
}

Player.prototype.setup_Controls = function(){ //Set up the player controls.
    this.controls = new ControlScheme(this.game);
    this.controls.setup();
}

Player.prototype.update = function(){ //The update loop for the player
    this.movement(); //Calls the function checking to see if the  player is trying to move around.
    if(Phaser.Input.Keyboard.JustDown(this.controls.focusShot)){ //Checks to see if the player wants to slow/focus the character.
        this.toggleFocus();   
    }else if(this.isFocused && !this.controls.focusShot.isDown){
        this.toggleFocus();
    }
    if(this.controls.isShooting()){ //Is the player shooting?
        this.shoot(); //If so, shoot.
    }
    if(this.controls.isBombing()){ //Is the player attempting to use a bomb?
       this.useBomb();// If so, do so.
    }
    if(this.controls.isSwitchLeft()){ //This is to switch between weapon types, this checks to see if the corresponding buttons are being pressed.
        this.switchShot("left");
    }else if(this.controls.isSwitchRight()){
        this.switchShot("right");     
    }
    this.game.gameUI.score.changeScore(1); //As long as the player is alive, keep the score ticking upwards.
    this.update_Hitbox(); //Make sure the hitbox sprite is moving with the player.
}

Player.prototype.movement = function(){
    if(!this.isFocused){ //Is the player not focused? If so have the player move at a regular movement speed.
        if(this.controls.isMoveUp()){
            this.phaserObject.setVelocityY(-300);
        }else if(this.controls.isMoveDown()){
            this.phaserObject.setVelocityY(300);   
        }else{
            this.phaserObject.setVelocityY(0);
        }
        if(this.controls.isMoveLeft()){
            this.phaserObject.setVelocityX(-300);
        }else if(this.controls.isMoveRight()){
            this.phaserObject.setVelocityX(300);
        }else{
            this.phaserObject.setVelocityX(0);
        }
    }else if(this.isFocused){ //If the player is focused, then slow the player's speed down.
        if(this.controls.isMoveUp()){
            this.phaserObject.setVelocityY(-100);
        }else if(this.controls.isMoveDown()){
            this.phaserObject.setVelocityY(100);   
        }else{
            this.phaserObject.setVelocityY(0);
        }
        if(this.controls.isMoveLeft()){
            this.phaserObject.setVelocityX(-100);
        }else if(this.controls.isMoveRight()){
            this.phaserObject.setVelocityX(100);
        }else{
            this.phaserObject.setVelocityX(0);
        }
    }
    if(!(this.controls.isMoveUp() || this.controls.isMoveDown() || this.controls.isMoveLeft() || this.controls.isMoveRight())){ //If no keys are pressed, then have the player stop moving.
        this.phaserObject.setVelocityX(0);
        this.phaserObject.setVelocityY(0);
    }
}

Player.prototype.shoot = function(){ //This function is in charge of creating the player's attacks depending on what attack type they're currently equipped with.
    if(!this.isCooldown){ //If the player isn't on cooldown for their attack, then create the attack. This is to avoid having an attack for every frame.
        this.game.sfx_attack.play();
        this.toggleCooldown();
        if(this.bulletTypes[this.bulletTypes.curBulletType].bulletType === "shot_basic"){
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType, 0, 0);
            newBullet.create(this.phaserGroup_Bullets);
            newBullet.phaserObject.depth = 0;
            newBullet.phaserObject.alpha = 0.85;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
        }else if(this.bulletTypes[this.bulletTypes.curBulletType].bulletType === "shot_pierce"){
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType, -10, 0);
            newBullet.create(this.phaserGroup_Bullets);
            newBullet.phaserObject.depth = 0;
            newBullet.phaserObject.alpha = 0.85;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType, 10, 0);
            newBullet.create(this.phaserGroup_Bullets);
            newBullet.phaserObject.depth = 0;
            newBullet.phaserObject.alpha = 0.85;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
        }else if(this.bulletTypes[this.bulletTypes.curBulletType].bulletType === "shot_slice"){
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType);
            newBullet.create(this.phaserGroup_Bullets, -50);
            newBullet.phaserObject.depth = 0;
            newBullet.phaserObject.alpha = 0.85;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType);
            newBullet.create(this.phaserGroup_Bullets);
            newBullet.phaserObject.depth = 0;
            newBullet.phaserObject.alpha = 0.85;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType);
            newBullet.create(this.phaserGroup_Bullets, 50);
            newBullet.phaserObject.depth = 0;
            newBullet.phaserObject.alpha = 0.85;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
        }
        /*var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType);
        newBullet.create(this.phaserGroup_Bullets);
        newBullet.phaserObject.depth = 0;
        this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);*/
        setTimeout(() => { //This is to delay the cooldown unlock.
            this.toggleCooldown();
        }, 75)
    }
}

Player.prototype.toggleFocus = function(){ //This both toggles the isFocused boolean telling the game if the player needs to be slowed, and also displays the hitbox when needed.
    this.isFocused = !this.isFocused;
    if(this.isFocused){
        this.phaserObject_hitbox.alpha = 1;
    }else{
        this.phaserObject_hitbox.alpha = 0;
    }
}

Player.prototype.toggleCooldown = function(){ //This function simply flips the cooldown boolean.
    this.isCooldown = !this.isCooldown;
}

Player.prototype.toggleInvince = function(){ //This function simply flips the invincibility boolean.
    this.isInvince = !this.isInvince;
}

Player.prototype.switchShot = function(direction){ //This function is in charge of traversing the player's shot types whenever the player is pressing the corresponding keys to do so.
    if(direction === "left"){
        this.bulletTypes.curBulletType = this.bulletTypes.curBulletType - 1;
        if(this.bulletTypes.curBulletType < 0){
            this.bulletTypes.curBulletType = this.bulletTypes.length - 1;   
        }
    }else if(direction === "right"){
        this.bulletTypes.curBulletType = this.bulletTypes.curBulletType + 1;
        if(this.bulletTypes.curBulletType >= this.bulletTypes.length){
            this.bulletTypes.curBulletType = 0;   
        }
    }
    this.game.gameUI.power.updatePower(this.bulletTypes[this.bulletTypes.curBulletType].typePower);
}

Player.prototype.useBomb = function(){ //When the player presses the bomb key (X or K), all bullet phaser objects are cleared, and for every bullet in the screen boundary, the player is awarded 100 pts.
    if(!this.bombCooldown && this.game.gameUI.bombs.curLives > 0){
        this.game.sfx_bomb.play();
        this.game.screenFilter.play('activeBomb');
        this.bombCooldown = true;
        this.game.gameUI.bombs.changeLifeAmount(-1);
        while(this.game.phaserGroup_EnemyBullets.children.entries.length > 0 && this.bombCooldown){
            if(this.game.phaserGroup_EnemyBullets.children.entries[0].x > 26 && this.game.phaserGroup_EnemyBullets.children.entries[0].x < 695 && this.game.phaserGroup_EnemyBullets.children.entries[0].y > 26 && this.game.phaserGroup_EnemyBullets.children.entries[0].y < 877){
               this.game.gameUI.score.changeScore(100);
            }
            delete this.game.phaserGroup_EnemyBullets.children.entries[0].object;
            this.game.phaserGroup_EnemyBullets.children.entries[0].destroy(); 
        }
        /*for(var i = 0; i < this.game.phaserGroup_EnemyBullets.children.entries.length; i += 1){
            this.game.phaserGroup_EnemyBullets.children.entries[i].destroy();
            this.game.gameUI.score.changeScore(100);
            console.log("Bullet Removed!");
        }*/
            setTimeout(() => {
                this.bombCooldown = false;
            }, 1500)
    }
}

Player.prototype.hit = function(bulletObj, playerObj, gameOver = false){ //This function deals with all the events upon the player getting hit and losing a life.
    if(!playerObj.object.isInvince && !gameOver){ //Make sure the player isn't going through their invincibility frames and the game isn't over.
        this.game.sfx_death.play(); //Play the appropriate sound effect.
        playerObj.object.toggleInvince(); //Turn invincibility frames on.
        playerObj.object.phaserObject.alpha = 0.5; //Turn the player phaser object half opaque to signify the invincibility.
        this.pause = true;
        this.paused = false;
        //This gets rid of all bullets on screen.
        while(this.game.phaserGroup_EnemyBullets.children.entries.length > 0 && this.isInvince){
            this.game.phaserGroup_EnemyBullets.children.entries[0].destroy();
        }
        //This deducts a life from the counter.
        playerObj.object.game.gameUI.lives.changeLifeAmount(-1);
        
        //This causes some power up items to be dropped where the player dies. The player loses half their power and drops them as items to give them a chance to recover.
        for(var i = 0; i < Math.ceil(this.bulletTypes[this.bulletTypes.curBulletType].typePower/2); i += 1){
            var powItem = this.game.physics.add.sprite(this.phaserObject.x + ((Math.random()*60)-30), this.phaserObject.y + ((Math.random()*30)-15), "powUp");
            powItem.setVelocityY(350);
            this.game.phaserGroup_PowerUp.add(powItem);
        }
        //This brings the player to their spawn location. Bottom middle of the screen.
        playerObj.x = 360;
        playerObj.y = 791;
        //This halves and updates the power counter for the currently equipped weapon.
        this.bulletTypes[this.bulletTypes.curBulletType].typePower = Math.floor(this.bulletTypes[this.bulletTypes.curBulletType].typePower/2);
        this.game.gameUI.power.updatePower(this.bulletTypes[this.bulletTypes.curBulletType].typePower);
        this.game.gameUI.bombs.resetLife();
        setTimeout(() => { //Turn invincibility off and make the player not opaque.
            playerObj.object.toggleInvince();
            playerObj.object.phaserObject.alpha = 1;
        }, 3000)
    }else if(gameOver){ //If the game is over, then destroy the phaser object.
        this.phaserObject.destroy();
    }
}