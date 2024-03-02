
class Collision {
    constructor(game) {
        Object.assign(this, { game });
        this.state = 0;
    }

    isCollision(x, y, z) {
        console.log(x, y, z);

        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ = Math.ceil(z); 

        if(this.state === 1) {
            blockZ = Math.floor(z); 
        }
            
           
        if (this.game.camera.blocksMap[`${blockX},${blockY},${blockZ}`] && !this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 1}`]) {
            let standingBlock = this.game.camera.blocksMap[`${blockX},${blockY},${blockZ}`];

        //console.log(`Player is standing on block: ${standingBlock.label}`);
            this.state = 0;
            return true;
            
        }
       
        else if (this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 1}`] && 
        !this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 2}`]) {
    //        console.log("im supposed to walk up");
            this.state = 1;
            return true;
        }

        else if(this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 2}`]) {
            this.state = -2;
            return false;
        }  else if (this.game.camera.blocksMap[`${blockX},${blockY },${blockZ - 1}`] 
        || this.game.camera.blocksMap[`${blockX },${blockY},${blockZ - 2}`]
        || this.game.camera.blocksMap[`${blockX },${blockY},${blockZ - 3}`]) {
            
            this.state = -1;
            return true;

        } else {
    //        console.log("i almost fell!");
            return false;
        }

       }

    isObstructed(x, y, z) {
        // Check if the block at (x, y, z + 2) is occupied, indicating an impassable block
        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ = Math.ceil(z) + 2; // Adjust for checking two levels above

        // Check the presence of a block at the specified coordinates
        const blockExists = !!this.game.camera.blocksMap[`${blockX},${blockY},${blockZ}`];

        // Return true if a block exists at z + 2 level, indicating obstruction
        return blockExists;
    }


}
