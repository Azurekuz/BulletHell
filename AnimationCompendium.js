/***
* This is where all the animations are created and stored.
***/

function AnimationCompendium(context){
    this.game = context;
    
    this.game.anims.create({
        key: 'expire_shot_basic',
        frames: this.game.anims.generateFrameNumbers('shot_basic', {start: 0, end: 2}),
        frameRate: 3,
        repeat: 0
    });
    
    this.game.anims.create({
        key: 'expire_shot_pierce',
        frames: this.game.anims.generateFrameNumbers('shot_pierce', {start: 0, end: 2}),
        frameRate: 3,
        repeat: 0
    });
    
    this.game.anims.create({
        key: 'expire_shot_slice',
        frames: this.game.anims.generateFrameNumbers('shot_slice', {start: 0, end: 2}),
        frameRate: 3,
        repeat: 0
    });
    
    this.game.anims.create({
        key: 'expire_shot_enemyBasic',
        frames: this.game.anims.generateFrameNumbers('shot_enemyBasic', {start: 0, end: 2}),
        frameRate: 3,
        repeat: 0
    });
    
    this.game.anims.create({
        key: 'activeBomb',
        frames: this.game.anims.generateFrameNumbers('bombFilter', {start: 0, end: 8}),
        frameRate: 27,
        repeat: 0
    });
}