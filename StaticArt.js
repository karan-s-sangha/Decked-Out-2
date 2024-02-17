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
//         // this.readTextFile('./Art/Map/testMap0.txt');
//         // this.readTextFile('./Art/Map/testMap1.txt');

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
        Object.assign(this, { game });
        this.text = "";
        this.blocks = []; // Array to store block data: { label, x, y, z }
    }

    initialize() {
        console.log("Hello from initialization");
        for(let i = 0; i < 44; i++) {
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
        this.blocks = []; // Clear previous blocks
        this.coordinates = []; // Store coordinates separately
    
        const lines = this.text.split('\n');
        lines.forEach((line, index) => {
            console.log(`Processing line ${index + 1}: ${line}`);
            
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
        let compression = 3;
    
        this.blocks.forEach((label, index) => {
            // Load image based on label
            // let blockImage = ASSET_MANAGER.cache[`./Art/resources/${label}.png`];
            let blockImage = ASSET_MANAGER.cache[`./Art/resources/mud.png`]
            if (!blockImage) {
                console.error(`Image not found for label: ${label}`);
                return; // Skip drawing if image not found
            }
    
            const coordinates = this.coordinates[index];
            const x = coordinates[0];
            const y = coordinates[1];
            const z = coordinates[2];
    
            const blockWidth = blockImage.width / compression;
            const blockHeight = blockImage.height / compression;
    
            const halfBlockWidth = blockWidth / 2;
            const halfBlockHeight = blockHeight / 2;
    
            // Convert 3D coordinates to 2D isometric coordinates
            let isoX = (x - y) * halfBlockWidth;
            let isoY = (x + y) * halfBlockHeight / 2;
    
            isoX += this.game.ctx.canvas.width / 2 - halfBlockWidth;
            isoY += this.game.ctx.canvas.height / 4;
    
            isoX -= this.game.camera.cameraX;
            isoY -= this.game.camera.cameraY;
    
            isoY -= z * halfBlockHeight;
    
            // Draw the block image
           ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
            console.log("draw");
        });
    }
    }