function Enemy(context, health, spriteID, movementPattern = "sideSlide", bulletPattern = "randomForward", bulletType = "shot_enemyBasic", fireRate = 250){
    this.game = context;
    this.isInvince = false; //Is the enemy invincible?
    this.isCooldown = false; //Is the enemy on cooldown? This makes sure they don't fire a bullet every frame.
    this.health = health; //Enemy health
    this.spriteID = spriteID; //How the enemy looks like.
    this.movePattern = movementPattern; //How the enemy moves.
    this.bulletPattern = bulletPattern; //How the enemy attacks.
    this.bulletType = bulletType; //The bullet type the enemy uses.
    this.frenzyCooldown = false; //If the enemy uses the "Frenzy" movement pattern, this makes sure they don't change directions every second.
    this.fireRate = fireRate; //The rate/speed of which enemies produce bullets.
    
    this.phaserObject;
    this.phaserGroup_Bullets;
}

Enemy.prototype.setup=function(xLoc, yLoc, xVel = 200, yVel = 0){ //Setup and spawn the enemy phaser object.
    this.phaserObject = this.game.physics.add.sprite(xLoc, yLoc, this.spriteID);
    this.setup_BulletGroup();
    this.phaserObject.object = this;
    this.game.phaserGroup_Enemies.add(this.phaserObject);
    this.phaserObject.setVelocityX(xVel);
    this.phaserObject.setVelocityY(yVel);
}

Enemy.prototype.setup_BulletGroup = function(){ //Setup the enemyeis' bullet phaser group
    this.phaserGroup_Bullets = this.game.add.group();
}

Enemy.prototype.update = function(){ //Enemy update loop
    if(this.health > 0){ //If the enemy isn't dead, do this.
        this.movement();
        this.attack();
    }
}

Enemy.prototype.movement=function(){
    if(this.movePattern === "sideSlide"){ //Siply move side to side, or bounce around whenever it hits the screen borders
        this.checkAIBounds();
    }else if(this.movePattern === "frenzy"){ //Every second, randomly change direction and take on a random velocity between 150 and 300.
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

Enemy.prototype.checkAIBounds = function(){ //This function makes sure that the enemy moves onto the screen and stays between bounds.
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

Enemy.prototype.toggleInvince = function(){ //Toggles the invincibility frames on the enemy.
    this.isInvince = !this.isInvince;
}

Enemy.prototype.attack=function(){ //This function creates the enemy's attacks after checking their assigned bullet pattern.
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

Enemy.prototype.hit = function(bullet){ //If an enemy is hit when it's not using invincibility frames...
    if(!this.isInvince){
        //Toggle invincibility
        this.toggleInvince();
        //Make them transparent temporarily.
        this.phaserObject.alpha = 0.5;
        //Deduct the damage from 
        this.damage(bullet.object.baseDamage * (1 + Math.floor(this.game.gameUI.power.curPower/20)));
        setTimeout(() => {
            this.toggleInvince();
            this.phaserObject.alpha = 1;
        }, 150)
    }
}

Enemy.prototype.damage= function(dmg){ //The function that handles player bullets damaging the enemy
    this.health = this.health - dmg;
    if(this.health <= 0){
       this.die();
    }
}

Enemy.prototype.die=function(){ //Function that is in charge of having the enemy die.
    this.game.sfx_enemyDeath.play();
    setTimeout(() => {
        this.phaserObject.alpha = 0.25;
        this.dropPower();
        this.phaserObject.destroy();
        delete this;
        this.game.gameUI.score.changeScore(100);
        }, 50)
}

Enemy.prototype.dropPower=function(){ //This function causes defeated enemies to drop a random small amount of power up items.
    for(var i = 0; i < ((Math.random()*5)+1); i += 1){
        var powItem = this.game.physics.add.sprite(this.phaserObject.x + ((Math.random()*30)-15), this.phaserObject.y + ((Math.random()*30)-15), "powUp");
        powItem.setVelocityY(350);
        this.game.phaserGroup_PowerUp.add(powItem);
    }
}

Enemy.prototype.toggleCooldown = function(){ //Toggles the cooldown on enemy attacks.
    this.isCooldown = !this.isCooldown;
}