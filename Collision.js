
class Collision {
    constructor(game) {
        Object.assign(this, { game });
        this.rav = 0;
    }

    isCollision(x, y, z) {
        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ = Math.ceil(z); 

        if (this.game.camera.blocksMap[`${blockX },${blockY },${blockZ}`] && !this.game.camera.blocksMap[`${blockX },${blockY },${blockZ + 1}`]) {
            //console.log(`Player is standing on block: ${standingBlock.label}`);
            return true;
        }
       
        else if (this.game.camera.blocksMap[`${blockX },${blockY },${blockZ + 1}`] && !this.game.camera.blocksMap[`${blockX },${blockY },${blockZ + 2}`]) {
            //console.log(`Player is standing on block: ${standingBlock.label}`);
            this.game.camera.steve.playerZ += 1;
            return true;
        }

        else if(this.game.camera.blocksMap[`${blockX },${blockY },${blockZ + 2}`]) {
            //console.log(`Player is standing on block: ${standingBlock.label}`);
            return false;
        }

            this.game.camera.steve.playerZ -= 1;
            return true;
   


            this.game.camera.steve.playerZ -= 1;
            return true;
   

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
    
        // Restrict movement if there's no block at the current and below positions (preventing movement into undefined areas)
        if (this.game.camera.blocksMap[`${blockX},${blockY},${currentZ}`] === undefined && 
            this.game.camera.blocksMap[`${blockX},${blockY},${belowZ}`] === undefined) {
            // Prevent movement if both the current position and the position below are undefined
            return true; // Treat as a collision to prevent falling into undefined space
        }
    
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
    
    

    /*isCollisionRavager(x, y, z) {
        let directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, // East, West
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // North, South
            { dx: 1, dy: 1 }, { dx: -1, dy: -1 }, // Northeast, Southwest
            { dx: 1, dy: -1 }, { dx: -1, dy: 1 }  // Southeast, Northwest
        ];
    
        // Reset elevation adjustment
        this.rav = 0;
    
        let isBlocked = true;
        let canMoveUp = !this.game.camera.blocksMap[`${Math.floor(x)},${Math.floor(y)},${Math.ceil(z + 1)}`];
        let canMoveDown = !this.game.camera.blocksMap[`${Math.floor(x)},${Math.floor(y)},${Math.ceil(z - 1)}`];
    
        // Check all 8 directions at the current level
        for (let i = 0; i < directions.length; i++) {
            let dir = directions[i];
            let newX = x + dir.dx;
            let newY = y + dir.dy;
    
            // If any direction is free at the current level, the Ravager is not blocked
            if (!this.game.camera.blocksMap[`${Math.floor(newX)},${Math.floor(newY)},${Math.ceil(z)}`]) {
                isBlocked = false;
                break; // Exit the loop early if a free direction is found
            }
        }
    
        // If not blocked, no need to adjust Z or consider a collision
        if (!isBlocked) {
            return false;
        }
    
        // Determine elevation change if blocked
        if (canMoveUp) {
            this.rav = 1; // Possible to move up
        } else if (canMoveDown) {
            this.rav = -1; // Possible to move down
        } else {
            // Cannot move up or down; truly blocked
            return true;
        }
    
        // Not truly blocked since an elevation change is possible
        return false;
    }
}*/


    
