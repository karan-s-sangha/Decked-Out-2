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
        this.ember = new FrostEmbers(this.game);
        //this.gold = new Gold(this.game);


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

        //this.addRavagers();

        //Adding the Compass Entity
        this.game.addEntity(this.compass);

        //Adding the Artifact Entity
        this.game.addEntity(this.artifact);
        //this.game.addEntity(this.gold);
        //Adding the coins 

        this.game.addEntity(this.ui);
        
    };

    addRavagers() {
        
       let ravager1 = new Ravager(this.game, this.steve, this.collision, 756, 444, 0.3, 1, 50);
        let ravager2 = new Ravager(this.game, this.steve, this.collision, 1332, 2348, 0.3, 1, 50);
        let ravager3 = new Ravager(this.game, this.steve, this.collision, 556, 4572, 0.3, 1, 50);
        let ravager4 = new Ravager(this.game, this.steve, this.collision, 1468, 6348, 0.3, 1, 50);
        let ravager5 = new Ravager(this.game, this.steve, this.collision, 4078, 4852, 0.3, 1, 50);
        let ravager6 = new Ravager(this.game, this.steve, this.collision, 1740, 4252, 0.3, 1, 50);
        let ravager7 = new Ravager(this.game, this.steve, this.collision, 2460, 2532, 0.3, 1, 50);
        let ravager8 = new Ravager(this.game, this.steve, this.collision, 4116, 2124, 0.3, 1, 50);
       let ravager9 = new Ravager(this.game, this.steve, this.collision, 4324, 4884, 0.3, 1, 50);
       let ravager10 = new Ravager(this.game, this.steve, this.collision, 3972, 1204, 0.3, 1, 50);
       let ravager11 = new Ravager(this.game, this.steve, this.collision, 444, 2340, 0.3, 1, 50);
       let ravager12 = new Ravager(this.game, this.steve, this.collision, 3492, 2796, 0.3, 1, 50);
       let ravager13 = new Ravager(this.game, this.steve, this.collision, 2276, 6060, 0.3, 1, 50);

       this.game.addEntity(ravager1);
        this.game.addEntity(ravager2);
        this.game.addEntity(ravager3);
       this.game.addEntity(ravager4);
        this.game.addEntity(ravager5);
        this.game.addEntity(ravager6);
        this.game.addEntity(ravager7);
        this.game.addEntity(ravager8);
        this.game.addEntity(ravager9);
       this.game.addEntity(ravager10);
       this.game.addEntity(ravager11);
       this.game.addEntity(ravager12);
       this.game.addEntity(ravager13);
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