function Item_PowerUp(context, xPos, yPos){
    this.game = context;
    this.xLoc = xPos;
    this.yLoc = yPos;
}

Item_PowerUp.prototype.create = function(){
    this.phaserObject = this.game.physics.add.sprite(this.xLoc, this.yLoc, "powUp");
    this.phaserObject.setVelocityY(-450);
}