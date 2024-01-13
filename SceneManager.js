class SceneManager {
    constructor(game) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.camera = this;
        this.level = "./Art/Level_1_UpperView_Art/Level_1_UpperView.png";
        this.waterAnimation;

        this.scale = 2;
        this.levelX=0;
        this.levelY=0;
    
        this.menuButtonCooldown = 0.15;

        //this.coinAnimation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 160, 8, 8, 4, 0.2, 0, false, true);
        this.loadLevel(this.level, 0, 0);
        
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };
    
    // loadLevel is supposed to have the introduction or title screen of the map

    loadLevel(level, x, y) {
      
           // Drawing the water Animation
           let water = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/water.png"];
           this.waterAnimation =  new Animator(water,0,0,1308,1860,24,120/1000,0,false,true);

    };

    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    update() {
    
        if(this.game.right){
            this.levelX -=8;
        }
        if(this.game.left){
            this.levelX +=8;
        }
        if(this.game.up){
            this.levelY +=8;

        }
        if(this.game.down){
            this.levelY -=8;

        }

        
    };

    draw(ctx) {
    
      
        // Drawing the Level one Map
        let levelImage = ASSET_MANAGER.cache[this.level];
        this.ctx.drawImage(levelImage,this.levelX,this.levelY, levelImage.width*this.scale, levelImage.height*this.scale);

        //constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        //    Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop });
        //drawFrame(tick, ctx, x, y, scale) {
       
        this.waterAnimation.drawFrame(this.game.clockTick,this.ctx,this.levelX,this.levelY,this.scale)   
        this.ctx.imageSmoothingEnabled = false;
    };
};