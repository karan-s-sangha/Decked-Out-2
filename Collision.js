
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
 
        if (this.game.camera.blocksMap[`${blockX},${blockY},${blockZ}`] && !this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 1}`]) {
            let standingBlock = this.game.camera.blocksMap[`${blockX},${blockY},${blockZ}`];

        console.log(`Player is standing on block: ${standingBlock.label}`);

            this.state = 0;
            return true;
            
        }
       
        else if (this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 1}`] && 
        !this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 2}`]) {
            this.state = 1;
            return true;
        }

        else if(this.game.camera.blocksMap[`${blockX},${blockY},${blockZ + 2}`]) {
            console.log("i hit the wall!");
            return false;
        }  else if (this.game.camera.blocksMap[`${blockX},${blockY },${blockZ - 1}`] 
        || this.game.camera.blocksMap[`${blockX },${blockY},${blockZ - 2}`]
        || this.game.camera.blocksMap[`${blockX },${blockY},${blockZ - 3}`]) {
            
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
}
