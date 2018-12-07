function UI_Game(context){
    this.game = context;
    this.score = new Counter_Score(this.game);
    this.lives = new Counter(this.game, 'icon_life', 3, 10, 775, 225, 40, 40);;
    this.bombs = new Counter(this.game, 'icon_spell', 3, 10, 775, 275, 40, 40);;
    this.power = new Counter_Power(this.game, 0, 120, 750, 400);
    this.uiBackground;
}

UI_Game.prototype.setup = function(){
    this.uiBackground = this.game.add.image(600, 450, 'UI_Back');
    this.uiBackground.depth = 1;
    this.setup_Score();
    this.setup_LifeCounter();
    this.setup_SpellCounter();
    this.setup_PowerCounter();
}

UI_Game.prototype.setup_Score = function(){
    this.score.setup();
}

UI_Game.prototype.setup_Health = function(){
    
}

UI_Game.prototype.setup_SpellCounter = function(){
    this.bombs.setup();
}

UI_Game.prototype.setup_LifeCounter = function(){
    this.lives.setup();
}

UI_Game.prototype.setup_PowerCounter = function(){
    this.power.setup();
}

UI_Game.prototype.update = function(){
    
}