function UI_Game(context){ //This is the game's user interface.
    this.game = context;
    this.score = new Counter_Score(this.game); //Score counter
    this.lives = new Counter(this.game, 'icon_life', 3, 10, 775, 225, 40, 40); //Life counter
    this.bombs = new Counter(this.game, 'icon_spell', 3, 10, 775, 275, 40, 40); //Bomb counter
    this.power = new Counter_Power(this.game, 0, 120, 750, 400); //Power counter
    this.uiBackground; //Background of the user-interface, variable placeholder.
}

UI_Game.prototype.setup = function(){ //Function for setting up the game's user interface.
    this.uiBackground = this.game.add.image(600, 450, 'UI_Back'); //Actually define the user interface's background.
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
    //I originally had intended each life to have a health bar, so that the player could take more hits, but that felt redundant so I cut it out.
}

UI_Game.prototype.setup_SpellCounter = function(){
    this.bombs.setup(); //Set up the bomb counter.
}

UI_Game.prototype.setup_LifeCounter = function(){
    this.lives.setup(); //Set up the life counter.
}

UI_Game.prototype.setup_PowerCounter = function(){
    this.power.setup(); //Set up the bomb counter.
}

UI_Game.prototype.update = function(){
    //Was originally the "update loop" for the game UI, but the way the design turned out, made this obsolete/unneeded.
}