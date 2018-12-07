class sceneBoot extends Phaser.Scene{
   constructor(){
        super({key: 'sceneBoot'});
    }

    preload(){
        this.load.image('menu', 'assets/ui/Menu.png');
    }

    create(){
        this.add.image(600, 450, 'menu');
        this.input.on('pointerdown', function () {
            this.input.stopPropagation();
            this.scene.start('sceneDebug');
        }, this);
    } 
};
    
class sceneDebug extends Phaser.Scene {
                
    constructor(){
        super({key: 'sceneDebug'});
    }
    
    preload(){ //The Preload function, only loads all the necessary files.
        this.gameMaterials = new GameMaterials(this);
    }
    
    create(){   
        this.gameMaterials.setup_Game();
        this.gameMaterials.setup_Stage01();
        console.log("Debug Stage Reached!");
    }
    
    update(){
        this.gameMaterials.update_Stage01();
    }
}

var config = {
        type: Phaser.AUTO,
        width: 1200,
        height: 900,
        scene: [ sceneBoot, sceneDebug],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
            },
        }
};

var game = new Phaser.Game(config);