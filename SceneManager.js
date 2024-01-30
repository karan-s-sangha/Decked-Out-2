class SceneManager {
    constructor(game) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.camera = this;
        
        this.steveInitialX = 1732;
        this.steveInitialY = 772;
        this.steve = new Steve(this.game , this.steveInitialX, this.steveInitialY, this);
        this.cameraX= this.steveInitialX - this.ctx.canvas.width/2;
        this.cameraY= this.steveInitialY -this.ctx.canvas.height/2;
        this.collision = new Collision(game);
       
       // this.ravager = new Ravager (this.game, this.steve, this.collision, 1300, 1100, 0.3, 1,50);

        this.levelX=0;
        this.levelY=0;
        this.menuButtonCooldown = 0.15;
        
        // Checking the Compass and the Artifact
        this.artifact = new Artifact(this.game);
        this.compass = new Compass(this.artifact,this.steve, this.game);
        this.ui = new UI(this.steve);
        
        
        //this.coinAnimation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 160, 8, 8, 4, 0.2, 0, false, true);
        this.loadLevel(this.steve, this.level, game.cameraWorldTopLeftX, game.cameraWorldTopLeftY);
        
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };
    
    // loadLevel is supposed to add the entities of the first level

    loadLevel(steve, level, x, y) {

       
        // Adding the first upper level static art
        this.game.addEntity(new StaticArt(this.game));

        // // Adding the first upper level dynamic art
        this.game.addEntity(new DynamicArt(this.game));
            
        this.game.addEntity(steve);

        this.addRavagers();

        //Adding the Compass Entity
        this.game.addEntity(this.compass);

        //Adding the Artifact Entity
        this.game.addEntity(this.artifact);
        this.game.addEntity(this.ui);
        
    };

    addRavagers() {
        const ravagerPositions = [
            { x: 756, y: 444 },
            { x: 1332, y: 2348 },
            { x: 556, y: 4572 },
            { x: 1468, y: 6348 },
            { x: 4078, y: 4852 },
            { x: 1740, y: 4252 },
            { x: 2460, y: 2532 },
            { x: 4116, y: 2124 },
            { x: 4324, y: 4884 },
            { x: 3972, y: 1204 },
            { x: 444, y: 2340 },
            { x: 3492, y: 2796 },
            { x: 2276, y: 6060 }
        ];
    
        ravagerPositions.forEach(pos => {
            let ravager = new Ravager(this.game, this.steve, this.collision, pos.x, pos.y, 0.3, 1, 50);
            this.game.addEntity(ravager);
        });
    }
    



    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    // This update is for the whole website including the HTML 
    update() {
       this.cameraX = this.steve.playerX - this.ctx.canvas.width/2;
       this.cameraY = this.steve.playerY - this.ctx.canvas.height/2;
       
    };

    // This Draw is for the whole website including the HTML 
    draw(ctx) {
       
    };
};