// class StaticArt {
//     constructor(game) {
//         Object.assign(this, { game});
//         this.staticArtX= 0;
//         this.staticArtY= 0;
//     };

//     update() {
//     };

//     draw(ctx) {

//         let levelImage = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/Level_1_UpperView.png"];
//             ctx.drawImage(levelImage, 

//             (this.game.camera.cameraX)/this.game.GameScale, (this.game.camera.cameraY)/this.game.GameScale, 
//             this.game.ctx.canvas.width/this.game.GameScale, this.game.ctx.canvas.height/this.game.GameScale, 

//             0, 0, 
//             this.game.ctx.canvas.width, this.game.ctx.canvas.height, 
//             );
//     };
// };


class StaticArt {
    constructor(game) {
        Object.assign(this, { game });
        this.text = "";
        this.charactersArray = [];
        //this.initialize();
    }

    initialize() {
        console.log("Hello from initialization");
        this.readTextFile('./Art/Map/testMap0.txt');
        this.readTextFile('./Art/Map/testMap1.txt');

    }

    async readTextFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.text = await response.text();
            this.processTextFile(filePath);
        } catch (error) {
            console.error("Error loading the text file:", error);
        }
    }

    processTextFile(filePath) {
        //this.charactersArray = [];
        const fileNameNumber = this.extractFileNameNumber(filePath); // Assuming file name is known or passed differently

        let y = 0, x = 0;

        for (let i = 0; i < this.text.length; i++) {
            let char = this.text[i];
            if (char === '\n') {
                y++; x = 0;
            } else {
                this.charactersArray.push([x, y, parseInt(fileNameNumber, 10), char]);
                x++;
            }
        }
        //this.printCharactersWithCoordinates();
    }

    extractFileNameNumber(fileName) {
        return fileName.replace(/\D/g, '');
    }

    printCharactersWithCoordinates() {
        for (const [x, y, z, char] of this.charactersArray) {
            console.log(`Character at (${x}, ${y}, ${z}): ${char}`);
        }
    }

    update(){

    }
    draw(ctx) {
        let compression = 1; // Adjust based on your need for the image size
        let blockImage = ASSET_MANAGER.cache["./Art/Blocks/BlockOfGold.png"]; // Ensure this is preloaded
    
        // Check if blockImage is loaded
        if (!blockImage || blockImage.width === 0 || blockImage.height === 0) {
            console.error('Block image not loaded');
            return;
        }
    
        // Adjust these based on your game's design, no need to compress if your assets fit the game scale
        const blockWidth = blockImage.width / compression;
        const blockHeight = blockImage.height / compression;
    
        const halfBlockWidth = blockWidth / 2;
        const halfBlockHeight = blockHeight / 2;
    
        this.charactersArray.forEach(([x, y, z, char]) => {
            if (char === '0') {
                // Adjusting for camera
                console.log("x", x);
                console.log("y", y);
                console.log("this.game.camera.cameraX", this.game.camera.cameraX);
                console.log("this.game.camera.cameraY", this.game.camera.cameraY);
           

                let cameraAdjustedX = x - this.game.camera.cameraX;
                let cameraAdjustedY = y - this.game.camera.cameraY;
                console.log("cameraAdjustedX", cameraAdjustedX);
                console.log("cameraAdjustedY", cameraAdjustedY);

                // Convert to isometric
                let isoX = (cameraAdjustedX - cameraAdjustedY) * halfBlockWidth;
                let isoY = (cameraAdjustedX + cameraAdjustedY) * halfBlockHeight / 2 - z * halfBlockHeight; // Adjust for z-axis
    
                console.log("isoX", isoX);
                console.log("isoY", isoY);
 
                // Draw the block
                ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
            }
        });
    }    
}
