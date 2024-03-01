class Camera {
    constructor(game) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.camera = this;

        this.collision = new Collision(game);
        // this.steveInitialX = 0; 
        // this.steveInitialY = 0;   
        // this.steveInitialZ = 1;   
        //75   58   14
        this.steveInitialX = 75; 
        this.steveInitialY = 58;   
        this.steveInitialZ = 14;   
        this.steve = new Steve(this.game , this.steveInitialX, this.steveInitialY,this.steveInitialZ );
        
        this.cameraX= this.steveInitialX - this.ctx.canvas.width/2;
        this.cameraY= this.steveInitialY -this.ctx.canvas.height/2;
        this.isoCameraX = 0;
        this.isoCameraY = 0;
        
        this.staticArt = new StaticArt(game);   
        
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

        this.blocksMap = {}; // Use an object as a hash map to store block data as objects
        this.layerCount = 37; // Set the number of layers you want to read
        this.sizeFactor = 2;
        let image = ASSET_MANAGER.cache["./Art/resources/tnt.png"];
        this.imageWidth = image.width;
        this.imageHeight = image.height;
        this.initialize();
        
        //this.coinAnimation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 160, 8, 8, 4, 0.2, 0, false, true);
        this.loadLevel(this.steve, this.level, game.cameraWorldTopLeftX, game.cameraWorldTopLeftY);
        
    };
    async initialize() {
        console.log("In initialization");
        let temp = 20;
        for (let i = 0; i <  this.layerCount; i++) {
            try {
                const response = await fetch(`./map/layer_${i}.txt`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const text = await response.text();
                this.processTextFile(text);
            } catch (error) {
                console.error(`Error loading the text file for layer ${i}:`, error);
            }
        }
    }

    processTextFile(text) {
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            //console.log(line);
            const parts = line.split(':');
            if (parts.length === 2) {
                const label = parts[0].trim();
                const [x, y, z] = parts[1].trim().slice(1, -1).split(',').map(Number);
                // Use a unique key for each block, e.g., by serializing x, y, z coordinates
                const key = `${x},${y},${z}`;
                this.blocksMap[key] = { label, x, y, z };
            } else {
                console.error(`Invalid format in line ${index + 1}: ${line}`);
            }
        });
    }

    // Example method to retrieve a block by its coordinates
    getBlock(x, y, z) {
        const key = `${x},${y},${z}`;
        return this.blocksMap[key]; // Fast lookup
    }
    
    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };
    
    // loadLevel is supposed to add the entities of the first level

    loadLevel(steve) {
         // // Adding the first upper level dynamic art
        //this.game.addEntity(new DynamicArt(this.game));


        // Adding the first upper level static art
       this.game.addEntity(this.staticArt);

       this.blocksUnderPlayer = new BlocksUnderPlayer(this.game);
       this.game.addEntity(blocksUnderPlayer);
      
       this.game.addEntity(steve);

       this.blocksAtOrAbovePlayer = new BlocksAtOrAbovePlayer(this.game);
       this.game.addEntity(blocksAtOrAbovePlayer);


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
                //{ x: 1, y: 0, z: 0 }
                //{ x: 1, y: 10, z: 0 },
               { x: 0, y: 0, z: 1 }
                /*{ x: 1332, y: 2348, z: 1 },
                { x: 556, y: 4572, z: 2 },
                { x: 1468, y: 6348, z: 3 },
                { x: 4078, y: 4852, z: 4 },
                { x: 1740, y: 4252, z: 0 },
                { x: 2460, y: 2532, z: 5 },
                { x: 4116, y: 2124, z: 0 },
                { x: 4324, y: 4884, z: 0 },
                { x: 3972, y: 1204, z: 0 },
                { x: 444, y: 2340, z: 0 },
                { x: 3492, y: 2796, z: 0 },
                { x: 2276, y: 6060, z: 0 }*/
        
        ];
    
        this.ravagerPositions.forEach(pos => {
            let ravager = new Ravager(this.game, this.steve, this.collision, pos.x, pos.y, pos.z, 0.3, 1, 0.25);
            this.game.addEntity(ravager);
            this.ravagers.push(ravager);
        });
    }

    // This update is for the whole website including the HTML 
    update() {
    //    // console.log(this.steve.playerX, this.steve.playerY);
    //     if (this.steve.jumped) {
    //         let x = this.steve.playerX / this.game.GameScale;
    //         let y = this.steve.playerY / this.game.GameScale;
    //         let z = this.steve.playerZ / this.game.GameScale; // Assuming Steve has a Z position
    //         let newRavX = [];
    //         let newRavY = [];
    //         let newRavZ = []; // Store new Z positions for ravagers
    
    //         this.ravagers.forEach(rav => {
    //             newRavX.push(rav.ravagerX / this.game.GameScale);
    //             newRavY.push(rav.ravagerY / this.game.GameScale);
    //             newRavZ.push(rav.ravagerZ / this.game.GameScale); // Adjust for Z
    //         });
    
    //         if (this.game.GameScale > 3.6 && !this.steve.jumpComplete) {
    //             this.game.GameScale -= this.game.clockTick * 1.5;
    //             this.ravagers.forEach(rav => {
    //                 rav.size -= this.game.clockTick * 0.1;
    //             });
    //         } else {
    //             this.steve.jumpComplete = true;
    //         }
    
    //         if (this.game.GameScale < 4 && this.steve.jumpComplete) {
    //             this.game.GameScale += this.game.clockTick * 1.5;
    //             this.ravagers.forEach(rav => {
    //                 rav.size += this.game.clockTick * 0.1;
    //             });
    //         }
    
    //         if (this.steve.jumpComplete && this.game.GameScale >= 4) {
    //             this.steve.jumped = false;
    //         }
    
    //         this.steve.playerX = x * this.game.GameScale;
    //         this.steve.playerY = y * this.game.GameScale;
    //         this.steve.playerZ = z * this.game.GameScale; // Scale Steve's Z
    
    //         for (let i = 0; i < this.ravagers.length; i++) {
    //             this.ravagers[i].ravagerX = newRavX[i] * this.game.GameScale;
    //             this.ravagers[i].ravagerY = newRavY[i] * this.game.GameScale;
    //             this.ravagers[i].ravagerZ = newRavZ[i] * this.game.GameScale; // Scale Ravager's Z
    //         }
    //     }
        
        // For Drawing Everyone At the right Location
        // Just Subtract isoCameraX and isoCameraY 

        this.cameraX = this.steve.playerX - this.ctx.canvas.width/2;
        this.cameraY = this.steve.playerY - this.ctx.canvas.height/2;
        
        
        //let blockImage = ASSET_MANAGER.cache[`./Art/resources/tnt.png`];
        let blockWidth = this.imageWidth * this.sizeFactor;
        let blockHeight = this.imageHeight * this.sizeFactor;

        let px = this.steve.playerX;
        let py = this.steve.playerY;
        let isoPlayerX = (px - py) * blockWidth / 2;
        let isoPlayerY = (px + py) * blockHeight / 4;
      
        this.isoCameraX =  isoPlayerX - this.game.ctx.canvas.width / 2;
        this.isoCameraY =  isoPlayerY - this.game.ctx.canvas.height / 2 ;



        if (this.steve.live == false){
            this.game.play = false;
        }

    };

    // This Draw is for the whole website including the HTML 
    draw(ctx) {
       
    };

};