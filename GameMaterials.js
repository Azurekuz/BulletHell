function GameMaterials(context){
    /* Welcome to the GameMaterials JS file, this is where all the assets are loaded, and then come together with the help of the coded game objects and function to create this demo.*/
    this.game = context; //This variable is to maintain a connection to Phaser and its functions.
    this.player = null; //This is a placeholder variable for the player object.
    this.gameUI; //This is a placeholder variable for the game's user interface.
    
    this.game.load.audio('SFX_attack', 'assets/audio/sfx/Attack.wav');
    this.game.load.audio('SFX_bomb', 'assets/audio/sfx/Bomb.wav');
    this.game.load.audio('SFX_death', 'assets/audio/sfx/Death.wav');
    this.game.load.audio('SFX_enemyAttack', 'assets/audio/sfx/EnemyAttack.wav');
    this.game.load.audio('SFX_enemyDeath', 'assets/audio/sfx/EnemyDeath.wav');
     this.game.load.audio('SFX_lifeUp', 'assets/audio/sfx/LifeUp.wav');
     this.game.load.audio('SFX_powUp', 'assets/audio/sfx/PowPickUp.wav');
    this.game.load.image('bd_Debug', 'assets/stage/backdrop/stage_Debug.png');
    this.game.load.image('bd_lay1', 'assets/stage/backdrop/stage_Layer1.png');
    this.game.load.image('bd_lay2', 'assets/stage/backdrop/stage_Layer2.png');
    this.game.load.image('bd_lay3', 'assets/stage/backdrop/stage_Layer3.png');
    this.game.load.image('bd_lay4', 'assets/stage/backdrop/stage_Layer4.png');
    this.game.load.image('bd_lay5', 'assets/stage/backdrop/stage_Layer5.png');
    this.game.load.spritesheet('stageBorder', 'assets/stage/stage_obj/StageBorderBlock.png', {frameWidth: 75, frameHeight: 75});
    this.game.load.spritesheet('icon_life', 'assets/ui/icon_life.png', {frameWidth: 40, frameHeight: 40});
    this.game.load.spritesheet('icon_spell', 'assets/ui/icon_spell.png', {frameWidth: 40, frameHeight: 40});
    this.game.load.spritesheet('playerChar', 'assets/sprites/player/player.png', {frameWidth: 16, frameHeight: 34});
    this.game.load.spritesheet('enemyChar', 'assets/sprites/enemy/enemyChar.png', {frameWidth: 38, frameHeight: 48});
    this.game.load.spritesheet('enemyCharB', 'assets/sprites/enemy/enemyCharB.png', {frameWidth: 38, frameHeight: 48});
    this.game.load.spritesheet('enemyCharC', 'assets/sprites/enemy/enemyCharC.png', {frameWidth: 38, frameHeight: 48});
    this.game.load.spritesheet('boss01', 'assets/sprites/enemy/boss01Char.png', {frameWidth: 204, frameHeight: 162});
    this.game.load.spritesheet('shot_basic', 'assets/sprites/bullets/basicShot.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.spritesheet('shot_pierce', 'assets/sprites/bullets/pierceShot.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.spritesheet('shot_slice', 'assets/sprites/bullets/sliceShot.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.spritesheet('shot_enemyBasic', 'assets/sprites/bullets/enemy_Basic.png', {frameWidth: 38, frameHeight: 38});
    this.game.load.spritesheet('shot_enemyMed', 'assets/sprites/bullets/enemy_Medium.png', {frameWidth: 19, frameHeight: 19});
    this.game.load.spritesheet('shot_enemySml', 'assets/sprites/bullets/enemy_Small.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.spritesheet('hitbox', 'assets/sprites/player/hitbox.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.image('UI_Back', 'assets/ui/UI_Background.png');
    this.game.load.spritesheet('bombFilter', 'assets/ui/BombFilter.png', {frameWidth: 686, frameHeight: 868});
    this.game.load.image('nullObj', 'assets/ui/nullObj.png');
    this.game.load.image('gameOver', 'assets/ui/gameOver.png');
    this.game.load.spritesheet('powUp', 'assets/sprites/player/powUp.png', {frameWidth: 20, frameHeight:20});
}

/*
    This function has a rather self-explanatory title. The game and everything it needs to know is set up here.
*/
GameMaterials.prototype.setup_Game = function(){
    this.game.gameUI = new UI_Game(this.game); //This is where the game's UI is created.
    this.bulletTypeArray = []; //This is the array of all the usable weapon types the player has at their disposal.
    
    /* These three bullet objects are the weapon types, that are thereby added to the bullet type array.*/
    this.bulletTypeArray.push(new Bullet(this.game, 0, 0, 'shot_basic'));
    this.bulletTypeArray.push(new Bullet(this.game, 0, 0, 'shot_pierce'));
    this.bulletTypeArray.push(new Bullet(this.game, 0, 0, 'shot_slice'));
    
    //This is where the base damage values of the bullets are defined.
    this.bulletTypeArray[0].baseDamage = 10;
    this.bulletTypeArray[1].baseDamage = 20;
    this.bulletTypeArray[2].baseDamage = 5;
    
    //This is where the player object is created.
    this.player = new Player(this.game, 3, 10, 3, 'playerChar', this.bulletTypeArray);
    
    //This is the Phaser group for the enemies' bullets.
    this.game.phaserGroup_EnemyBullets = this.game.add.group();
    //This is the Phaser group for the enemies themselves.
    this.game.phaserGroup_Enemies = this.game.add.group();
    //This is the Phaser group for the player's bullets.
    this.game.phaserGroup_PlayerBullets = this.game.add.group();
    //This is the Phaser group for the Power Up item.
    this.game.phaserGroup_PowerUp = this.game.add.group();
    //This is a Phaser platform group for the screen borders that prevent the player from going off-screen and/or behind the UI.
    this.game.phaserGroup_StageBorder = this.game.physics.add.staticGroup();
    
    /*This is a variable used for the background effect during the Game over and Stage Complete sequences. */
    this.game.screenFilter;
    
    //This is where all the animations are created and stored. It is created here.
    this.animComp = new AnimationCompendium(this.game);
    
    //This function sets up the audio of the game.
    this.setup_Audio();
    
    //Placeholder variable for the first stage.
    this.stage01;
    
    //Is the game over? Of course not, as we've only just started.
    this.gameOver = false;
    //This is where the background is actually defined.
    this.gameOverFilter = this.game.add.image(360, 454, "gameOver");
    //Make sure it goes behind the UI, but in front of the stage background, which we'll create soon.
    this.gameOverFilter.depth = 1;
    //Make it completely transparent, the oacity will be changed when it is needed.
    this.gameOverFilter.alpha = 0;
    //Placeholder for the text that will appear either the lose or win condition of the demo.
    this.gameOverText;
}

GameMaterials.prototype.setup_Stage01 = function(){
    //Create the first stage object.
    this.stage01 = new Stage_01(this.game, null, 'bd_Debug', null);
    //Then set it up and have it displayed.
    this.stage01.setup();
    //Make sure that GameMaterial's Enemy PhaserGroup is tracking the current stage's enemies.
    this.phaserGroup_Enemies = this.stage01.phaserGroup_enemies;
    //Set the screen borders up, and keep the player contained in the game area.
    this.setup_ScreenBorders();
    //Set the player object up.
    this.player.setup(360, 791);
    //Make sure things keep track of when they collide or overlap with one another.
    this.setup_Collisions();
    //Finally set up the game's UI.
    this.game.gameUI.setup();
    
    //Update the power counter so that it shows how much power the current weapon has, which at this point should be 0.
    this.game.gameUI.power.updatePower(this.bulletTypeArray[this.player.bulletTypes.curBulletType].typePower);
    
}

GameMaterials.prototype.update_Stage01 = function(){
    if(!this.gameOver && !this.stage01.isComplete){ //If the game is neither over nor complete, then actually have the game happen.
        this.player.update(); //1. Update the player
        this.stage01.update(); //2. Update the stage itself
        this.check_Collisions(); //3. Check for collisions/overlaps as needed. Deal with those.
        this.cleanUp(); //4. Clean up any PhaserObject power up items that are now off-screen and falling endlessly.
    }else if(this.gameOver){ //If the game is actually over then do the following.
        if(this.gameOverFilter.alpha != 1){
            this.gameOverFilter.alpha += 0.01; //Make the gameover filter gradually show show up until it is fully apparent.
        }else{  //Otherwise...
           if(this.gameOverText == undefined || this.gameOverText == null){ //if the "GAME OVER" text hasn't shown up, well then fix that.
              this.gameOverText = this.game.add.text(200, 200, 'Game Over', { font: '96px Agency FB', align: 'center', color: '#E82C0C'});  //Make a text object.
               this.gameOverText.depth = 1;     //Have it be at the same depth as the background effect.
               this.gameOverText.alpha = 0;     //Have it start out transparent.
            }else if(this.gameOverText.alpha < 0.95){   //While it is under a certain transparency.
                this.gameOverText.alpha += 0.05;    //Make it more transparent.
            }else if(this.gameOverText.alpha >= 0.95 && this.gameOverText.alpha < 1){ //Once the text's transparency is at a certain point.
                //We let the player know that they can click to refresh the page, restarting the page.
                this.game.add.text(215, 650, 'Click to refresh the game', { font: '40px Agency FB', align: 'center', color: '#E82C0C'}).depth = 1;
                this.game.input.once('pointerup', function (event) {
                    location.reload(); //Refresh the page upon a click.
                }, this);
                this.gameOverText.alpha = 1; //The text is now fully non-transparent.
            } 
        }        
    }else if(this.stage01.isComplete){ //If the player actually completes the stage...
        if(this.gameOverFilter.alpha != 1){ //...If the background effect isn't visible.
            this.gameOverFilter.alpha += 0.01; //Gradually make it so.
        }  else{ //Otherwise...
            if(this.gameOverText == undefined || this.gameOverText == null){  //If there is no Stage Complete text, then kindly fix that.
              this.gameOverText = this.game.add.text(175, 200, 'Stage 01 Clear', { font: '96px Agency FB', align: 'center', color: '#E8E070'}); //Create the text.
               this.gameOverText.depth = 1; //Have it be at the same depth as the background.
               this.gameOverText.alpha = 0; //Have it start out as transparent
            }else if(this.gameOverText.alpha < 0.95){
                this.gameOverText.alpha += 0.05; //Make it gradually more apparent.
            }else if(this.gameOverText.alpha >= 0.95 && this.gameOverText.alpha < 1){
                //At a certain point, let the player know that they're able to click and refresh the game.
                this.game.add.text(215, 650, 'Click to refresh the game', { font: '40px Agency FB', align: 'center', color: '#E8E070'}).depth = 1; 
                this.game.input.once('pointerup', function (event) {
                    location.reload(); 
                }, this);
                this.gameOverText.alpha = 1; //Make the game over text fully visible.
            }
        }   
    }
}

GameMaterials.prototype.setup_Collisions = function(){
    this.game.physics.add.collider(this.player.phaserObject, this.game.phaserGroup_StageBorder); //Make sure the player can collide with the screen borders so they don't go offscreen.
}

GameMaterials.prototype.check_Collisions = function(){ //Collision checks.
    this.game.physics.world.overlap(this.game.phaserGroup_EnemyBullets, this.player.phaserObject, this.check_GameOver, null, this); //Enemy bullets vs. Player
    this.game.physics.world.overlap(this.game.phaserGroup_Enemies, this.player.phaserObject, this.check_GameOver, null, this); //Enemies vs. Player
    this.game.physics.world.overlap(this.game.phaserGroup_Enemies, this.game.phaserGroup_PlayerBullets, this.enemyHit, null, this); //Enemies vs Player Bullets
    this.game.physics.world.overlap(this.game.phaserGroup_PlayerBullets, this.game.phaserGroup_StageBorder, this.bounceBullet, null, this); //Player Bullets vs. Stage Borders (Used for bounce shot)
    this.game.physics.world.overlap(this.game.phaserGroup_PowerUp, this.player.phaserObject, this.powerUp, null, this); //Power Up vs. Player
}

GameMaterials.prototype.bounceBullet = function(bullet, border){ //This is the function responsible for making the bounce shots, well, bounce!
    if(bullet.object.bulletType === "shot_basic"){ //if it the right type of shot.
        bullet.object.velX = (bullet.object.velX * -1) + (Math.random()*100 -50); //Make the velocities negative and change them by a randomly deducted number.
        bullet.object.velY = (bullet.object.velY * -1) + (Math.random()*100 -50);
        bullet.setVelocityX(bullet.object.velX + 10); //Set the velocity of the bullet to the new one.
        bullet.setVelocityY(bullet.object.velY + 10);
        
    }
}

GameMaterials.prototype.check_GameOver = function(bulletObj, playerObj){ //Check to see if the game is over upon the loss of a life.
    if(this.game.gameUI.lives.curLives <= 0){ //if we are at or less than 0 lives it is game over.
        for(var i = 0; i < this.stage01.phaserGroup_enemies.children.entries.length; i += 1){
            this.stage01.phaserGroup_enemies.children.entries[i].setVelocityX(0); //Stop all enemy movement.
            this.stage01.phaserGroup_enemies.children.entries[i].setVelocityY(0);  
        }
        this.gameOver = true; //Game is over.
        this.player.hit(bulletObj, playerObj, this.gameOver); //Player loses their life and the PhaserObject is removed from the world.
        console.log("GAME OVER");
    }else{
       this.player.hit(bulletObj, playerObj); //Otherwise just have the player die and respawn.
    }
}

GameMaterials.prototype.setup_ScreenBorders = function(){ //This function uses two for loops to set up the screen borders along the verticle and horizontal borders.
    for(var x = 0; x <= 685; x += 75){
        var newBorder = this.game.phaserGroup_StageBorder.create(x, -16, 'stageBorder');
        newBorder = this.game.phaserGroup_StageBorder.create(x, 920, 'stageBorder');
        newBorder.alpha = 0;
    };
    
    for(var y = 0; y <= 904; y += 75){
        newBorder = this.game.phaserGroup_StageBorder.create(-16, y, 'stageBorder');
        newBorder = this.game.phaserGroup_StageBorder.create(738, y, 'stageBorder');
        newBorder.alpha = 0;
    };
}

GameMaterials.prototype.enemyHit = function(enemy, bullet){ //This function is called when an enemy is hit by a player attack.
    enemy.object.hit(bullet);
    bullet.object.expire(500);
}

GameMaterials.prototype.setup_Audio = function(){
    /* This is the collection of all used sound effects in the game. They are defined here*/
    this.game.sfx_attack = this.game.sound.add('SFX_attack');
    this.game.sfx_bomb = this.game.sound.add('SFX_bomb');
    this.game.sfx_death = this.game.sound.add('SFX_death');
    this.game.sfx_enemyAttack = this.game.sound.add('SFX_enemyAttack');
    this.game.sfx_enemyDeath = this.game.sound.add('SFX_enemyDeath');
    this.game.sfx_powUp = this.game.sound.add('SFX_powUp');
    this.game.sfx_lifeUp= this.game.sound.add('SFX_lifeUp');
}

GameMaterials.prototype.powerUp= function(powItem, player){ //This function is called when the player overaps with the power up sprite. The counter is updated, an SFX is player, and the current shot gets stronger.
   this.game.sfx_powUp.play();
    if(this.player.bulletTypes[this.player.bulletTypes.curBulletType].typePower < 120){     this.player.bulletTypes[this.player.bulletTypes.curBulletType].typePower += 1;
    }
    this.game.gameUI.power.updatePower(this.player.bulletTypes[this.player.bulletTypes.curBulletType].typePower);
    powItem.destroy();
}

GameMaterials.prototype.cleanUp= function(){ //This function is responsible for going through the group of power up items, and checking to see if they're still within the bounds of the game screen.
    for(var i = 0; i < this.game.phaserGroup_PowerUp.children.entries.length; i+= 1){
        if((this.game.phaserGroup_PowerUp.children.entries[i].x < 26 || this.game.phaserGroup_PowerUp.children.entries[i].x > 695) || (this.game.phaserGroup_PowerUp.children.entries[i].y < 26 || this.game.phaserGroup_PowerUp.children.entries[i].y > 877)){
            
            this.game.phaserGroup_PowerUp.children.entries[i].destroy();
        }
    }
}