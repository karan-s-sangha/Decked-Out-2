class StaticArt {
    constructor(game) {
        this.game = game;
        this.radiusXY = 12; // Radius for drawing and calculations in the XY plane
        this.radiusZ = 5;  // Radius for drawing and calculations in the Z dimension
        this.blocks = [];
        this.reachableBlocks = []; // Updated to store blocks that are reachable in a relative manner
    }

    update() {
        // Placeholder for future update logic
    }


    draw(ctx) {
        const playerX = Math.floor(this.game.camera.steve.playerX);
        const playerY = Math.floor(this.game.camera.steve.playerY);
        let playerZ = Math.ceil(this.game.camera.steve.playerZ);
        let key = `${playerX},${playerY},${playerZ}`;
        
        //console.log(playerX," ",playerY," ",playerZ);
        //console.log(this.game.camera.steve.playerX," ",this.game.camera.steve.playerY," ",this.game.camera.steve.playerZ);
        
        let count = 0;
        while(!this.game.camera.blocksMap[key]){
            playerZ = playerZ -1;
            key = `${playerX},${playerY},${playerZ}`;
            count++;
            if(count>10){
                break;
            }
        }
        
        this.blocks = [];
        this.reachableBlocks = [];
        this.expandAroundSteve(playerX, playerY, playerZ);

        // let blocks = this.sortBlocksForDrawing(this.blocks);
        // blocks.forEach(block => this.drawBlock(ctx, block));
    }

    drawBlock(ctx, block) {
        const { isoX, isoY, blockImage, sizeFactor } = this.calculateBlockDrawingParams(block);
    
        // Check if the blockImage exists and is loaded. Skip drawing if not.
        if (!blockImage || blockImage.complete === false || blockImage.naturalWidth === 0) {
            return; // Skip the drawing code below
        }
    
        const blockKey = `${block.x},${block.y},${block.z}`;

        ctx.save(); // Save the current context state
        const shouldBeTransparent = this.transparency.has(blockKey);
        ctx.globalAlpha = shouldBeTransparent ? 0.1 : 1; // Adjust opacity based on transparency flag
      

        // Draw the block
        ctx.drawImage(blockImage, isoX, isoY, blockImage.width * sizeFactor, blockImage.height * sizeFactor);
    
        ctx.restore(); // Restore the context state, resetting globalAlpha among other properties
    }
    
    
    expandAroundSteve(playerX, playerY, playerZ) {
        let visited = new Set(); // Tracks all visited blocks for expansion
        this.blocks = []; // Reset the blocks list
        this.reachableBlocks = []; // Reset the reachable blocks list
    
        let queue = [{ x: playerX, y: playerY, z: playerZ, isReachable: true }]; // Starting point
        let isDiagonallyAbove  = false;

        while (queue.length > 0) {
            const { x, y, z, isReachable } = queue.shift();
            const key = `${x},${y},${z}`;

            if (visited.has(key) || !this.game.camera.blocksMap[key]) continue; // Skip visited or non-existing

            visited.add(key); // Mark as visited
            let isInRadius = Math.abs(x - playerX) <= this.radiusXY && Math.abs(y - playerY) <= this.radiusXY && Math.abs(z - playerZ) <= this.radiusZ;

            if (isInRadius) {
                const block = this.game.camera.blocksMap[key];
                this.blocks.push(block); // Add to blocks list
                isDiagonallyAbove = isDiagonallyAbove || (x - y) === (playerX - playerY) && (y - z) === (playerY - playerZ) && (z - playerZ) > 0;

                // Queue neighbors for exploration
                this.getNeighborPositions(x, y, z).forEach(({ dx, dy, dz }) => {
                    let newX = x + dx, newY = y + dy, newZ = z + dz;
                    let newKey = `${newX},${newY},${newZ}`;
                    if (!visited.has(newKey)) {
                        queue.push({ x: newX, y: newY, z: newZ, isReachable });
                    }
                });
            }
        }
        console.log(isDiagonallyAbove);
       
        visited = new Set(); // Tracks all visited blocks for expansion
        let transparency= new Set(); // Map to track blocks that should be transparent

        queue = [{ x: playerX, y: playerY, z: playerZ, isReachable: true }]; // Starting point
        let count = 1;
        let flag = false;

        if(isDiagonallyAbove){
            console.log("Trying to find the transparent");
            while (queue.length > 0) {
                const { x, y, z } = queue.shift();
                const key = `${x},${y},${z}`;
        
                if (visited.has(key) || !this.game.camera.blocksMap[key]) continue; // Skip visited or non-existing
    
                visited.add(key); // Mark as visited
                let isInRadius = Math.abs(x - playerX) <= this.radiusXY && Math.abs(y - playerY) <= this.radiusXY && Math.abs(z - playerZ) <= this.radiusZ;
    
                if (isInRadius) {
                    const block = this.game.camera.blocksMap[key];
                  
                    // Queue neighbors for exploration
                    this.getNeighborPositions(x, y, z).forEach(({ dx, dy, dz }) => {
                        let newX = x + dx, newY = y + dy, newZ = z + dz;

                        //let currentZ = newZ + 1; // Start checking from one block above the current one.
                        
                        if (this.isMovable(x, y, z, dx, dy, dz) ) {
                            while(newZ + count <= playerZ + this.radiusZ) {
                                let X = newX+count;
                                let Y = newY+count;
                                let Z = newZ+count;

                                let aboveKey = `${X},${Y},${Z}`;
                                transparency.add(`${X},${Y},${Z+1}`);
                                transparency.add(`${X},${Y},${Z+1}`);

                                if(this.game.camera.blocksMap[aboveKey]) {
                                    // If there is a block directly above, mark it for transparency.
                                    // Assuming you have a mechanism to mark blocks as transparent, e.g., adding to a map or modifying the block object.
                                    transparency.add(aboveKey);

                                    flag = true;
                                }
                                count++; // Move one block further up.
                            }
                            if(flag === true){
                               queue.push({ x: newX, y: newY, z: newZ });
                            }
                        }
                        flag = false;
                        count = 1;
                    });
                }
            }
        }
        this.transparency = transparency; // Store the map for use in drawBlock

    }
    
    
    sortBlocksForDrawing(blocks) {
        // Sort by Z first to ensure vertical positioning is respected
        // Then sort by the sum of X and Y for proper isometric depth sorting
        return blocks.sort((a, b) => {
            if (a.z !== b.z) {
                return a.z - b.z;
            }
            return (a.x + a.y) - (b.x + b.y);
        });
    }

    isMovable(currX, currY, currZ, dx, dy, dz) {
        // Target position based on the intended direction of movement
        const targetKey = `${currX + dx},${currY + dy},${currZ + dz}`;
        const targetBlock = this.game.camera.blocksMap[targetKey];
    
        // Blocks directly above the target position
        const oneAboveTargetKey = `${currX + dx},${currY + dy},${currZ + dz + 1}`;
        const twoAboveTargetKey = `${currX + dx},${currY + dy},${currZ + dz + 2}`;
        const oneAboveTargetBlock = this.game.camera.blocksMap[oneAboveTargetKey];
        const twoAboveTargetBlock = this.game.camera.blocksMap[twoAboveTargetKey];
    
        // Block directly above the current position
        const blockAboveCurrentKey = `${currX},${currY},${currZ + 1}`;
        const blockAboveCurrent = this.game.camera.blocksMap[blockAboveCurrentKey];
    
        // Ensure the target block exists and there are no blocks directly above it, allowing for movement.
        // Additionally, check if the block above the current position is clear to allow for potential jumping.
        // This implementation assumes a simple movement model where the player cannot move if there's a block directly above them.
        // It doesn't fully account for Minecraft's nuanced movement mechanics, such as sneaking, swimming, or ladder climbing.
        if (blockAboveCurrent) {
            // If there's a block directly above the player, they cannot jump, hence cannot initiate movements that would require jumping.
            return false;
        } else {
            // The player can move to the target position if it's solid ground and there are no blocks directly above it,
            // thus ensuring there's space for the player's height.
            return targetBlock && !oneAboveTargetBlock && !twoAboveTargetBlock;
        }
    }
    

    calculateBlockDrawingParams(block) {
        const { steve, isoCameraX, isoCameraY, imageWidth, imageHeight, sizeFactor } = this.game.camera;
        const blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`];

        let isoX = ((block.x - block.y) * imageWidth * sizeFactor / 2) - isoCameraX - (imageWidth * sizeFactor) / 2;
        let isoY = ((block.x + block.y) * imageHeight * sizeFactor / 4) - (block.z - steve.playerZ) * imageHeight * sizeFactor / 2 - isoCameraY + (imageHeight * sizeFactor) / 2;

        return { isoX, isoY, blockImage, sizeFactor };
    }

    getNeighborPositions(x, y, z) {
        const neighbors = [];
        for (let dz = -1; dz <= 1; dz++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx !== 0 || dy !== 0 || dz !== 0) {
                        neighbors.push({ dx, dy, dz });
                    }
                }
            }
        }
        return neighbors;
    }
}