function Bullet(context, xPos, yPos, spriteID, offsetX = 0, offsetY = 0, baseDamage = 10){
    this.game = context;
    this.originX = xPos;
    this.originY = yPos;
    this.velX;
    this.velY;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.bulletType = spriteID;
    this.typePower = 0;
    this.phaserObject = null;
    this.baseDamage = baseDamage;
}

Bullet.prototype.create = function(bulletGroup,xVel = 0, yVel = -600){
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

Bullet.prototype.expire = function(setTime){
    setTimeout(() => {
        this.phaserObject.play('expire_' + this.bulletType);
        setTimeout(() => {
            delete this.phaserObject.object;
            this.phaserObject.destroy();
            delete this;
        }, setTime * 0.25)
    }, setTime)
}

