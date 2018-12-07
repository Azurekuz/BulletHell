function GameMaterials(context){
    this.game = context;
    this.player = null;
    this.gameUI;
    
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
    this.game.load.spritesheet('shot_basic', 'assets/sprites/bullets/basicShot.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.spritesheet('shot_pierce', 'assets/sprites/bullets/pierceShot.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.spritesheet('shot_slice', 'assets/sprites/bullets/sliceShot.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.spritesheet('shot_enemyBasic', 'assets/sprites/bullets/enemy_Basic.png', {frameWidth: 38, frameHeight: 38});
    this.game.load.spritesheet('hitbox', 'assets/sprites/player/hitbox.png', {frameWidth: 10, frameHeight: 10});
    this.game.load.image('UI_Back', 'assets/ui/UI_Background.png');
    this.game.load.spritesheet('bombFilter', 'assets/ui/BombFilter.png', {frameWidth: 686, frameHeight: 868});
    this.game.load.image('nullObj', 'assets/ui/nullObj.png');
    this.game.load.image('gameOver', 'assets/ui/gameOver.png');
    this.game.load.spritesheet('powUp', 'assets/sprites/player/powUp.png', {frameWidth: 20, frameHeight:20});
}

GameMaterials.prototype.setup_Game = function(){
    this.game.gameUI = new UI_Game(this.game);
    this.bulletTypeArray = [];
    this.bulletTypeArray.push(new Bullet(this.game, 0, 0, 'shot_basic'));
    this.bulletTypeArray.push(new Bullet(this.game, 0, 0, 'shot_pierce'));
    this.bulletTypeArray.push(new Bullet(this.game, 0, 0, 'shot_slice'));
    
    this.bulletTypeArray[0].baseDamage = 5;
    this.bulletTypeArray[1].baseDamage = 20;
    this.bulletTypeArray[2].baseDamage = 10;
    
    this.player = new Player(this.game, 3, 10, 3, 'playerChar', this.bulletTypeArray);
    this.game.phaserGroup_EnemyBullets = this.game.add.group();
    this.game.phaserGroup_Enemies = this.game.add.group();
    this.game.phaserGroup_PlayerBullets = this.game.add.group();
    this.game.phaserGroup_PowerUp = this.game.add.group();
    this.game.phaserGroup_StageBorder = this.game.physics.add.staticGroup();
    this.game.screenFilter;
    this.animComp = new AnimationCompendium(this.game);
    
    this.gameOver = false;
    this.gameOverFilter = this.game.add.image(360, 454, "gameOver");
    this.gameOverFilter.depth = 1;
    this.gameOverFilter.alpha = 0;
    this.gameOverText;
}

GameMaterials.prototype.setup_Stage01 = function(){
    this.stage01 = new Stage_01(this.game, null, 'bd_Debug', null);
    this.stage01.setup();
    this.phaserGroup_Enemies = this.stage01.phaserGroup_enemies;
    this.setup_ScreenBorders();
    this.player.setup(360, 791);
    this.setup_Collisions();
    this.game.gameUI.setup();
    this.game.gameUI.power.updatePower(this.bulletTypeArray[this.player.bulletTypes.curBulletType].typePower);
    
}

GameMaterials.prototype.update_Stage01 = function(){
    if(!this.gameOver){
        this.player.update();
        this.stage01.update();
        this.check_Collisions();
        this.cleanUp();
    }else if(this.gameOver){
        if(this.gameOverFilter.alpha != 1){
            this.gameOverFilter.alpha += 0.01;
        }else{
           if(this.gameOverText == undefined || this.gameOverText == null){
              this.gameOverText = this.game.add.text(200, 200, 'Game Over', { font: '96px Agency FB', align: 'center', color: '#E82C0C'});
               this.gameOverText.depth = 1;
               this.gameOverText.alpha = 0;
            }else if(this.gameOverText.alpha != 1){
                this.gameOverText.alpha += 0.05;
            }else{
                this.game.add.text(215, 650, 'Click to refresh the game', { font: '40px Agency FB', align: 'center', color: '#E82C0C'}).depth = 1;
                this.game.input.once('pointerup', function (event) {
                    location.reload(); 
                }, this);
            } 
        }        
    }
}

GameMaterials.prototype.setup_Collisions = function(){
    this.game.physics.add.collider(this.player.phaserObject, this.game.phaserGroup_StageBorder);
}

GameMaterials.prototype.check_Collisions = function(){
    this.game.physics.world.overlap(this.game.phaserGroup_EnemyBullets, this.player.phaserObject, this.check_GameOver, null, this);
    this.game.physics.world.overlap(this.game.phaserGroup_Enemies, this.player.phaserObject, this.check_GameOver, null, this);
    this.game.physics.world.overlap(this.game.phaserGroup_Enemies, this.game.phaserGroup_PlayerBullets, this.enemyHit, null, this);
    this.game.physics.world.overlap(this.game.phaserGroup_PlayerBullets, this.game.phaserGroup_StageBorder, this.bounceBullet, null, this);
    this.game.physics.world.overlap(this.game.phaserGroup_PowerUp, this.player.phaserObject, this.powerUp, null, this);
}

GameMaterials.prototype.bounceBullet = function(bullet, border){
    if(bullet.object.bulletType === "shot_basic"){
        bullet.object.velX = (bullet.object.velX * -1) + (Math.random()*100 -50);
        bullet.object.velY = (bullet.object.velY * -1) + (Math.random()*100 -50);
        bullet.setVelocityX(bullet.object.velX + 10);
        bullet.setVelocityY(bullet.object.velY + 10);
        
    }
}

GameMaterials.prototype.check_GameOver = function(bulletObj, playerObj){
    if(this.game.gameUI.lives.curLives <= 0){
        for(var i = 0; i < this.stage01.phaserGroup_enemies.children.entries.length; i += 1){
            this.stage01.phaserGroup_enemies.children.entries[i].setVelocityX(0);
            this.stage01.phaserGroup_enemies.children.entries[i].setVelocityY(0);  
        }
        this.gameOver = true;
        this.player.hit(bulletObj, playerObj, this.gameOver); 
        console.log("GAME OVER");
    }else{
       this.player.hit(bulletObj, playerObj);
    }
}

GameMaterials.prototype.setup_ScreenBorders = function(){
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

GameMaterials.prototype.enemyHit = function(enemy, bullet){
    enemy.object.hit(bullet);
    bullet.object.expire(500);
}

GameMaterials.prototype.setup_Audio = function(){
    
}

GameMaterials.prototype.powerUp= function(powItem, player){
   if(this.player.bulletTypes[this.player.bulletTypes.curBulletType].typePower < 120){              this.player.bulletTypes[this.player.bulletTypes.curBulletType].typePower += 1;
    }
    this.game.gameUI.power.updatePower(this.player.bulletTypes[this.player.bulletTypes.curBulletType].typePower);
    powItem.destroy();
}

GameMaterials.prototype.cleanUp= function(){
    for(var i = 0; i < this.game.phaserGroup_PowerUp.children.entries.length; i+= 1){
        if((this.game.phaserGroup_PowerUp.children.entries[i].x < 26 || this.game.phaserGroup_PowerUp.children.entries[i].x > 695) || (this.game.phaserGroup_PowerUp.children.entries[i].y < 26 || this.game.phaserGroup_PowerUp.children.entries[i].y > 877)){
            
            this.game.phaserGroup_PowerUp.children.entries[i].destroy();
        }
    }
}