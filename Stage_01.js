function Stage_01(context, player, backgroundID, enemyArray){
    this.game = context;
    this.stageBackdropID = backgroundID;
    this.stageBackdrop;
    this.encounterArray = [];
    this.curEncounter = 0;
    this.spawnNew = false;
    this.isComplete = false;
    
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
    
    /*var newEnemy = new Enemy(this.game, 150, 'enemyChar',"sideSlide", "randomForward");
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
    this.enemyObjArray.push(newEnemy);*/
    
    this.setupEncounters();
    this.spawnEncounter();
    
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
        /*var newEnemy = new Enemy(this.game, 150, 'enemyChar',"sideSlide", "randomForward");
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
        this.enemyObjArray.push(newEnemy);*/
        
        this.curEncounter += 1;
        if(this.curEncounter < this.encounterArray.length){
           this.spawnEncounter();
        }else{
            this.isComplete = true;
        }
    }
}

Stage_01.prototype.spawnEncounter = function(){
    for(var i = 0; i < this.encounterArray[this.curEncounter].setArray.length; i += 1){
        var newEnemy = new Enemy(this.game, this.encounterArray[this.curEncounter].setArray[i].health, this.encounterArray[this.curEncounter].setArray[i].spriteID,this.encounterArray[this.curEncounter].setArray[i].movePattern, this.encounterArray[this.curEncounter].setArray[i].bulletPattern, this.encounterArray[this.curEncounter].setArray[i].bulletType, this.encounterArray[this.curEncounter].setArray[i].fireRate);
        newEnemy.setup(this.encounterArray[this.curEncounter].setArray[i].initXLoc, this.encounterArray[this.curEncounter].setArray[i].initYLoc, this.encounterArray[this.curEncounter].setArray[i].xVel, this.encounterArray[this.curEncounter].setArray[i].yVel);
        this.phaserGroup_enemies.add(newEnemy.phaserObject);
        this.enemyObjArray.push(newEnemy);
        
        console.log("Spawned: " + newEnemy.spriteID);
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

Stage_01.prototype.setupEncounters = function(){
    var newSet = new EnemySet();
    var newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 500, -16, 250, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 500, 690, 50, 200, 0);
    newSet.add(newData);
    
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 500, -150, 150, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 500, 750, 50, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "randomForward", "shot_enemyMed", 400, 323, -250, -150, 200);
    newSet.add(newData);
    
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "randomForward", "shot_enemyMed", 400, -150, -250, -150, 200);
    newSet.add(newData);
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "randomForward", "shot_enemyMed", 400, 750, -250, -150, 200);
    newSet.add(newData);
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 400, 750, 85, 200, 0);
    newSet.add(newData);
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 400, 750, 125, 200, 0);
    newSet.add(newData);
    newSet.add(newData);
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 400, -150, 100, 200, 0);
    newSet.add(newData);
    newSet.add(newData);
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "randomForward", "shot_enemyMed", 400, 323, -250, -150, 200);
    newSet.add(newData);
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "randomForward", "shot_enemyMed", 400, -150, -250, -150, 200);
    newSet.add(newData);
    newSet.add(newData);
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "randomForward", "shot_enemyMed", 400, 750, -250, -150, 200);
    newSet.add(newData);
    newSet.add(newData);
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyCharC', 150, "sideSlide", "radial", "shot_enemyBasic", 500, -250, 150, -150, 0);
    newSet.add(newData);
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 400, 750, 85, 200, 0);
    newSet.add(newData);
    newSet.add(newData);
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemySml", 400, -150, 115, 200, 0);
    newSet.add(newData);
    newSet.add(newData);
    newData = new SpawnData('enemyCharB', 150, "frenzy", "randomForward", "shot_enemyMed", 400, 323, -250, -150, 200);
    newSet.add(newData);
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "radial", "shot_enemySml", 450, 750, -150, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemyMed", 400, 750, 150, 200, 0);
    newSet.add(newData);
    newSet.add(newData);
    newData = new SpawnData('enemyChar', 150, "sideSlide", "randomForward", "shot_enemyMed", 400, -250, 150, 200, 0);
    newSet.add(newData);
    newSet.add(newData);
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "radial", "shot_enemySml", 400, 750, 150, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "radial", "shot_enemySml", 400, -250, 150, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('enemyCharC', 150, "frenzy", "randomForward", "shot_enemyBasic", 250, -250, -150, 200, 0);
    newSet.add(newData);
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('enemyCharB', 150, "sideSlide", "radial", "shot_enemySml", 400, 750, 150, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('enemyCharC', 150, "frenzy", "randomForward", "shot_enemyBasic", 250, -250, -150, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('enemyCharC', 150, "frenzy", "randomForward", "shot_enemyBasic", 250, 750, -150, 200, 0);
    newSet.add(newData);
    this.encounterArray.push(newSet);
    
    newSet = new EnemySet();
    newData = new SpawnData('boss01', 3500, "sideSlide", "radial", "shot_enemyBasic", 1200, 323, -450, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('boss01', 3500, "sideSlide", "radial", "shot_enemySml", 600, 323, -450, 200, 0);
    newSet.add(newData);
    newData = new SpawnData('boss01', 3500, "sideSlide", "randomForward", "shot_enemyMed", 450, 323, -450, 200, 0);
    newSet.add(newData);
    newSet.add(newData);
    newSet.add(newData);
    this.encounterArray.push(newSet);
}