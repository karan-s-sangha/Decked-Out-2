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
    }
    
    update() {
        // Update logic if needed (e.g., for animated tiles or changing scenarios)
    }

    draw(ctx) {
        // Ensure block dimensions are defined. If using a default size, initialize them accordingly.
        let blockWidth, blockHeight;

        // Loop through each block defined in the camera's block array
        this.game.camera.blocks.forEach(block => {
            let blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`]; // Assuming block.label contains the image file name
            if (!blockImage) {
                console.log("Image not found for block:", block.label);
                return; // Skip drawing if image not found
            }

            // Apply size factor to determine the final width and height of the block
            blockWidth = blockImage.width * this.game.camera.sizeFactor;
            blockHeight = blockImage.height * this.game.camera.sizeFactor;

            // Calculate the isometric position for the block
            // The isometric projection formulas convert cartesian coordinates (x, y) to isometric coordinates.
            let isoX = (block.x - block.y) * blockWidth / 2;
            let isoY = (block.x + block.y) * blockHeight / 4; // Assuming a 2:1 ratio for isometric projection

            // Adjust for the block's z-coordinate (height) if necessary
            isoY -= block.z * blockHeight / 2; // Adjust isoY based on the z value to simulate elevation

            // Adjust the drawing position based on the camera's position to ensure the map moves with the camera
            isoX -= this.game.camera.isoCameraX;
            isoY -= this.game.camera.isoCameraY;

            // Adjust the drawing position to ensure the player is centered at 0,0
            isoX -= blockWidth/2 ;

            // Draw the block image at the calculated isometric position
            ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
        });
    }
}
