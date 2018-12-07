function Player(context, initLives, initHealth, initSpells, spriteID, bulletTypes = null){
    this.game = context;
    this.lives = initLives;
    this.maxHealth = initHealth;
    this.curHealth = this.maxHealth;
    this.curSpells = initSpells;
    this.isFocused = false;
    this.isInvince = false;
    this.spriteID = spriteID;
    this.phaserObject = null;
    this.controls = null;
    this.bulletTypes = [];
    for(var i = 0; i < bulletTypes.length; i += 1){
        this.bulletTypes.push(bulletTypes[i]);
    }
    this.bulletTypes.curBulletType = 1;
    this.isCooldown = false;
    this.bombCooldown = false;
    this.phaserGroup_Bullets;
    this.phaserObject_hitbox;
}

Player.prototype.setup = function(){
    this.phaserObject = this.game.physics.add.sprite(360, 452, this.spriteID);
    if(this.controls == null){
        this.setup_Controls();
    }
    this.setup_BulletGroup();
    this.phaserObject.object = this;
    this.setup_Hitbox();
}

Player.prototype.setup = function(locX, locY){
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

Player.prototype.update_Hitbox = function(){
    this.phaserObject_hitbox.x = this.phaserObject.x;
    this.phaserObject_hitbox.y = this.phaserObject.y;
}

Player.prototype.setup_BulletGroup = function(){
    this.phaserGroup_Bullets = this.game.add.group();
}

Player.prototype.setup_Controls = function(){
    this.controls = new ControlScheme(this.game);
    this.controls.setup();
}

Player.prototype.update = function(){
    this.movement();
    if(Phaser.Input.Keyboard.JustDown(this.controls.focusShot)){
        console.log("Focused!");
        this.toggleFocus();   
    }else if(this.isFocused && !this.controls.focusShot.isDown){
        console.log("Unfocused!");
        this.toggleFocus();
    }
    if(this.controls.isShooting()){
        this.shoot();
    }
    if(this.controls.isBombing()){
       this.useBomb();
    }
    if(this.controls.isSwitchLeft()){
        this.switchShot("left");
    }else if(this.controls.isSwitchRight()){
        this.switchShot("right");     
    }
    this.game.gameUI.score.changeScore(1);
    this.update_Hitbox();
}

Player.prototype.movement = function(){
    if(!this.isFocused){
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
    }else if(this.isFocused){
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
    if(!(this.controls.isMoveUp() || this.controls.isMoveDown() || this.controls.isMoveLeft() || this.controls.isMoveRight())){
        this.phaserObject.setVelocityX(0);
        this.phaserObject.setVelocityY(0);
    }
}

Player.prototype.shoot = function(){
    if(!this.isCooldown){
        this.toggleCooldown();
        if(this.bulletTypes[this.bulletTypes.curBulletType].bulletType === "shot_basic"){
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType, 0, 0);
            newBullet.create(this.phaserGroup_Bullets);
            newBullet.phaserObject.depth = 0;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
        }else if(this.bulletTypes[this.bulletTypes.curBulletType].bulletType === "shot_pierce"){
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType, -10, 0);
            newBullet.create(this.phaserGroup_Bullets);
            newBullet.phaserObject.depth = 0;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType, 10, 0);
            newBullet.create(this.phaserGroup_Bullets);
            newBullet.phaserObject.depth = 0;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
        }else if(this.bulletTypes[this.bulletTypes.curBulletType].bulletType === "shot_slice"){
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType);
            newBullet.create(this.phaserGroup_Bullets, -50);
            newBullet.phaserObject.depth = 0;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType);
            newBullet.create(this.phaserGroup_Bullets);
            newBullet.phaserObject.depth = 0;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType);
            newBullet.create(this.phaserGroup_Bullets, 50);
            newBullet.phaserObject.depth = 0;
            this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);
        }
        /*var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletTypes[this.bulletTypes.curBulletType].bulletType);
        newBullet.create(this.phaserGroup_Bullets);
        newBullet.phaserObject.depth = 0;
        this.game.phaserGroup_PlayerBullets.add(newBullet.phaserObject);*/
        setTimeout(() => {
            this.toggleCooldown();
        }, 75)
    }
}

Player.prototype.toggleFocus = function(){
    this.isFocused = !this.isFocused;
    if(this.isFocused){
        this.phaserObject_hitbox.alpha = 1;
        console.log(this.game.phaserGroup_EnemyBullets);
    }else{
        this.phaserObject_hitbox.alpha = 0;
    }
}

Player.prototype.toggleCooldown = function(){
    this.isCooldown = !this.isCooldown;
}

Player.prototype.toggleInvince = function(){
    this.isInvince = !this.isInvince;
}

Player.prototype.switchShot = function(direction){
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

Player.prototype.useBomb = function(){
    console.log("PLAYER BULLETS:" + this.game.phaserGroup_PlayerBullets.children.entries.length);
    console.log("ENEMY BULLETS:" + this.game.phaserGroup_EnemyBullets.children.entries.length);
    console.log("POW ITEM:" + this.game.phaserGroup_PowerUp.children.entries.length);
    if(!this.bombCooldown && this.game.gameUI.bombs.curLives > 0){
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

Player.prototype.hit = function(bulletObj, playerObj, gameOver = false){
    if(!playerObj.object.isInvince && !gameOver){
        playerObj.object.toggleInvince();
        playerObj.object.phaserObject.alpha = 0.5;
        this.pause = true;
        this.paused = false;
        while(this.game.phaserGroup_EnemyBullets.children.entries.length > 0 && this.isInvince){
            this.game.phaserGroup_EnemyBullets.children.entries[0].destroy();
        }
        playerObj.object.game.gameUI.lives.changeLifeAmount(-1);
        for(var i = 0; i < Math.ceil(this.bulletTypes[this.bulletTypes.curBulletType].typePower/2); i += 1){
            var powItem = this.game.physics.add.sprite(this.phaserObject.x + ((Math.random()*60)-30), this.phaserObject.y + ((Math.random()*30)-15), "powUp");
            powItem.setVelocityY(350);
            this.game.phaserGroup_PowerUp.add(powItem);
        }
        playerObj.x = 360;
        playerObj.y = 791;
        this.bulletTypes[this.bulletTypes.curBulletType].typePower = Math.floor(this.bulletTypes[this.bulletTypes.curBulletType].typePower/2);
        this.game.gameUI.power.updatePower(this.bulletTypes[this.bulletTypes.curBulletType].typePower);
        this.game.gameUI.bombs.resetLife();
        console.log("Player Hit!");
        setTimeout(() => {
            playerObj.object.toggleInvince();
            playerObj.object.phaserObject.alpha = 1;
        }, 3000)
    }else if(gameOver){
        this.phaserObject.destroy();
    }
}