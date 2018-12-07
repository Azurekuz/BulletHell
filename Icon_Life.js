function Icon_Life(context, spriteID, x, y){
    this.game = context;
    this.spriteID = spriteID;
    this.xLoc = x;
    this.yLoc = y;
    this.phaserObject = null;
}

Icon_Life.prototype.setup = function(){
    this.phaserObject = this.game.physics.add.sprite(this.xLoc, this.yLoc, this.spriteID);
}

Icon_Life.prototype.removeSelf = function(){
    this.phaserObject.destroy();
    delete this;
}