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


// class StaticArt {
//     constructor(game) {
//         Object.assign(this, { game });
//         this.text = "";
//         this.charactersArray = [];
//         //this.initialize();
//     }

//     initialize() {
//         console.log("Hello from initialization");
//         for(let i = 0; i < 3; i++) {
//             this.readTextFile('./map/layer_-' + i + '.txt');
//         }
//         this.readTextFile('./Art/Map/testMap0.txt');
//         this.readTextFile('./Art/Map/testMap1.txt');

//     }

//     async readTextFile(filePath) {
//         try {
//             const response = await fetch(filePath);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//             this.text = await response.text();
//             this.processTextFile(filePath);
//         } catch (error) {
//             console.error("Error loading the text file:", error);
//         }
//     }

//     processTextFile(filePath) {
//         //this.charactersArray = [];
//         const fileNameNumber = this.extractFileNameNumber(filePath); // Assuming file name is known or passed differently

//         let y = 0, x = 0;

//         for (let i = 0; i < this.text.length; i++) {
//             let char = this.text[i];
//             if (char === '\n') {
//                 y++; x = 0;
//             } else {
//                 this.charactersArray.push([x, y, parseInt(fileNameNumber, 10), char]);
//                 x++;
//             }
//         }
//         //this.printCharactersWithCoordinates();
//     }

//     extractFileNameNumber(fileName) {
//         return fileName.replace(/\D/g, '');
//     }

//     printCharactersWithCoordinates() {
//         for (const [x, y, z, char] of this.charactersArray) {
//             console.log(`Character at (${x}, ${y}, ${z}): ${char}`);
//         }
//     }

//     update(){

//     }
//     draw(ctx) {
        
//         let compression = 3;
//          // Assuming you have the images loaded and accessible, for example:
//         let blockImage = ASSET_MANAGER.cache["./Art/Blocks/BlockOfGold.png"];

//         // const blockWidth = 268/compression;
//         // const blockHeight = 298/compression;
//         const blockWidth = blockImage.width/compression;
//         const blockHeight = blockImage.height/compression;


//         const halfBlockWidth = blockWidth / 2;
//         const halfBlockHeight = blockHeight / 2;
    
    
//         this.charactersArray.forEach(([x, y, z, char]) => {
//             if (char === '0') {
//                 // Convert grid coordinates to isometric screen coordinates
//                 let isoX = (x - y) * halfBlockWidth;
//                 let isoY = (x + y) * halfBlockHeight / 2; // Dividing by 2 to flatten the isometric height
    
//                 // Adjusting the position to center or offset your drawing as necessary
//                 isoX += this.game.ctx.canvas.width / 2 - halfBlockWidth; // Centering the drawing horizontally
//                 isoY += this.game.ctx.canvas.height / 4; // Adjust vertical offset as needed
    
//                 //Allowing the Steve to move around
//                 isoX -= this.game.camera.cameraX;
//                 isoY -= this.game.camera.cameraY;

//                 //Adding Layer or Adding z tiles to the Map
//                 //isoX += z * blockHeight;
//                 isoY -= z * halfBlockHeight;
//                 console.log(z);

//                 // Draw the isometric block image
//                 ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
//                 //ctx.drawImage(blockImage, isoX, isoY);

//             }
//         });
//     }    
// }

class StaticArt {
    constructor(game) {
        this.game = game;
        this.text = "";
        this.blocks = []; // Array to store block data: { label}
        this.coordinates = []; // Store coordinates separately
        this.initialize();
        
    }

    initialize() {

        for(let i = 0; i < 1; i++) {
            this.readTextFile('./map/layer_-' + i + '.txt');
        }
    }

    async readTextFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.text = await response.text();
            this.processTextFile();
        } catch (error) {
            console.error("Error loading the text file:", error);
        }
    }

    processTextFile() {
  
    
        const lines = this.text.split('\n');
        lines.forEach((line, index) => {
            //console.log(`Processing line ${index + 1}: ${line}`);
            
            // Split line into label and coordinates
            const parts = line.split(':');
            if (parts.length === 2) {
                const label = parts[0].trim();
                const coordinates = parts[1].trim().slice(1, -1).split(',').map(coord => parseInt(coord.trim()));
                
                // Store label and coordinates separately
                this.blocks.push(label);
                this.coordinates.push(coordinates);
            } else {
          //      console.error(`Invalid format in line ${index + 1}: ${line}`);
            }
        });
        
    }
    
    
    
    update(){

    }
    draw(ctx) {
        // Assuming blockImage dimensions are defined or you have a default size
        let blockWidth, blockHeight;
    
        this.blocks.forEach((label, index) => {
            let blockImage = ASSET_MANAGER.cache[`./Art/resources/${label}.png`];
            if (!blockImage) {
                console.log("Not drawing");
                return; // Skip drawing if image not found
            }
            blockWidth = blockImage.width * this.game.camera.collision.sizeFactor;
            blockHeight = blockImage.height * this.game.camera.collision.sizeFactor;

            let xdis = 2;
            let ydis = 4;
    
            const [x, y, z] = this.coordinates[index];
    
            // Convert grid coordinates to isometric screen coordinates
            let isoX = ((x - y) * blockWidth) / xdis;
            let isoY = ((x + y) * blockHeight) / ydis; // Adjusted for a more accurate isometric look
            isoY -= z * blockHeight / 2; // Adjust for height level
    
            // Calculating the player Isometric location (assuming this is correctly calculating the center position)
            // Calculating the player's isometric location
            let px = this.game.camera.steve.playerX;
            let py = this.game.camera.steve.playerY;
            let isoPlayerX = (px - py) * blockWidth / xdis;
            let isoPlayerY = (px + py) * blockHeight / ydis;
    
            // Center the player by adjusting the block's position relative to the player's position
            // This time, we correctly calculate the offset to center the player
            isoX += this.game.ctx.canvas.width / 2 - isoPlayerX;
            isoY += this.game.ctx.canvas.height / 2 - isoPlayerY;
    
             // Adjust the drawing position to ensure the player is centered at 0,0
             isoX -= blockWidth/2 ;

            //console.log(px," ",py)
            // Draw the block image
            ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
        });
    }
    
}
