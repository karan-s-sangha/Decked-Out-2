class SceneManager {
    constructor(game) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.camera = this;
        this.level = "Level_1_UpperView.png";
        this.scale = 1.5;
        this.levelX=-1500;
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
        if(level == this.level){
            let image = ASSET_MANAGER.cache[level];
            this.ctx.drawImage(image,-1500,0, image.width*this.scale, image.height*this.scale);
        }

    };

    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    update() {
    
        if(this.game.right){
            this.levelX -=4;
        }
        if(this.game.left){
            this.levelX +=4;
        }
        if(this.game.up){
            this.levelY +=4;

        }
        if(this.game.down){
            this.levelY -=4;

        }

        
    };

    draw(ctx) {
        let image = ASSET_MANAGER.cache[this.level];
        this.ctx.drawImage(image,this.levelX,this.levelY, image.width*this.scale, image.height*this.scale);
    };
};