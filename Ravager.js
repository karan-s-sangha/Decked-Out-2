class Ravager {
    constructor(game, steve, collisions, x, y, z, walkSpeed, runSpeed, size) {
        this.game = game;
        this.steve = steve;

        this.ravagerX = x;
        this.ravagerY = y;
        this.ravagerZ = z;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.size = size;

        this.attack = false;
        this.push = 10;
        this.attackCoolDown = 0;

        this.attackFlag = false;

        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
        this.count = 0;

        this.jump = false;
        this.soundCoolDown = 800;
        this.loadAnimations();
        this.state = "wandering";
        this.collisions = collisions;

        this.wanderMove = 0;
        this.angle = Math.random() * 2 * Math.PI;
        this.moveAttemptTimer = 0; // Timer to track movement attempts
        this.moveAttemptDuration = 2; // Duration in seconds after which to switch state
        this.wanderDirection = "west";
        this.followDirection = "west";

        this.prevPositions = [];
    }

    loadAnimations() {
        this.walkingAnimationsEast = new Image();
        this.walkingAnimationsEast = ASSET_MANAGER.cache["./Art/Ravager_Animations/0.png"];
        this.walkingAnimationsEast = new Animator(this.game, this.walkingAnimationsEast, 0, 0, 211, 541, 50, 0.02, 0, false, true);

        this.walkingAnimationsSouthEast = new Image();
        this.walkingAnimationsSouthEast = ASSET_MANAGER.cache["./Art/Ravager_Animations/45.png"];
        this.walkingAnimationsSouthEast = new Animator(this.game, this.walkingAnimationsSouthEast, 0, 0, 651, 612, 50, 0.02, 0, false, true);

        this.walkingAnimationsSouth = new Image();
        this.walkingAnimationsSouth = ASSET_MANAGER.cache["./Art/Ravager_Animations/90.png"];
        this.walkingAnimationsSouth = new Animator(this.game, this.walkingAnimationsSouth, 0, 0, 651, 436, 50, 0.02, 0, false, true);

        this.walkingAnimationsSouthWest = new Image();
        this.walkingAnimationsSouthWest = ASSET_MANAGER.cache["./Art/Ravager_Animations/135.png"];
        this.walkingAnimationsSouthWest = new Animator(this.game, this.walkingAnimationsSouthWest, 0, 0, 651, 541, 50, 0.02, 0, false, true);

        this.walkingAnimationsWest = new Image();
        this.walkingAnimationsWest = ASSET_MANAGER.cache["./Art/Ravager_Animations/180.png"];
        this.walkingAnimationsWest = new Animator(this.game, this.walkingAnimationsWest, 0, 0, 257, 541, 50, 0.02, 0, false, true);

        this.walkingAnimationsNorthWest = new Image();
        this.walkingAnimationsNorthWest = ASSET_MANAGER.cache["./Art/Ravager_Animations/225.png"];
        this.walkingAnimationsNorthWest = new Animator(this.game, this.walkingAnimationsNorthWest, 0, 0, 651, 540, 50, 0.02, 0, false, true);

        this.walkingAnimationsNorth = new Image();
        this.walkingAnimationsNorth = ASSET_MANAGER.cache["./Art/Ravager_Animations/270.png"];
        this.walkingAnimationsNorth = new Animator(this.game, this.walkingAnimationsNorth, 0, 0, 651, 436, 50, 0.02, 0, false, true);

        this.walkingAnimationsNorthEast = new Image();
        this.walkingAnimationsNorthEast = ASSET_MANAGER.cache["./Art/Ravager_Animations/315.png"];
        this.walkingAnimationsNorthEast = new Animator(this.game, this.walkingAnimationsNorthEast, 0, 0, 651, 610, 50, 0.02, 0, false, true);
    }
    playHitSound() {
        let titleMusicPath = "./Art/music/damage.mp3";
        let titleMusic = ASSET_MANAGER.getAsset(titleMusicPath);
        if (titleMusic && titleMusic.paused) {
            ASSET_MANAGER.playAsset(titleMusicPath);
        }
    }
    playRavagerSound() {
        let titleMusicPath = "./Art/music/ravager.mp3";
        let titleMusic = ASSET_MANAGER.getAsset(titleMusicPath);
        if (titleMusic && titleMusic.paused) {
            ASSET_MANAGER.playAsset(titleMusicPath);
        }
    }


    draw(ctx) {
   
        let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
        let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;

        let isoX = ((this.ravagerX - this.ravagerY) * blockWidth) / 2 - this.game.camera.isoCameraX;
        let isoY = ((this.ravagerX + this.ravagerY) * blockHeight) / 4 -
            ((this.ravagerZ - this.steve.playerZ) * blockWidth) / 2 -
            this.game.camera.isoCameraY + blockHeight / 2 + 2;

        let direction;
        if (this.state === "wandering") {
            // If wandering, the direction has presumably been calculated elsewhere and stored in this.wanderDirection
            direction = this.wanderDirection;
        } else {
            // When following, calculate the new direction based on the current positions of Steve and the Ravager
            this.followDirection = this.calculateFollowDirection(); // Update this.followDirection with the new direction
            direction = this.followDirection; // Use the updated follow direction
        }
    

        let animation;
        switch (direction) {
            case "north":
                animation = this.walkingAnimationsNorthEast;
                break;
            case "south":
                animation = this.walkingAnimationsSouthWest;
                break;
            case "east":
                animation = this.walkingAnimationsNorthWest;
                break;
            case "west":
                animation = this.walkingAnimationsSouthEast;
                break;
            case "northEast":
                animation = this.walkingAnimationsNorth;
                break;
            case "northWest":
                animation = this.walkingAnimationsEast;
                break;
            case "southEast":
                animation = this.walkingAnimationsWest;
                break;
            case "southWest":
                animation = this.walkingAnimationsSouth;
                break;
            default:
                break;
        }
        if (Math.abs(this.ravagerZ - this.steve.playerZ) <= this.game.camera.staticArt.radiusZ){
        animation.drawFrameAngle(this.game.clockTick, ctx, isoX, isoY + 50, this.size, 0);
      
        }
    }

    update() {
        if (this.canSeePlayer() && this.steve.live) {
           
            if (this.shouldAttackPlayer() && this.attackCoolDown == 0) {
               
                this.state = 'attacking';
                this.steve.health -= 7.5;
               
                this.attackCoolDown =  1;
                this.attack = true;
                this.steve.canMove = false;
                this.steve.jumped = true;
                this.steve.jumpDelay = 30;

            } else {
              
                this.state = 'running';
                this.followPlayer();

            }
        }
        else {
            this.state = 'wandering';
            this.wander();
        }
        if (this.attack) {
          
            if (this.push > 0) {
                let dx = this.steve.playerX - this.ravagerX;
                let dy = this.steve.playerY - this.ravagerY;

                // Normalize the vector
                let magnitude = Math.sqrt(dx * dx + dy * dy);
                let dirX = dx / magnitude;
                let dirY = dy / magnitude;
                this.playHitSound();
                // Move the Ravager towards the player
                let newX = this.steve.playerX + dirX * 25 * this.game.clockTick;
                let newY = this.steve.playerY + dirY * 25 * this.game.clockTick;

                if (this.attackFlag = false) {
                    this.attackFlag = true;
                    this.steve.jumped = true;
                    this.steve.jumpComplete = false;
                }

                if (this.collisions.isCollision(newX, newY, this.steve.playerZ)) {
                    // this.steve.p

                    this.steve.playerX = newX;
                    this.steve.playerY = newY;
                    this.push -= 1;

                } else {
                    this.push = 0;
                }

            } else {
                this.attack = false;
                this.push = 10;
                this.steve.canMove = true;
                this.attackFlag = false;
            }

        }
        if (this.attackCoolDown > 0) {
            this.attackCoolDown -= this.game.clockTick;
        } else {
            this.attackCoolDown = 0;
        }
    }

    canSeePlayer() {
        const visibilityDistance = 6;
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        // If the player is beyond the visibility distance, the player cannot be seen.
        if (distanceToPlayer > visibilityDistance) {
            return false;
        }

        if(this.soundCoolDown >= 800) {
            this.playRavagerSound();
        } 
        this.soundCoolDown--;
        if(this.soundCoolDown < 0) {
            this.soundCoolDown = 800;
        }
        const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)));

        // Check each step along the line for obstructions
        for (let i = 1; i <= steps; i++) {
            const checkX = this.ravagerX + (dx / steps) * i;
            const checkY = this.ravagerY + (dy / steps) * i;
            const checkZ = this.ravagerZ;
            // If a collision is detected at any point, there is an obstruction.
            if (this.collisions.isObstructed(checkX, checkY, checkZ)) {
                return false; // Obstruction detected, Steve cannot be seen.
            }
        }
        
        // If no obstructions are detected, the player can be seen
        return true;
    }


    shouldAttackPlayer() {
        const attackDistance = 1;
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        const dz = this.steve.playerZ - this.ravagerZ;

        return Math.sqrt(dx * dx + dy * dy + dz * dz) < attackDistance;
    }


    followPlayer() {
        //console.log("ravager location: " + this.ravagerX + " " + this.ravagerY + " " + this.ravagerZ)
        const ravagerSpeed = this.steve.playerWalkSpeed * 0.75;
        let dx = this.steve.playerX - this.ravagerX;
        let dy = this.steve.playerY - this.ravagerY;
        let dz = this.steve.playerZ - this.ravagerZ;

        let magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
        let dirX = dx / magnitude;
        let dirY = dy / magnitude;
        let dirZ = dz / magnitude;

        let nextX = this.ravagerX + dirX * ravagerSpeed * this.game.clockTick;
        let nextY = this.ravagerY + dirY * ravagerSpeed * this.game.clockTick;
        let nextZ = this.ravagerZ + dirZ * ravagerSpeed * this.game.clockTick;


        if (this.collisions.isCollision(nextX, nextY, nextZ)) {
            this.ravagerX = nextX;
            this.ravagerY = nextY;
        }
        
        this.collisions.isCollision(this.ravagerX, this.ravagerY, this.ravagerZ);
        if (this.collisions.state === -1 && !this.jumped) {
            this.ravagerZ -= 0.1;
        } else if (this.collisions.state === 1) {
            this.ravagerZ += 0.1;
        } else if(this.collisions.state === 0 && !this.jumped) {
            this.ravagerZ = Math.ceil(this.ravagerZ);
        }

    }
    calculateFollowDirection() {
        let dx = this.steve.playerX - this.ravagerX;
        let dy = this.steve.playerY - this.ravagerY;

        // Calculate the magnitude of the vector for normalization
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude === 0) return this.followDirection; // No movement, keep last direction

        // Normalize the direction vector
        const normalizedDx = dx / magnitude;
        const normalizedDy = dy / magnitude;

        // Define the threshold for diagonal movement based on the angle
        const diagonalThreshold = Math.cos(Math.PI / 8);

        // Determine the primary and diagonal directions
        if (Math.abs(normalizedDx) > diagonalThreshold) {
            return normalizedDx > 0 ? "east" : "west";
        } else if (Math.abs(normalizedDy) > diagonalThreshold) {
            return normalizedDy > 0 ? "south" : "north";
        } else {
            // Diagonal movement
            if (normalizedDx > 0 && normalizedDy > 0) {
                return "southEast";
            } else if (normalizedDx > 0 && normalizedDy < 0) {
                return "northEast";
            } else if (normalizedDx < 0 && normalizedDy > 0) {
                return "southWest";
            } else { // normalizedDx < 0 && normalizedDy < 0
                return "northWest";
            }
        }
    }

    wander() {
        if (this.wanderMove <= 0) {
            if (Math.random() < 0.4) { // 40% chance to keep going in the same direction
                this.angle = this.angle; // Keep the same angle
            } else {
                this.angle = Math.random() * 2 * Math.PI; // Choose a new direction randomly
            }

            this.wanderMove = Math.floor(Math.random() * 100 + 100); // Reset wanderMove
        } else {
            const speed = 0.2 + Math.random() * 0.5;

            let dx = Math.cos(this.angle) * speed * this.game.clockTick;
            let dy = Math.sin(this.angle) * speed * this.game.clockTick;

            let oldX = this.ravagerX;
            let oldY = this.ravagerY;

            let newX = oldX + dx;
            let newY = oldY + dy;
            let newZ = this.ravagerZ;

            // Perform collision detection with the next position
            if (this.collisions.isCollision(newX, newY, newZ)) {
                // If no collision, update the ravager's position
                this.ravagerX = newX;
                this.ravagerY = newY;
                this.wanderDirection = this.calculateWanderDirection(newX - oldX, newY - oldY); 
                this.wanderMove--;
            } else {
                this.wanderMove = 0;
              }

              this.collisions.isCollision(this.ravagerX, this.ravagerY, this.ravagerZ);
              if (this.collisions.state === -1 && !this.jumped) {
                  this.ravagerZ -= 0.1;
              } else if (this.collisions.state === 1) {
                  this.ravagerZ += 0.1;
              } else if(this.collisions.state === 0 && !this.jumped) {
                  this.ravagerZ = Math.ceil(this.ravagerZ);
              }
        }
    }

    calculateWanderDirection(dx, dy) {
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude === 0) return this.wanderDirection; // No movement, keep last direction

        const normalizedDx = dx / magnitude;
        const normalizedDy = dy / magnitude;

        const diagonalThreshold = Math.cos(Math.PI / 8);

        if (Math.abs(normalizedDx) > diagonalThreshold) {
            return normalizedDx > 0 ? "east" : "west";
        } else if (Math.abs(normalizedDy) > diagonalThreshold) {
            return normalizedDy > 0 ? "south" : "north";
        } else {
            if (normalizedDx > 0 && normalizedDy > 0) {
                return "southEast";
            } else if (normalizedDx > 0 && normalizedDy < 0) {
                return "northEast";
            } else if (normalizedDx < 0 && normalizedDy > 0) {
                return "southWest";
            } else { // normalizedDx < 0 && normalizedDy < 0
                return "northWest";
            }
        }
    }

}



