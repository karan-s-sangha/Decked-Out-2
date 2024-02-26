class StaticArt {
    constructor(game) {
        this.game = game;
        this.radius = 15;
        
    }
    
    update() {
        // Update logic if needed (e.g., for animated tiles or changing scenarios)
    }

   
    draw(ctx) {
        const playerX = Math.floor(this.game.camera.steve.playerX);
        const playerY = Math.floor(this.game.camera.steve.playerY);
        const playerZ = Math.floor(this.game.camera.steve.playerZ);
    
        // First, get all reachable blocks to identify which blocks should not be hindered.
        let reachableBlocks = this.getReachableBlocks(playerX, playerY, playerZ);
      
        // Sort the reachable blocks by z, then x, and finally y to ensure correct drawing order.
        reachableBlocks.sort((a, b) => {
                 if (a.z !== b.z) return a.z - b.z; // Sort by z ascendingly for elevation.
                 if (a.x !== b.x) return a.x - b.x; // Then by x ascendingly.
                   return a.y - b.y; // Lastly, sort by y ascendingly.
        });

        // Define the range of the cube around the player
        const radius = 10;
        
    
        // Collect all blocks within the specified cube around the player
        let blocksInRange = [];
        for (let z = playerZ - radius; z <= playerZ + radius; z++) {
            for (let y = playerY - radius; y <= playerY + radius; y++) {
                for (let x = playerX - radius; x <= playerX + radius; x++) {
                    let blockKey = `${x},${y},${z}`;
                    if (this.game.camera.blocksMap[blockKey] && !reachableSet.has(blockKey)) {
                        // Only add blocks that are not in the set of reachable blocks to avoid drawing hindering blocks
                        blocksInRange.push({ x, y, z });
                    }
                }
            }
        }
    
        // Draw each block within range that is not considered reachable (and thus not hindering)
        blocksInRange.forEach(block => {
            this.drawBlock(ctx, block.x, block.y, block.z);
        });
    
        // Additionally, draw reachable blocks as they are not hindering by definition
        reachableBlocks.forEach(block => {
            this.drawBlock(ctx, block.x, block.y, block.z);
        });
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
        const radius = this.radius;
        let startBlockX = Math.floor(playerX);
        let startBlockY = Math.floor(playerY);
        let startBlockZ = Math.floor(playerZ);
    
        let openSet = [{ x: startBlockX, y: startBlockY, z: startBlockZ, distance: 0 }];
        let closedSet = new Set(); // Stores only the coordinates as a string "x,y,z"
        let distances = {}; // Stores distances for each block
    
        while (openSet.length > 0) {
            openSet.sort((a, b) => a.distance - b.distance);
            let current = openSet.shift();
            let currentKey = `${current.x},${current.y},${current.z}`;
            if (!closedSet.has(currentKey)) { // Ensure we only add unique blocks
                closedSet.add(currentKey);
                distances[currentKey] = current.distance; // Track distance separately
    
                for (let dz of [-1, 0, 1]) {
                    for (let dy of [-1, 0, 1]) {
                        for (let dx of [-1, 0, 1]) {
                            if (dx === 0 && dy === 0 && dz === 0) continue;
    
                            let neighborX = current.x + dx;
                            let neighborY = current.y + dy;
                            let neighborZ = current.z + dz;
    
                            if (Math.abs(neighborX - startBlockX) > radius ||
                                Math.abs(neighborY - startBlockY) > radius ||
                                Math.abs(neighborZ - startBlockZ) > radius) continue;
    
                            let neighborKey = `${neighborX},${neighborY},${neighborZ}`;
                            if (closedSet.has(neighborKey) || !this.isMovable(current.x, current.y, current.z, dx, dy, dz)) continue;
    
                            let existing = openSet.find(o => `${o.x},${o.y},${o.z}` === neighborKey);
                            let newDistance = current.distance + 1;
                            if (!existing) {
                                openSet.push({ x: neighborX, y: neighborY, z: neighborZ, distance: newDistance });
                            }
                        }
                    }
                }
            }
        }
    
        // Convert closedSet to an array of objects including distance for further processing
        return Array.from(closedSet).map(key => {
            let [x, y, z] = key.split(',').map(Number);
            return { x, y, z, distance: distances[key] };
        });
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