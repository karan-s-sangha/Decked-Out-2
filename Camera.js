class Camera {
    constructor(game) {
        this.game = game; // game = GameEngine
        this.ctx = game.ctx;
        this.game.camera = this;

        this.collision = new Collision(game);
        this.staticArt = new StaticArt(game);

        this.steveInitialX = 9; 
        this.steveInitialY = 28;   
        this.steveInitialZ = 14;   
        this.steve = new Steve(this.game, this.steveInitialX, this.steveInitialY, this.steveInitialZ);

        this.cameraX = this.steveInitialX - this.ctx.canvas.width / 2;
        this.cameraY = this.steveInitialY - this.ctx.canvas.height / 2;
        this.isoCameraX = 0;
        this.isoCameraY = 0;

        new SceneManager(this.game, this.steve);


        this.ravagers = [];
        this.ravagerPositions = [];
        this.levelX = 0;
        this.levelY = 0;
        this.menuButtonCooldown = 0.15;

        this.difficulty = new Difficulty(game);
        //this.ember = new FrostEmbers(this.game, this.steve);
        //this.gold = new Gold(this.game, this.steve);

        this.ui = new UI(this.steve, this.game);

        this.blocksMap = {}; // Use an object as a hash map to store block data as objects
        this.layerCount = 37; // Set the number of layers you want to read
        this.sizeFactor = 0.3;
        let image = ASSET_MANAGER.cache["./Art/resources/tnt.png"];
        this.imageWidth = image.width;
        this.imageHeight = image.height;

        this.blocksUnderPlayer = new BlocksUnderPlayer(this.staticArt);
        this.blocksAtOrAbovePlayer = new BlocksAtOrAbovePlayer(this.staticArt);

        this.initializeAndLoadLevel();

    };
    async initializeAndLoadLevel() {
        //console.log("In initialization");
        try {
            for (let i = 0; i < this.layerCount; i++) {
                const response = await fetch(`./map/layer_${i}.txt`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const text = await response.text();
                this.processTextFile(text);
            }
            this.loadLevel(this.steve); // Call loadLevel() after initialization completes
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }
    

    processTextFile(text) {
        const lines = text.split('\n');
        lines.forEach((line, index) => {
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
        // Adding the first upper level static art
        this.blocksUnderPlayer = new BlocksUnderPlayer(this.staticArt);
        this.blocksAtOrAbovePlayer = new BlocksAtOrAbovePlayer(this.staticArt);
       
       this.game.addEntity(this.staticArt);            
      
       this.game.addEntity(this.blocksUnderPlayer);    
       this.game.addEntity(steve);

    
       this.game.addEntity(this.blocksAtOrAbovePlayer);    
       this.addRavagers();
       this.game.addEntity(this.difficulty);


        //this.game.addEntity(this.ember);

        this.game.addEntity(this.ui);

    };

    addRavagers() {
    this.ravagerPositions = [
             { x: 75, y: 58, z: 14 },
             { x: 106, y: 60, z: 5 },
             { x : 58, y: 46, z :15 },
             { x: 22, y: 86, z: 11},
             { x: 117, y: 96, z: 15 },
             { x: 122, y: 29, z: 19 },
             { x: 83, y: 42, z: 19 },
             { x: 132, y: 55, z: 19 },
             { x: 58, y: 20, z: 19 }

        ];

        this.ravagerPositions.forEach(pos => {
            let ravager = new Ravager(this.game, this.steve, this.collision, pos.x, pos.y, pos.z, 0.3, 1, 0.25);
            this.game.addEntity(ravager);
            this.ravagers.push(ravager);
        });
    }

    // This update is for the whole website including the HTML 
    update() {
        // For Drawing Everyone At the right Location
        // Just Subtract isoCameraX and isoCameraY 

        this.cameraX = this.steve.playerX - this.ctx.canvas.width / 2;
        this.cameraY = this.steve.playerY - this.ctx.canvas.height / 2;


        //let blockImage = ASSET_MANAGER.cache[`./Art/resources/tnt.png`];
        let blockWidth = this.imageWidth * this.sizeFactor;
        let blockHeight = this.imageHeight * this.sizeFactor;

        let px = this.steve.playerX;
        let py = this.steve.playerY;
        let isoPlayerX = (px - py) * blockWidth / 2;
        let isoPlayerY = (px + py) * blockHeight / 4;

        this.isoCameraX = isoPlayerX - this.game.ctx.canvas.width / 2;
        this.isoCameraY = isoPlayerY - this.game.ctx.canvas.height / 2;


        // if win -> pause Camera then run scenemanagaer
        // if lose -> you have to stay in the Camera
        if (this.steve.live == false && this.steve.win) {
            this.game.play = false;
        }

    };

    updateDifficulty(level) {
        if (this.difficulty) {
            this.difficulty.setLevel(level); 
        }
    }

    // This Draw is for the whole website including the HTML 
    draw(ctx) {

    };

};