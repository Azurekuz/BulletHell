function Bullet(context, xPos, yPos, spriteID, offsetX = 0, offsetY = 0, baseDamage = 10){
    this.game = context;
    this.originX = xPos; //Initial x position
    this.originY = yPos; //Initial y position
    this.velX; //Variables so that we can save velocities in case we need to use them later.
    this.velY;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.bulletType = spriteID; //What is the shape of the bullet and how does it look like?
    this.typePower = 0; //How strong this bullet is. Used for the player's attacks.
    this.phaserObject = null;
    this.baseDamage = baseDamage; //The base damage the this bullet type deals.
}

Bullet.prototype.create = function(bulletGroup,xVel = 0, yVel = -600){ //Actually create/show the bullet on-screen.
    if(this.bulletType === "shot_basic"){
        this.offsetY = -10;
    }
    this.phaserObject = this.game.physics.add.sprite(this.originX + this.offsetX, this.originY + this.offsetY, this.bulletType);
    this.phaserObject.setVelocityX(xVel);
    this.phaserObject.setVelocityY(yVel);
    this.velX = xVel;
    this.velY = yVel;
    bulletGroup.add(this.phaserObject);
    this.phaserObject.object = this;
    
    this.expire(2000);
}

Bullet.prototype.expire = function(setTime){ //A function that destroys the bullet phaser object within a set span of time.
    setTimeout(() => {
        this.phaserObject.play('expire_' + this.bulletType); //Plays the "death" animation of the bullet.
        setTimeout(() => {
            delete this.phaserObject.object;
            this.phaserObject.destroy();
            delete this;
        }, setTime * 0.25)
    }, setTime)
}

