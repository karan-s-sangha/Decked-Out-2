class Collision {
    constructor(game) {
        Object.assign(this, { game });
        this.state = 0;
    }

    isCollision(x, y, z) {
        console.log(x, y, z);

        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ = Math.ceil(z); // Assuming z is always 0 for this example
 
        if (this.game.camera.blocksMap[`${blockX + 1},${blockY + 2},${blockZ}`] && !this.game.camera.blocksMap[`${blockX + 1},${blockY + 2},${blockZ + 1}`]) {
            let standingBlock = this.game.camera.blocksMap[`${blockX + 1},${blockY+ 2},${blockZ}`];

        console.log(`Player is standing on block: ${standingBlock.label}`);

            this.state = 0;
            return true;
            
        }
       
        else if (this.game.camera.blocksMap[`${blockX + 1},${blockY + 2},${blockZ + 1}`] && !this.game.camera.blocksMap[`${blockX + 1},${blockY + 2},${blockZ + 2}`]) {
            this.state = 1;
            return true;
            
        }

        else if(this.game.camera.blocksMap[`${blockX + 1},${blockY + 2},${blockZ + 2}`]) {
            console.log("i hit the wall!");
            return false;
        }  else if (this.game.camera.blocksMap[`${blockX + 1},${blockY + 2},${blockZ - 1}`] || this.game.camera.blocksMap[`${blockX + 1},${blockY +2},${blockZ - 2}`]|| this.game.camera.blocksMap[`${blockX + 1},${blockY + 2},${blockZ - 3}`]) {
            
            this.state = -1;
            return true;

        } else {

            console.log("i almost fell!");
            return false;
        }


        // if (this.game.camera.blocksMap[`${blockX},${blockY},${blockZ}`] && !this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 1}`]) {
        //     let standingBlock = this.game.camera.blocksMap[`${blockX},${blockY},${blockZ}`];
        // console.log(`Player is standing on block: ${standingBlock.label}`);
        //     this.state = 0;
        //     return true;
            
        // }
       
        // else if (this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 1}`] && !this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 2}`]) {
        //     this.state = 1;
        //     return true;
            
        // }

        // else if(this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 2}`]) {
        //     console.log("i hit the wall!");
        //     return false;
        // } else if (this.game.camera.blocksMap[`${blockX},${blockY},${blockZ - 1}`] || this.game.camera.blocksMap[`${blockX},${blockY},${blockZ - 2}`]|| this.game.camera.blocksMap[`${blockX},${blockY},${blockZ - 3}`]) {
            
        //     this.state = -1;
        //     return true;

        // } else {

        //     console.log("i almost fell!");
        //     return false;
        // }

    }

    isCollisionRavager(x, y, z) {
        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let currentZ = Math.floor(z);
        let aboveZ = currentZ + 1;
        let belowZ = currentZ - 1;
    
        console.log(`Checking block at ${blockX},${blockY},${currentZ}: `, this.game.camera.blocksMap[`${blockX},${blockY},${currentZ}`]);
    
        // Direct collision check at the current Z level
        if (this.game.camera.blocksMap[`${blockX},${blockY},${currentZ}`]) {
            return true; // Collision detected, can't move horizontally
        }
    
        // // Restrict movement if there's no block at the current and below positions (preventing movement into undefined areas)
        // if (this.game.camera.blocksMap[`${blockX},${blockY},${currentZ}`] === undefined && 
        //     this.game.camera.blocksMap[`${blockX},${blockY},${belowZ}`] === undefined) {
        //     // Prevent movement if both the current position and the position below are undefined
        //     return true; // Treat as a collision to prevent falling into undefined space
        // }
    
        // Check for potential step up
        if (this.game.camera.blocksMap[`${blockX},${blockY},${aboveZ}`]) {
            if (!this.game.camera.blocksMap[`${blockX},${blockY},${aboveZ + 1}`]) {
                this.rav = 1; // Indicate movement up
                return false; // Indicates a potential move up
            }
        }
        
        // Allow stepping down only if the block below the current level exists
        if (this.game.camera.blocksMap[`${blockX},${blockY},${belowZ}`]) {
            this.rav = -1; // Indicate movement down
            return false; // Indicates a potential move down
        }
    
        // Return false by default, allowing movement if none of the blocking conditions are met
        return false;
    }



}
