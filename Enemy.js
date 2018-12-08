function Enemy(context, health, spriteID, movementPattern = "sideSlide", bulletPattern = "randomForward", bulletType = "shot_enemyBasic", fireRate = 250){
    this.game = context;
    this.isInvince = false;
    this.isCooldown = false;
    this.health = health;
    this.spriteID = spriteID;
    this.movePattern = movementPattern;
    this.bulletPattern = bulletPattern;
    this.bulletType = bulletType;
    this.frenzyCooldown = false;
    this.fireRate = fireRate;
    
    this.phaserObject;
    this.phaserGroup_Bullets;
}

Enemy.prototype.setup=function(xLoc, yLoc, xVel = 200, yVel = 0){
    this.phaserObject = this.game.physics.add.sprite(xLoc, yLoc, this.spriteID);
    this.setup_BulletGroup();
    this.phaserObject.object = this;
    this.game.phaserGroup_Enemies.add(this.phaserObject);
    this.phaserObject.setVelocityX(xVel);
    this.phaserObject.setVelocityY(yVel);
}

Enemy.prototype.setup_BulletGroup = function(){
    this.phaserGroup_Bullets = this.game.add.group();
}

Enemy.prototype.update = function(){
    if(this.health > 0){
        this.movement();
        this.attack();
    }
}

Enemy.prototype.movement=function(){
    if(this.movePattern === "sideSlide"){
        this.checkAIBounds();
    }else if(this.movePattern === "frenzy"){
        this.checkAIBounds();
        if(!this.frenzyCooldown){
            this.frenzyCooldown = true;
           if(Math.floor(Math.random()*2) == 1){
                this.phaserObject.setVelocityX(-Math.floor((Math.random()*150)+150)); 
            }else{
                this.phaserObject.setVelocityX(Math.floor((Math.random()*150)+150));
            }
            if(Math.floor(Math.random()*2) == 1){
                this.phaserObject.setVelocityY(-Math.floor((Math.random()*150)+150)); 
            }else{
                this.phaserObject.setVelocityY(Math.floor((Math.random()*150)+150));
            }
            setTimeout(() => {
                this.frenzyCooldown = false;
            }, 1000)
        }
    }
}

Enemy.prototype.checkAIBounds = function(){
    if(this.phaserObject.x <= 26){
        this.phaserObject.setVelocityX(200);
    }else if(this.phaserObject.x >= 695){
        this.phaserObject.setVelocityX(-200);   
    }
    if(this.phaserObject.y <= 26){
        this.phaserObject.setVelocityY(200);
    }else if(this.phaserObject.y >= 877){
        this.phaserObject.setVelocityY(-200);         
    }
}

Enemy.prototype.toggleInvince = function(){
    this.isInvince = !this.isInvince;
}

Enemy.prototype.attack=function(){
    if(!this.isCooldown){
        this.game.sfx_enemyAttack.play();
        this.toggleCooldown();
        if(this.bulletPattern === "randomForward"){
            var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletType);
            newBullet.create(this.phaserGroup_Bullets, Math.floor((Math.random() * 180) - 90), 450);
            newBullet.phaserObject.depth = 0;
            this.phaserGroup_Bullets.add(newBullet.phaserObject);
            this.game.phaserGroup_EnemyBullets.add(newBullet.phaserObject);
        }else if(this.bulletPattern == "radial"){
            var radialArray = [[-100, 0],[-75, 25],[-50, 50],[-25, 75],[0, 100],[25,75],[50,50],[75, 25],[100, 0],[75, -25],[50, -50],[25, -75],[0, -100],[-25, -75],[-50, -50],[-75, -25]];
            var xVel;
            var yVel;
            for(var i = 0; i < radialArray.length; i += 1){
                var newBullet = new Bullet(this.game, this.phaserObject.x, this.phaserObject.y, this.bulletType, radialArray[i][0]*0.25, radialArray[i][1]*0.25);
                if(radialArray[i][0] < 0){
                   xVel = -250 - radialArray[i][0];
                }else if(radialArray[i][0] > 0){
                    xVel = 250 + radialArray[i][0];
                }else{
                    yVel = 0;
                }
                if(radialArray[i][1] < 0){
                    yVel = -250 - radialArray[i][1];     
                 }else if(radialArray[i][1] > 0){
                    yVel = 250 + radialArray[i][1];
                }else{
                    yVel = 0;
                }
                newBullet.create(this.phaserGroup_Bullets,xVel, yVel);
                newBullet.phaserObject.depth = 0;
                this.phaserGroup_Bullets.add(newBullet.phaserObject);
                this.game.phaserGroup_EnemyBullets.add(newBullet.phaserObject);
            }
            //
         }
         setTimeout(() => {
                this.toggleCooldown();
        }, this.fireRate)
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
        }, 150)
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