class SceneManager {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.game.camera = this;
        this.level = "Level_1_UpperView.png";
    
        this.menuButtonCooldown = 0.15;

        //this.coinAnimation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 160, 8, 8, 4, 0.2, 0, false, true);
        this.loadLevel(this.level, 0, 0);


        
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    loadLevel(level, x, y) {
        if(level == this.level){
            this.ctx.drawImage(ASSET_MANAGER.cache[level],0,0, this.ctx.canvas.width,this.ctx.canvas.height);
        }

    };

    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    update() {
    };

    draw(ctx) {
        
    };
};