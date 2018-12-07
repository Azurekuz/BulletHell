function Counter_Power(context, initPower = 0, maxPower = 120, x, y){
    this.game = context;
    this.curPower = initPower;
    this.maxPower = maxPower;
    this.format = new Number_Format("000");
    this.xLoc = x;
    this.yLoc = y;
    
    this.phaserObject = null;
}

Counter_Power.prototype.setup = function(){
    this.phaserObject = this.game.add.text(this.xLoc, this.yLoc, "Power: " + this.format.adhere(this.curPower.toString()) + "/" + this.maxPower.toString(), {fontFamily: 'Berlin Sans FB', fontSize: 35});
    this.phaserObject.depth = 2;
}

Counter_Power.prototype.changePower = function(amount){
    if((this.curPower + amount) <= this.maxPower){
        this.curPower = this.curPower + amount;
        this.updateDisplay();
    }
}

Counter_Power.prototype.updatePower = function(newAmount){
    this.curPower = newAmount;
    this.updateDisplay();
}

Counter_Power.prototype.updateDisplay = function(){
    this.phaserObject.setText("Power: " + this.format.adhere(this.curPower).toString() + "/" + this.maxPower.toString());
}