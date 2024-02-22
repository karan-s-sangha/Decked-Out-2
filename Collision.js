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
    }

    isCollision(x, y) {
        // Getting the Block the player will end In.
        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ = 0;

        const standingBlock = this.game.camera.blocks.find(block => block.x === blockX && block.y === blockY && block.z === blockZ);
        if (standingBlock) {
            console.log(`Player is standing on block: ${standingBlock.label}`);
            return true;
        } else {
            console.log("Player is not standing on any known block.");
            return false;
        }
    }
}
