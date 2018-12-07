function Enemy(context, health, spriteID, movementPattern, bulletPattern){
    this.game = context;
    this.isInvince = false;
    this.isCooldown = false;
    this.health = health;
    this.spriteID = spriteID;
    this.movePattern = movementPattern;
    this.bulletPattern = bulletPattern;
    
    this.phaserObject;
    this.phaserGroup_Bullets;
}

Enemy.prototype.setup=function(xLoc, yLoc){
    this.phaserObject = this.game.physics.add.sprite(xLoc, yLoc, this.spriteID);
    this.setup_BulletGroup();
    this.phaserObject.object = this;
    this.game.phaserGroup_Enemies.add(this.phaserObject);
    this.phaserObject.setVelocityX(200);
}

Enemy.prototype.setup_BulletGroup = function(){
    this.phaserGroup_Bullets = this.game.add.group();
}

Enemy.prototype.update = function(){
    if(this.health > 0){
        if(this.phaserObject.x <= 26){
            this.phaserObject.setVelocityX(200);
        }else if(this.phaserObject.x >= 695){
            this.phaserObject.setVelocityX(-200);   
        }
        this.attack();
    }
}

Enemy.prototype.movement=function(){
    
}

Enemy.prototype.toggleInvince = function(){
    this.isInvince = !this.isInvince;
}

Enemy.prototype.attack=function(){
    if(!this.isCooldown){
        this.game.sfx_enemyAttack.play();
        this.toggleCooldown();
        var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, 'shot_enemyBasic');
        newBullet.create(this.phaserGroup_Bullets, Math.floor((Math.random() * 180) - 90), 450);
        newBullet.phaserObject.depth = 0;
        this.phaserGroup_Bullets.add(newBullet.phaserObject);
        this.game.phaserGroup_EnemyBullets.add(newBullet.phaserObject);
        setTimeout(() => {
            this.toggleCooldown();
        }, 250)
    }
}

Enemy.prototype.hit = function(bullet){
    if(!this.isInvince){
        this.toggleInvince();
        this.phaserObject.alpha = 0.5;
        this.damage(bullet.object.baseDamage * (1 + Math.floor(this.game.gameUI.power.curPower/20)));
        setTimeout(() => {
            this.toggleInvince();
            this.phaserObject.alpha = 1;
        }, 50)
    }
}

Enemy.prototype.damage= function(dmg){
    this.health = this.health - dmg;
    if(this.health <= 0){
       this.die();
    }
}

Enemy.prototype.die=function(){
    this.game.sfx_enemyDeath.play();
    setTimeout(() => {
        this.phaserObject.alpha = 0.25;
        this.dropPower();
        this.phaserObject.destroy();
        delete this;
        this.game.gameUI.score.changeScore(100);
        }, 50)
}

Enemy.prototype.dropPower=function(){
    for(var i = 0; i < ((Math.random()*5)+1); i += 1){
        var powItem = this.game.physics.add.sprite(this.phaserObject.x + ((Math.random()*30)-15), this.phaserObject.y + ((Math.random()*30)-15), "powUp");
        powItem.setVelocityY(350);
        this.game.phaserGroup_PowerUp.add(powItem);
    }
}

Enemy.prototype.toggleCooldown = function(){
    this.isCooldown = !this.isCooldown;
}