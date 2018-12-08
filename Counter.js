function Counter(context, spriteID, initLives, maxLives, x, y, spriteWidth, spriteHeight){
    this.game = context;
    this.spriteID = spriteID;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.defaultLives = initLives;
    this.curLives = initLives;
    this.maxLives = maxLives;
    this.xLoc = x;
    this.yLoc = y;
    this.iconArray = [];
    this.phaserGroup_Icons = this.game.add.group();
}

Counter.prototype.setup = function(){
    for(var i = this.xLoc; (i < (this.xLoc + (this.spriteWidth * this.curLives))) || i < this.maxLives; i += this.spriteWidth){
        this.createLife(i);
    }
}

Counter.prototype.updateDisplay = function(){
    
}

Counter.prototype.changeLifeAmount = function(amount){
    if(amount < 0){
       for(var i = this.iconArray.length - 1, left = amount; (i >= 0) && (left < 0) && (this.curLives > 0); left += 1, i -= 1){
           this.iconArray[i].removeSelf();
           this.iconArray.pop();
           this.curLives = this.curLives - 1;
       }
    }else if (amount > 0){
        for(var i = this.iconArray.length - 1, left = amount; (i <= this.iconArray.length) && (left > 0) && (this.curLives < this.maxLives); i += 1, left -= 1){
            if(this.iconArray.length > 0){
                this.createLife((this.iconArray[i].xLoc + this.spriteWidth));
                this.curLives = this.curLives + 1;
            }else{
                this.createLife((this.xLoc));
                this.curLives = this.curLives + 1;
            }
        }
    }
    this.updateDisplay();
}

Counter.prototype.createLife = function(xVal = this.xLoc, yVal = this.yLoc){
    var newIcon = new Icon_Life(this.game, this.spriteID, xVal, yVal);
    newIcon.setup();
    newIcon.phaserObject.depth = 2;
    this.iconArray.push(newIcon);
    this.phaserGroup_Icons.add(newIcon.phaserObject);
}

Counter.prototype.resetLife = function(){
    if(this.curLives > this.defaultLives){
        this.changeLifeAmount(-(this.curLives - this.defaultLives));
    }else if(this.curLives < this.defaultLives){
        this.changeLifeAmount((this.defaultLives - this.curLives));   
     }
}