/* 
    This is the main.js file, which is where the Phaser object is created along with the necessary scenes. We start from SceneBoot, which is simply the title screen. Once the player clicks using their mouse, sceneDebug is run, which is the game itself.
*/
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
        /* This is the creation of the game itself with all its assets and functions.*/
        this.gameMaterials = new GameMaterials(this);
    }
    
    create(){   
        //The game and all necessary parameters are setup using this function.
        this.gameMaterials.setup_Game();
        //The first stage is created and setup afterwards.
        this.gameMaterials.setup_Stage01();
    }
    
    update(){
        //This is the update loop which constantly updates the first stage.
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