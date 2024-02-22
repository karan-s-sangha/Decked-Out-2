// class Collision {
//     constructor(game){
//         this.game = game;

//         // Load the image and create a canvas for it
//         let image = ASSET_MANAGER.cache["./Art/Level_1_UpperView_Art/Level_1_UpperView_Collision.png"];
//         this.canvas = document.createElement("canvas");
//         this.canvas.width = image.width;
//         this.canvas.height = image.height;
//         this.context = this.canvas.getContext("2d");
//         this.context.drawImage(image, 0, 0);
//     }

//     isCollision(x, y) {
//         return false;
//         this.x = x / this.game.GameScale;
//         this.y = y / this.game.GameScale;
//         // console.log(this.x);
//         // console.log(this.y);
//         // Ensure the coordinates are within the bounds of the canvas
//         if (this.x >= 0 && this.x < this.canvas.width && this.y >= 0 && this.y < this.canvas.height) {
            
//             // Get the pixel data from the canvas 
//             let pixelData = this.context.getImageData(Math.floor(this.x), Math.floor(this.y), 1, 1).data;

//             // Define the collision color (RGBA values)
//             let collisionColor = [116, 29, 50, 255]; // Assuming alpha value as well

//             // Compare pixel data directly
//             if (pixelData[0] === collisionColor[0] && pixelData[1] === collisionColor[1] && pixelData[2] === collisionColor[2] && pixelData[3] === collisionColor[3]) {
//                 return true; // Collision detected
//             } else {
//                 return false; // No collision
//             }
//         } else {
//             console.error("Coordinates are out of bounds.");
//             return false; // Return false for out-of-bounds coordinates
//         }
//     }

//     isCollisionRavager(x, y, size) {
//         for (let offsetX = 0; offsetX < size; offsetX++) {
//             for (let offsetY = 0; offsetY < size; offsetY++) {
//                 let scaledX = (x + offsetX) / this.game.GameScale;
//                 let scaledY = (y + offsetY) / this.game.GameScale;
    
//                 if (scaledX < 0 || scaledX >= this.canvas.width || scaledY < 0 || scaledY >= this.canvas.height) {
//                     return true;
//                 }
    
//                 let pixelData = this.context.getImageData(Math.floor(scaledX), Math.floor(scaledY), 1, 1).data;
//                 let collisionColor = [116, 29, 50, 255];
//                 if (pixelData[0] === collisionColor[0] && pixelData[1] === collisionColor[1] && 
//                     pixelData[2] === collisionColor[2] && pixelData[3] === collisionColor[3]) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }
    
// }
class Collision {
    constructor(game) {
        Object.assign(this, { game });
        this.blocks = []; // Array to store block data as objects
        this.layerCount = 2; // Set the number of layers you want to read
        this.sizeFactor = 1;
        this.initialize();
    }

    async initialize() {
        console.log("In initialization");
        for (let i = 0; i < this.layerCount; i++) {
            try {
                const response = await fetch(`./map/layer_-${i}.txt`);
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
            const parts = line.split(':');
            if (parts.length === 2) {
                const label = parts[0].trim();
                const [x, y, z] = parts[1].trim().slice(1, -1).split(',').map(Number);
                this.blocks.push({ label, x, y, z });
            } else {
                console.error(`Invalid format in line ${index + 1}: ${line}`);
            }
        });
    }

    isCollision(x, y) {
         // Convert player's position to grid coordinates
         let blockX = Math.floor(x);
         let blockY = Math.floor(y);
         let blockZ =0;

        this.isHorizontalCollision(x, y, 0);
        // let status = this.find(blockX, blockY, blockZ); // Assuming Z is always 0 for simplicity
        // if (status === false) {
        //     console.log("Fall");
        // }
    }

    find(x, y, z) {
        const standingBlock = this.blocks.find(block => block.x === x && block.y === y && block.z === z);
        if (standingBlock) {
            console.log(`Player is standing on block: ${standingBlock.label}`);
            return true;
        } else {
            console.log("Player is not standing on any known block.");
            return false;
        }
    }
    isHorizontalCollision(x, y, z) {
        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ = 0;

        const standingBlock = this.blocks.find(block => block.x === blockX && block.y === blockY && block.z === blockZ+1);
        if (standingBlock) {
            console.log(`Player is standing on block: ${standingBlock.label}`);
            return true;
        } else {
            console.log("Player is not standing on any known block.");
            return false;
        }
    }
    isVerticalCollision(x, y, z) {
        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ =0.1;

        const standingBlock = this.blocks.find(block => block.x === blockX && block.y === blockY && block.z === blockZ);
        if (standingBlock) {
            console.log(`Player is standing on block: ${standingBlock.label}`);
            return true;
        } else {
            console.log("Player is not standing on any known block.");
            return false;
        }
    }
}
