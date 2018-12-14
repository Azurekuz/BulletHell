function Counter_Power(context, initPower = 0, maxPower = 120, x, y){
    this.game = context;
    this.curPower = initPower; //The current power amount to display
    this.maxPower = maxPower; //How much power one can accumulate.
    this.format = new Number_Format("000"); //This is to maintain a certain number of digits, placing 0s for unused ones. So have 12 be displayed as 012, or 1 as 001, etc.
    this.xLoc = x;
    this.yLoc = y;
    
    this.phaserObject = null;
}

Counter_Power.prototype.setup = function(){ //Set the power coutner up.
    this.phaserObject = this.game.add.text(this.xLoc, this.yLoc, "Power: " + this.format.adhere(this.curPower.toString()) + "/" + this.maxPower.toString(), {fontFamily: 'Berlin Sans FB', fontSize: 35}); //Create the text object.
    this.phaserObject.depth = 2; //Keep the counter above the UI background.
}

Counter_Power.prototype.changePower = function(amount){ //Incrementally change the power amount, rather than overwriting the amount.
    if((this.curPower + amount) <= this.maxPower){
        this.curPower = this.curPower + amount;
        this.updateDisplay();
    }
}

Counter_Power.prototype.updatePower = function(newAmount){ //This actually overwrites the previous power amount with a new amount.
    this.curPower = newAmount;
    this.updateDisplay();
}

Counter_Power.prototype.updateDisplay = function(){ //Actually show the newly updated power counter to reflect the change.
    this.phaserObject.setText("Power: " + this.format.adhere(this.curPower).toString() + "/" + this.maxPower.toString());
}