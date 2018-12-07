function Counter_Score(context, initScore = 0){
    this.game = context;
    this.curScore = initScore;
    this.phaserObject = null;
    this.format = new Number_Format("000000000000");
    this.nextLife = 10000;
    this.curNext = this.nextLife;
}

Counter_Score.prototype.setup = function(){
    this.phaserObject = this.game.add.text(750, 150, this.format.adhere(this.curScore.toString()), {fontFamily: 'Berlin Sans FB', fontSize: 45});
    this.phaserObject.depth = 2;
}

Counter_Score.prototype.changeScore = function(amount){
    this.curScore = this.curScore + amount;
    if(amount > 0){
        this.curNext = this.curNext - amount;
        this.checkNext();
    }
    this.updateDisplay();
}

Counter_Score.prototype.updateDisplay = function(){
    this.phaserObject.setText(this.format.adhere(this.curScore.toString()));
}

Counter_Score.prototype.checkNext = function(){
    if(this.curNext <= 0){
        this.nextLife = this.nextLife * 2;
        this.curNext = -(this.curNext) + this.nextLife;
        this.game.gameUI.lives.changeLifeAmount(1);
    }
}