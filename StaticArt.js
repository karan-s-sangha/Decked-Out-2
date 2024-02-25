class StaticArt {
    constructor(game) {
        this.game = game;
        
    }
    
    update() {
        // Update logic if needed (e.g., for animated tiles or changing scenarios)
    }

   
    draw(ctx) {
        const playerX = Math.floor(this.game.camera.steve.playerX);
        const playerY = Math.floor(this.game.camera.steve.playerY);
        const playerZ = Math.floor(this.game.camera.steve.playerZ);
        let movable = this.getReachableBlocks(playerX, playerY, playerZ);
    
        // Convert Set to Array and sort by y, then x, and finally z value
        let sortedMovable = Array.from(movable).sort((a, b) => {
            let [ax, ay, az] = a.split(',').map(Number);
            let [bx, by, bz] = b.split(',').map(Number);
            if (ay !== by) return ay - by; // Ascending y values
            if (ax !== bx) return ax - bx; // Ascending x values
            return az - bz; // Ascending z values
        });
    
        for (let blockKey of sortedMovable) {
            let [x, y, z] = blockKey.split(',').map(Number);
            this.drawBlock(ctx, x, y, z);
        }
    }
    
    

    drawBlock(ctx, x, y, z) {
      //console.log(x,y,z);
      // Player's current position
      const playerX = Math.floor(this.game.camera.steve.playerX);
      const playerY = Math.floor(this.game.camera.steve.playerY);
      const playerZ = Math.ceil(this.game.camera.steve.playerZ);
  
      // Block dimensions
      let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
      let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;
  
      // Determine the range of blocks to check
    
                  // Construct the key for the current block position
                  const blockKey = `${x},${y},${z}`;
                  const block = this.game.camera.blocksMap[blockKey];
                  if (!block) return; // Skip if no block found at this position
  
                  let blockImage = ASSET_MANAGER.cache[`./Art/resources/${block.label}.png`];
                  if (!blockImage) {
                      //console.log("Image not found for block:", block.label);
                      return; // Skip drawing if image not found
                  }
  
                  // Calculate the isometric position for the block, adjusting for player position
                  let relativeX = x ;
                  let relativeY = y ;
                  let relativeZ = z - playerZ;
  
                  let isoX = (relativeX - relativeY) * blockWidth / 2;
                  let isoY = (relativeX + relativeY) * blockHeight / 4 - (relativeZ * blockHeight / 2);
  
                  // // Center the drawing on the canvas based on the player's position
                  // isoX += ctx.canvas.width / 2 - blockWidth / 2;
                  // isoY += ctx.canvas.height / 2 - blockHeight / 4; // Adjust based on the typical block height to center
  
                  // Adjust the drawing position based on the camera's position to ensure the map moves with the camera
                  isoX -= (blockWidth / 2 + this.game.camera.isoCameraX);
                  isoY -= this.game.camera.isoCameraY;
  
                     
                  // Draw the block image at the calculated isometric position
                  ctx.drawImage(blockImage, isoX, isoY, blockWidth, blockHeight);
    }


    getReachableBlocks(playerX, playerY, playerZ) {
        const radius = 10; // Define the search radius
        let startBlockX = Math.floor(playerX);
        let startBlockY = Math.floor(playerY);
        let startBlockZ = Math.floor(playerZ); // Consider the player's standing position

        const blockKey = `${startBlockX},${startBlockY},${startBlockZ}`;   
        const standingBlock = this.game.camera.blocksMap[blockKey];
    
        if (!standingBlock) return new Set();

   
        let openSet = new Set([`${startBlockX},${startBlockY},${startBlockZ}`]);
        let closedSet = new Set();
        
        while (openSet.size > 0) {
            let current = openSet.values().next().value; // Get an item from the set
            let [currX, currY, currZ] = current.split(',').map(Number);
            openSet.delete(current);
            closedSet.add(current);

            for (let dz of [-1, 0, 1]) {
                for (let dy of [-1, 0, 1]) {
                    for (let dx of [-1, 0, 1]) {
                        if (dx === 0 && dy === 0 && dz === 0) continue;

                        let neighborX = currX + dx;
                        let neighborY = currY + dy;
                        let neighborZ = currZ + dz;

                        // Check if the neighbor is within the radius
                        if (Math.abs(neighborX - startBlockX) > radius ||
                            Math.abs(neighborY - startBlockY) > radius ||
                            Math.abs(neighborZ - startBlockZ) > radius) continue;

                        let neighbor = `${neighborX},${neighborY},${neighborZ}`;
                        if (closedSet.has(neighbor) || !this.isMovable(currX, currY, currZ, dx, dy, dz)) continue;

                        openSet.add(neighbor);
                    }
                }
            }
        }

        return closedSet;
    }
    
    isMovable(currX, currY, currZ, dx, dy, dz) {
        // Check for the existence of the block in the target location
        let targetBlockExists = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz}`];
        // Check if there are two blocks of free space above the target location for Steve to stand
        let oneSpaceAbove = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz + 1}`];
        let twoSpaceAbove = this.game.camera.blocksMap[`${currX + dx},${currY + dy},${currZ + dz + 2}`];
    
        // // For falling down (dz = -1), ensure the destination block below is clear
        // if (dz === -1) {
        //     // Only need to check the block directly below is not existing (Steve can fall into it)
        //     return !this.game.camera.blocksMap[`${currX},${currY},${currZ - 1}`];
        // }
    
        return targetBlockExists && !oneSpaceAbove && !twoSpaceAbove;
    }
    
}