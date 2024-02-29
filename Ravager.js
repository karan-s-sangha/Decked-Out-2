class Ravager {
    constructor(game, steve, collisions, x, y, z, walkSpeed, runSpeed, size) {
        this.game = game;
        this.steve = steve;

        this.ravagerX = x;
        this.ravagerY = y;
        this.ravagerZ = z;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.size = size; //0.25




        this.prevPositions = [];




        this.attack = false;
        this.push = 300;
        this.attackCoolDown = 0;

        this.attackFlag = false;
       

        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
        this.count = 0;

        this.loadAnimations();
        this.state = 'wandering';
        this.collisions = collisions;
        this.wanderMove = 0;
        this.angle = Math.random() * 2 * Math.PI;
        this.moveAttemptTimer = 0; // Timer to track movement attempts
        this.moveAttemptDuration = 2; // Duration in seconds after which to switch state
    }

    loadAnimations() {
        this.walkingAnimationsWest = new Image();
        this.walkingAnimationsWest = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager.png"];
        this.walkingAnimationsWest = new Animator(this.game, this.walkingAnimationsWest, 0, 0, 506, 400, 60, 0.02, 0, false, true);

        this.walkingAnimationsSouth = new Image();
        this.walkingAnimationsSouth = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager1.png"];
        this.walkingAnimationsSouth = new Animator(this.game, this.walkingAnimationsSouth, 0, 0, 433, 360, 60, 0.02, 0, false, true);

      
        this.walkingAnimationsEast = new Image();
        this.walkingAnimationsEast = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager2.png"];
        this.walkingAnimationsEast = new Animator(this.game, this.walkingAnimationsEast, 0, 0, 372, 350, 60, 0.02, 0, false, true);

        
        this.walkingAnimationsNorth = new Image();
        this.walkingAnimationsNorth = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager3.png"];
        this.walkingAnimationsNorth = new Animator(this.game, this.walkingAnimationsNorth, 0, 0, 371, 350, 60, 0.02, 0, false, true);

    }


    draw(ctx) {
        let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
        let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;

        let isoX = (this.ravagerX - this.ravagerY) * blockWidth / 2 - this.game.camera.isoCameraX;
        let isoY = (this.ravagerX + this.ravagerY) * blockHeight / 4 - (this.ravagerZ - 2.5 - this.steve.playerZ) * blockWidth / 2 - this.game.camera.isoCameraY;

        // Draw entity
        let angle =  0; 
        switch (this.state) {
            case 'attacking':
                // Draw attacking animation
                // this.attackingAnimations.drawFrameAngle(this.game.clockTick, ctx, isoRavagerX, isoRavagerY, this.size, angle);
                break;
            case 'running':
                // Draw walking/running animation
                // this.walkingAnimations.drawFrameAngle(this.game.clockTick, ctx, isoRavagerX, isoRavagerY, this.size, angle);
                break;
            case 'wandering':
                // Draw wandering animation
                this.walkingAnimationsNorth.drawFrameAngle(this.game.clockTick, ctx, isoX, isoY, this.size, angle);
                break;
            default:
                // If state is unknown, you might want to log an error or handle it in some way
                break;
        }

        // Store current position
       /* this.prevPositions.push({ x: isoX, y: isoY });

        // Draw lines between previous positions
        ctx.strokeStyle = "blue"; // Line color
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 1; i < this.prevPositions.length; i++) {
            ctx.moveTo(this.prevPositions[i - 1].x, this.prevPositions[i - 1].y);
            ctx.lineTo(this.prevPositions[i].x, this.prevPositions[i].y);
        }
        ctx.stroke();

        // Limit number of stored positions to prevent memory issues
        if (this.prevPositions.length > Number.MAX_SAFE_INTEGER) {
            this.prevPositions.shift(); // Remove the oldest position
        }*/

        // Draw a simple shape for testing
        ctx.fillStyle = "red"; // For visibility
        ctx.fillRect(isoX, isoY, 1, 1); // Draw a small square for the ravager
    }
    
    

    /*update() {
        if (this.canSeePlayer() && this.steve.health > 0 && this.attackCoolDown <= 0) {
            if (this.shouldAttackPlayer()) {
                this.state = 'attacking';
                this.steve.health -= 7.5;

                this.attackCoolDown =  0.5;

                this.attack = true;
                this.steve.canMove = false;
            } else if(this.attackCoolDown <= 0) {
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

                // Move the Ravager towards the player
                let newX = this.steve.playerX + dirX * 700 * this.game.clockTick;
                let newY = this.steve.playerY + dirY * 700 * this.game.clockTick;

                if(this.attackFlag = false) {
                    this.attackFlag = true;
                    this.steve.jumped = true;
                    this.steve.jumpComplete = false;
                }
                
                if (!this.collisions.isCollision(newX, newY)) {
                    // this.steve.p
                    this.steve.playerX = newX;
                    this.steve.playerY = newY;
                    this.push -= 12;

                } else {
                    this.push = 0;
                }
                
            } else {
                this.attack = false;
                this.push = 300;
                this.steve.canMove = true;    
                this.attackFlag = false;     
            }
            
        }
        if(this.attackCoolDown > 0) {
            this.attackCoolDown -= this.game.clockTick;
        } else {
            this.attackCoolDown = 0;
        }

    }*/

    update() {
        this.wander();
       /* if (this.canSeePlayer() && this.steve.health > 0){
           if (this.shouldAttackPlayer()) {
               this.state = 'attacking'; 
               this.steve.health -= 0.5;
           } else {
               this.state = 'running';
                this.followPlayer();
           }
        }
        else {
            this.state = 'wandering';
            this.wander();
        }*/
    }

    canSeePlayer() {
        // visibility and collision checks
        const visibilityDistance = 300;
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

        if (distanceToPlayer > visibilityDistance) {
            return false;
        }

        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 1; i <= steps; i++) {
            const checkX = this.ravagerX + (dx / steps) * i;
            const checkY = this.ravagerY + (dy / steps) * i;
            const checkZ = this.ravagerZ;

            if (this.collisions.isCollision(checkX, checkY, checkZ, this.size)) {
                return false; // Collision detected, obstruction
            }
        }

        return true; // No obstruction detected
    }


    shouldAttackPlayer() {
        const attackDistance = 50;
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        const dz = this.steve.playerZ - this.ravagerZ; 
    
        // 3D distance check, considering elevation differences
        return Math.sqrt(dx * dx + dy * dy + dz * dz) < attackDistance;
    }
    
    

    followPlayer() {
        const ravagerSpeed = this.steve.playerWalkSpeed * 1.025;
        let dx = this.steve.playerX - this.ravagerX;
        let dy = this.steve.playerY - this.ravagerY;
        let dz = this.steve.playerZ - this.ravagerZ

        let magnitude = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / magnitude;
        let dirY = dy / magnitude;
        let dirZ = dz / magnitude;

        let nextX = this.ravagerX + dirX * ravagerSpeed * this.game.clockTick;
        let nextY = this.ravagerY + dirY * ravagerSpeed * this.game.clockTick;
        let nextZ = this.ravagerZ + dirZ * ravagerSpeed * this.game.clockTick;

        if (this.collisions.isCollision(nextX, nextY, nextZ, this.size)) {
            // If there's a collision, attempt to avoid the obstacle
            this.avoidObstacle(nextX, nextY, nextZ, this.steve.playerWalkSpeed / 2);
            this.moveAttemptTimer += this.game.clockTick;
            if (this.moveAttemptTimer > this.moveAttemptDuration) {
                // Switch to wandering if stuck
                this.state = 'wandering';
                this.wander();
                this.moveAttemptTimer = 0;
            }
        } else {
            // Move the Ravager if no collision
            this.ravagerX = nextX;
            this.ravagerY = nextY;
            this.ravagerZ = nextZ; 
            this.moveAttemptTimer = 0;
        }
    }



    avoidObstacle(predictedX, predictedY, predictedZ, speed) {
        let foundPath = false;
        for (let angle = 0; angle <= 2 * Math.PI; angle += Math.PI / 18) {
            let newX = this.ravagerX + Math.cos(angle) * speed * this.game.clockTick;
            let newY = this.ravagerY + Math.sin(angle) * speed * this.game.clockTick;
            let newZ = this.ravagerZ; 
    
            if (!this.collisions.isCollision(newX, newY, newZ, this.size)) {
                this.ravagerX = newX;
                this.ravagerY = newY;
                this.ravagerZ = newZ; 
                foundPath = true;
                break;
            }
        }
    
        if (!foundPath) {
            this.state = 'wandering';
            this.wander();
        }
    }
    



    wander() {
        //console.log(this.ravagerX + " X " + this.ravagerY + " Y " + this.ravagerZ + " Z ");
        
        if (this.wanderMove <= 0) {
            // Generate a new direction angle at random
            this.angle = Math.random() * 2 * Math.PI; // Full circle random direction
            this.wanderMove = Math.floor(Math.random() * 100 + 100); // Reset wanderMove
        } else {
            
            const baseSpeed = 1; 
            const speedVariance = Math.random() * 0.5; 
            const speed = baseSpeed + speedVariance;
            
            // Calculate the next position based on the current angle and speed
            let newX = this.ravagerX + Math.cos(this.angle) * speed * this.game.clockTick;
            let newY = this.ravagerY + Math.sin(this.angle) * speed * this.game.clockTick;
            let newZ = this.ravagerZ; 
    
            // Perform collision detection with the next position
            if (this.collisions.isCollision(newX, newY, newZ)) {
                console.log(newX + " " + newY + " " + newZ);
                // If no collision, update the ravager's position
                this.ravagerX = newX;
                this.ravagerY = newY;

                if(this.collisions.state === -1) {
                    this.ravagerZ--;
                   // this.collisions.state = 0;
                } else if(this.collisions.state === 1) {
                    this.ravagerZ++;
                  //  this.collisions.state = 0;
                }  
                this.wanderMove--; 
            } 
            
            else {
                // If a collision is detected, reset wanderMove to change direction immediately
                this.wanderMove = 0;
            }
        }
    }
    
    
    

}