function Counter(context, spriteID, initLives, maxLives, x, y, spriteWidth, spriteHeight){ //This is a user interface object initially meant to track lives. 
    //However, I also realized I'm able to reuse the code to also track bombs.
    this.game = context;
    this.spriteID = spriteID; //What icon/sprite are going to be used for the counter.
    //The dimensions of the icon/sprite are used to properly update the counter when placing or removing icons as needed.
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.defaultLives = initLives; //What number of "lives" is the default? This is primarily used for bombs, since each life is, by default, given 3.
    this.curLives = initLives;
    this.maxLives = maxLives;
    //Location of the counter UI.
    this.xLoc = x; 
    this.yLoc = y;
    this.iconArray = [];
    this.phaserGroup_Icons = this.game.add.group();
}

Counter.prototype.setup = function(){ //This initializes the counter.
    for(var i = this.xLoc; (i < (this.xLoc + (this.spriteWidth * this.curLives))) || i < this.maxLives; i += this.spriteWidth){
        this.createLife(i);
    }
}

Counter.prototype.updateDisplay = function(){
    //An update loop for the counter rendered obsolete by the fact that other functions do this already in such a way where a loop isn't needed.
}

Counter.prototype.changeLifeAmount = function(amount){ //This function either adds or subtracts an amount from the counter, and then updates the display.
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

Counter.prototype.createLife = function(xVal = this.xLoc, yVal = this.yLoc){ //Adds another icon to the counter.
    var newIcon = new Icon_Life(this.game, this.spriteID, xVal, yVal);
    newIcon.setup();
    newIcon.phaserObject.depth = 2;
    this.iconArray.push(newIcon);
    this.phaserGroup_Icons.add(newIcon.phaserObject);
}

Counter.prototype.resetLife = function(){ //This resets a counter to its default amount. Primarily used for the bomb counter.
    if(this.curLives > this.defaultLives){
        this.changeLifeAmount(-(this.curLives - this.defaultLives));
    }else if(this.curLives < this.defaultLives){
        this.changeLifeAmount((this.defaultLives - this.curLives));   
     }
}