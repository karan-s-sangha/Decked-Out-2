class Camera {
    constructor(game) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.camera = this;

        this.collision = new Collision(game);
        this.staticArt = new StaticArt(game);   
        
        this.steveInitialX = 0; 
        this.steveInitialY = 0;   
        this.steveInitialZ = 0;   
        this.steve = new Steve(this.game , this.steveInitialX, this.steveInitialY,this.steveInitialZ );
        
        this.cameraX= this.steveInitialX - this.ctx.canvas.width/2;
        this.cameraY= this.steveInitialY -this.ctx.canvas.height/2;
        
        new SceneManager(this.game, this.steve);

        this.ravagers = [];
        this.ravagerPositions = [];
        this.levelX=0;
        this.levelY=0;
        this.menuButtonCooldown = 0.15;

        
        // Checking the Compass and the Artifact
        this.artifact = new Artifact(this.game, this.steve);
        this.ember = new FrostEmbers(this.game, this.steve);
        //this.gold = new Gold(this.game, this.steve);

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

    loadLevel(steve) {
        
        // Adding the first upper level static art
       this.game.addEntity(this.staticArt);

        // // Adding the first upper level dynamic art
  //     this.game.addEntity(new DynamicArt(this.game));
            
      
       this.game.addEntity(steve);

       //this.addRavagers();

        //Adding the Compass Entity
       this.game.addEntity(this.compass);

        //Adding All the Item Entity
       this.game.addEntity(this.artifact);
    
       this.game.addEntity(this.ember);


       this.game.addEntity(this.ui);
        
    };

    addRavagers() {
        this.ravagerPositions = [
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
    
        this.ravagerPositions.forEach(pos => {
            let ravager = new Ravager(this.game, this.steve, this.collision, pos.x, pos.y, 0.3, 1, 50);
            this.game.addEntity(ravager);
            this.ravagers.push(ravager);
        });
    }

    // This update is for the whole website including the HTML 
    update() {
      

        if(this.steve.jumped) {
            let x = this.steve.playerX / this.game.GameScale;
            let y = this.steve.playerY / this.game.GameScale;
            let newRavX = [];
            let newRavY = [];

            this.ravagers.forEach(rav => {
                newRavX.push(rav.ravagerX / this.game.GameScale);
                newRavY.push(rav.ravagerY / this.game.GameScale);
            });


            if(this.game.GameScale > 3.6 && !this.steve.jumpComplete) {
                this.game.GameScale -= this.game.clockTick * 1.5; 
                this.ravagers.forEach(rav => {
                    rav.size -= this.game.clockTick * 0.1;
                });
            } else {
                this.steve.jumpComplete = true;
            }

            if(this.game.GameScale < 4 && this.steve.jumpComplete) {
                this.game.GameScale += this.game.clockTick * 1.5;
                this.ravagers.forEach(rav => {
                    rav.size += this.game.clockTick * 0.1;
                });
            }

            if(this.steve.jumpComplete && this.game.GameScale >= 4) {
                this.steve.jumped = false;
            }
            this.steve.playerX = x * this.game.GameScale;
            this.steve.playerY = y * this.game.GameScale;      
            
            for(let i = 0; i < this.ravagers.length; i++) {
                this.ravagers[i].ravagerX = newRavX[i] * this.game.GameScale;
                this.ravagers[i].ravagerY = newRavY[i] * this.game.GameScale;
            }

        }
        
        this.cameraX = this.steve.playerX - this.ctx.canvas.width/2;
        this.cameraY = this.steve.playerY - this.ctx.canvas.height/2;
        if (this.steve.live == false){
            this.game.play = false;
        }

    };

    // This Draw is for the whole website including the HTML 
    draw(ctx) {
       
    };

};