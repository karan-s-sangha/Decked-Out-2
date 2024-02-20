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
        this.text = "";
        this.blocks = []; // Array to store block data: { label}
        this.coordinates = []; // Store coordinates separately
        this.gridBreath = ASSET_MANAGER.cache[`./Art/resources/Isometric_cube.png`].width;
        this.gridWidth = ASSET_MANAGER.cache[`./Art/resources/Isometric_cube.png`].height/2;
        this.gridHeight = ASSET_MANAGER.cache[`./Art/resources/Isometric_cube.png`].height/2;
        this.sizeFactor = 1;
        this.initialize();
        this.update();
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
        // Getting the Block steve is standing on 
        // let blockX = this.game.camera.steve.PlayerX % this.gridBreath;
        // let blockY = this.game.camera.steve.PlayerY % this.gridWidth;
        // let blockZ = this.game.camera.steve.PlayerZ % this.gridHeight;

        // console.log(blockX, blockY, blockZ );

    }
    getBlockHeight(x, y) {
        for (const block of this.blocks) {
          if (x >= block.x && x < block.x + block.width &&
              y >= block.y && y < block.y + block.width) {
            return block.z + block.height;
          }
        }
        return null;
      }
      move(dx, dy) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        const newZ = this.world.getBlockHeight(newX, newY);
    
        if (newZ === null) {
          console.log("Falling, no block below!");
          this.z = 0; // Assuming the ground level is 0
        } else if (newZ <= this.z + 1) { // Assuming the player can step up 1 block in height
          this.x = newX;
          this.y = newY;
          this.z = newZ - 1; // Adjusting player's Z to be on top of the block
        } else {
          console.log("Cannot move, block is too high!");
        }
      }
    
      fall(x,y) {
        const belowZ = this.world.getBlockHeight(this.x, this.y);
        if (belowZ === null || belowZ < this.z) {
          console.log("Falling to ground level!");
          this.z = 0; // Falling to ground level, assuming ground level is 0
        } else {
          this.z = belowZ - 1; // Adjusting to be on top of the block
        }
      }
      draw(ctx) {

      }
  
      isCollision(x, y) {
       return false;
        // let isoPlayerX = (x - y) * halfBlockWidth /1;
        // let isoPlayerY = (x + y) * halfBlockHeight / 2;

        let blockX = Math.floor(x / this.gridBreath * this.sizeFactor);
        let blockY = Math.floor(y / this.gridWidth * this.sizeFactor);
        //let blockZ = z % this.gridHeight;
        let blockZ = 0;

        if(this.fall()){

        }

        console.log(blockX, blockY, blockZ );
                return false;
      }
}

