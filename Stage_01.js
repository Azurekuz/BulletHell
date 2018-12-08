function Stage_01(context, player, backgroundID, enemyArray){
    this.game = context;
    this.stageBackdropID = backgroundID;
    this.stageBackdrop;
    this.bd_layer1;
    this.bd_layer2;
    this.bd_layer3;
    this.bd_layer4;
    this.bd_layer5;
    
    this.bd_layer1B = null;
    this.bd_layer2B = null;
    this.bd_layer3B = null;
    this.bd_layer4B = null;
    this.bd_layer5B = null;
    this.phaserGroup_enemies = this.game.add.group();
    this.enemyObjArray = [];
}

Stage_01.prototype.setup = function(){
    /*this.stageBackdrop = this.game.add.image(360, 452, this.stageBackdropID);
    this.stageBackdrop.depth = 0;*/
    
    this.bd_layer1 = this.game.add.image(360, -1606, "bd_lay1");
    this.bd_layer1.depth = -1;
    this.bd_layer2 = this.game.add.image(360, -1606, "bd_lay2");
    this.bd_layer2.depth = -2;
    this.bd_layer3 = this.game.add.image(360, -1606, "bd_lay3");
    this.bd_layer3.depth = -3;
    this.bd_layer4 = this.game.add.image(360, -1606, "bd_lay4");
    this.bd_layer4.depth = -4;
    this.bd_layer5 = this.game.add.image(360, -1606, "bd_lay5");
    this.bd_layer5.depth = -5;
    //this.setup_Border();
    var newEnemy = new Enemy(this.game, 150, 'enemyChar',"sideSlide", "randomForward");
    newEnemy.setup(-16, 250, -150, 200);
    this.phaserGroup_enemies.add(newEnemy.phaserObject);
    this.enemyObjArray.push(newEnemy);
    
    var newEnemy = new Enemy(this.game, 150, 'enemyCharB',"sideSlide", "radial", "shot_enemyMed", 500);
    newEnemy.setup(690, 125);
    this.phaserGroup_enemies.add(newEnemy.phaserObject);
    this.enemyObjArray.push(newEnemy);
    
    var newEnemy = new Enemy(this.game, 150, 'enemyCharC',"frenzy", "randomForward", "shot_enemySml", 150);
    newEnemy.setup(-32, 375, 200, -150);
    this.phaserGroup_enemies.add(newEnemy.phaserObject);
    this.enemyObjArray.push(newEnemy);
    
    this.game.screenFilter = this.game.physics.add.sprite(360, 452, 'bombFilter');
    this.game.screenFilter.depth = 0;
    this.game.screenFilter.frame = 8;
}

Stage_01.prototype.update = function(){
    this.update_Enemies();
    this.moveBackdrop();
    this.checkLayers();
}

Stage_01.prototype.update_Enemies = function(){
    for(var i = 0; i < this.enemyObjArray.length; i += 1){
        this.enemyObjArray[i].update();
        if(this.enemyObjArray[i].health <= 0){
            delete this.enemyObjArray[i];
            var temp = this.enemyObjArray[this.enemyObjArray.length - 1];
            this.enemyObjArray[this.enemyObjArray.length - 1] = this.enemyObjArray[i];
            this.enemyObjArray[i] = temp;
            this.enemyObjArray.pop();
        }
    }
    if(this.enemyObjArray.length == 0){
        var newEnemy = new Enemy(this.game, 150, 'enemyChar',"sideSlide", "randomForward");
        newEnemy.setup(-16, 250, -150, 200);
        this.phaserGroup_enemies.add(newEnemy.phaserObject);
        this.enemyObjArray.push(newEnemy);

        var newEnemy = new Enemy(this.game, 150, 'enemyCharB',"sideSlide", "radial", "shot_enemyMed", 500);
        newEnemy.setup(690, 125);
        this.phaserGroup_enemies.add(newEnemy.phaserObject);
        this.enemyObjArray.push(newEnemy);

        var newEnemy = new Enemy(this.game, 150, 'enemyCharC',"frenzy", "randomForward", "shot_enemySml", 150);
        newEnemy.setup(-32, 375, 200, -150);
        this.phaserGroup_enemies.add(newEnemy.phaserObject);
        this.enemyObjArray.push(newEnemy);
    }
}

Stage_01.prototype.moveBackdrop = function(){
    this.bd_layer1.y += 0.5*10;
    this.bd_layer2.y += 0.48*10;
    this.bd_layer3.y += 0.4*10;
    this.bd_layer4.y += 0.38*10;
    this.bd_layer5.y += 0.3*10;
    
    if(this.bd_layer1B != null){
        this.bd_layer1B.y += 0.5*10; 
    }
    if(this.bd_layer2B != null){
        this.bd_layer2B.y += 0.48*10;
    }
    if(this.bd_layer3B != null){
        this.bd_layer3B.y += 0.4*10;
    }
    if(this.bd_layer4B != null){
        this.bd_layer4B.y += 0.38*10;
    }
    if(this.bd_layer5B != null){
        this.bd_layer5B.y += 0.3*10;
    }
}

Stage_01.prototype.checkLayers = function(){
   if(this.bd_layer1.y >= 2520 && this.bd_layer1B == null){
        this.bd_layer1B = this.game.add.image(360, -2474, "bd_lay1");
        this.bd_layer1B.depth = -1;
    }else if(this.bd_layer1.y >= 3405){
        this.bd_layer1.y = this.bd_layer1B.y;
        this.bd_layer1B.destroy();
        delete this.bd_layer1B;
        this.bd_layer1B = null;
    }
    
    if(this.bd_layer2.y >= 2520 && this.bd_layer2B == null){
        this.bd_layer2B = this.game.add.image(360, -2474, "bd_lay2");
        this.bd_layer2B.depth = -2;
    }else if(this.bd_layer2.y >= 3405){
        this.bd_layer2.y = this.bd_layer2B.y;
        this.bd_layer2B.destroy();
        delete this.bd_layer2B;
        this.bd_layer2B = null;
    }
    
    if(this.bd_layer3.y >= 2520 && this.bd_layer3B == null){
        this.bd_layer3B = this.game.add.image(360, -2474, "bd_lay3");
        this.bd_layer3B.depth = -3;
    }else if(this.bd_layer3.y >= 3405){
        this.bd_layer3.y = this.bd_layer3B.y;
        this.bd_layer3B.destroy();
        delete this.bd_layer3B;
        this.bd_layer3B = null;
    }
    
    if(this.bd_layer4.y >= 2520 && this.bd_layer4B == null){
        this.bd_layer4B = this.game.add.image(360, -2474, "bd_lay4");
        this.bd_layer4B.depth = -4;
    }else if(this.bd_layer4.y >= 3405){
        this.bd_layer4.y = this.bd_layer4B.y;
        this.bd_layer4B.destroy();
        delete this.bd_layer4B;
        this.bd_layer4B = null;
    }
    
    if(this.bd_layer5.y >= 2520 && this.bd_layer5B == null){
        this.bd_layer5B = this.game.add.image(360, -2474, "bd_lay5");
        this.bd_layer5B.depth = -5;
    }else if(this.bd_layer5.y >= 3405){
        this.bd_layer5.y = this.bd_layer5B.y;
        this.bd_layer5B.destroy();
        delete this.bd_layer5B;
        this.bd_layer5B = null;
    }
      
}