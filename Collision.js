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
        this.game = game;
        this.staticArt = game.camera.staticArt;
    }

    isCollision(x, y) {
        //console.log("Checking");

        // Assuming the player has 'x' and 'y' properties for its position
        const playerX = x;
        const playerY = y;

        this.staticArt.charactersArray.forEach(tile => {
            const [tileX, tileY, tileZ, char] = tile;
            if (char === '0') { // Assuming '0' represents a collidable tile
                // Convert tile coordinates to isometric screen coordinates
                let isoX = (tileX - tileY) * this.staticArt.blockWidth / 2;
                let isoY = (tileX + tileY) * this.staticArt.blockHeight / 4 - tileZ * this.staticArt.blockHeight / 2;
                
                // Since the player is a point, check if it lies within the tile's boundaries
                if (this.isPointInsideTile(playerX, playerY, isoX, isoY, this.staticArt.blockWidth, this.staticArt.blockHeight)) {
                    // Handle collision (e.g., stop movement, adjust position)
                    console.log(`Collision detected with tile at (${tileX}, ${tileY}, ${tileZ})`);
                    return true;
                }
            }
        });
        return false;
    }

    isPointInsideTile(px, py, tx, ty, tw, th) {
        // Check if the point (px, py) is inside the tile defined by top-left corner (tx, ty) and dimensions (tw, th)
        return px >= tx && px <= tx + tw && py >= ty && py <= ty + th;
    }
}
