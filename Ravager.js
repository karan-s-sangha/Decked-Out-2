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
    this.push = 300;
    this.attackCoolDown = 0;

    this.attackFlag = false;

    this.dx = 0;
    this.dy = 0;
    this.dz = 0;
    this.count = 0;

    this.loadAnimations();
    this.state = "wandering";
    this.collisions = collisions;
    this.wanderMove = 0;
    this.angle = Math.random() * 2 * Math.PI;
    this.moveAttemptTimer = 0; // Timer to track movement attempts
    this.moveAttemptDuration = 2; // Duration in seconds after which to switch state
    this.direction = "East";
    this.wanderDirection = "west";

    this.prevPositions = [];
  }

  loadAnimations() {
    this.walkingAnimationsEast = new Image();
    this.walkingAnimationsEast = ASSET_MANAGER.cache["./Art/Ravager_Animations/0.png"];
    this.walkingAnimationsEast = new Animator(this.game, this.walkingAnimationsEast, 0, 0, 211, 541, 56, 0.02, 0, false, true);

    this.walkingAnimationsSouthEast = new Image();
    this.walkingAnimationsSouthEast = ASSET_MANAGER.cache["./Art/Ravager_Animations/45.png"];
    this.walkingAnimationsSouthEast = new Animator(this.game, this.walkingAnimationsSouthEast, 0, 0, 651, 612, 56, 0.02, 0, false, true);

    this.walkingAnimationsSouth = new Image();
    this.walkingAnimationsSouth = ASSET_MANAGER.cache["./Art/Ravager_Animations/90.png"];
    this.walkingAnimationsSouth = new Animator(this.game, this.walkingAnimationsSouth, 0, 0, 651, 436, 56, 0.02, 0, false, true);

    this.walkingAnimationsSouthWest = new Image();
    this.walkingAnimationsSouthWest = ASSET_MANAGER.cache["./Art/Ravager_Animations/135.png"];
    this.walkingAnimationsSouthWest = new Animator(this.game, this.walkingAnimationsSouthWest, 0, 0, 651, 541, 56, 0.02, 0, false, true);

    this.walkingAnimationsWest = new Image();
    this.walkingAnimationsWest = ASSET_MANAGER.cache["./Art/Ravager_Animations/180.png"];
    this.walkingAnimationsWest = new Animator(this.game, this.walkingAnimationsWest, 0, 0, 257, 541, 56, 0.02, 0, false, true);

    this.walkingAnimationsNorthWest = new Image();
    this.walkingAnimationsNorthWest = ASSET_MANAGER.cache["./Art/Ravager_Animations/225.png"];
    this.walkingAnimationsNorthWest = new Animator(this.game, this.walkingAnimationsNorthWest, 0, 0, 651, 540, 56, 0.02, 0, false, true);

    this.walkingAnimationsNorth = new Image();
    this.walkingAnimationsNorth = ASSET_MANAGER.cache["./Art/Ravager_Animations/270.png"];
    this.walkingAnimationsNorth = new Animator(this.game, this.walkingAnimationsNorth, 0, 0, 651, 436, 56, 0.02, 0, false, true);

    this.walkingAnimationsNorthEast = new Image();
    this.walkingAnimationsNorthEast = ASSET_MANAGER.cache["./Art/Ravager_Animations/315.png"];
    this.walkingAnimationsNorthEast = new Animator(this.game, this.walkingAnimationsNorthEast, 0, 0, 651, 610, 56, 0.02, 0, false, true);
  }

  draw(ctx) {
    let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
    let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;

    let isoX = ((this.ravagerX - this.ravagerY) * blockWidth) / 2 - this.game.camera.isoCameraX;
    let isoY = ((this.ravagerX + this.ravagerY) * blockHeight) / 4 -
      ((this.ravagerZ - this.steve.playerZ) * blockWidth) / 2 -
      this.game.camera.isoCameraY + blockHeight / 2;

    let direction = this.state === "wandering" ? this.wanderDirection : this.calculateDirection();
    ctx.fillText(`Direction: ${direction}`, isoX, isoY - 10);
    console.log(`Current direction: ${direction}`);

    //Determine the animation to use based on direction
    let animation;
    

    switch (direction) {
      case "north":
        animation = this.walkingAnimationsNorth;
        break;
      case "south":
        animation = this.walkingAnimationsSouth;
        break;
      case "east":
        animation = this.walkingAnimationsEast;
        break;
      case "west":
        animation = this.walkingAnimationsWest;
        break;
      case "northEast":
        animation = this.walkingAnimationsNorthEast;
        break;
      case "northWest":
        animation = this.walkingAnimationsNorthWest;
        break;
      case "southEast":
        animation = this.walkingAnimationsSouthEast;
        break;
      case "southWest":
        animation = this.walkingAnimationsSouthWest;
        break;
      default:
        break;
    }
   
    animation.drawFrameAngle(this.game.clockTick, ctx, isoX, isoY, this.size, 0);

    // Store current position for any subsequent logic
    this.prevPositions.push({ x: isoX, y: isoY });

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
    }

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
    let dz = this.steve.playerZ - this.ravagerZ;

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
        this.state = "wandering";
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
      this.state = "wandering";
      this.wander();
    }
  }

/*  wander() {
    if (this.wanderMove <= 0) {
      // Chance to continue in the same direction or choose a new one
      if (Math.random() < 0.3) { // 30% chance to keep going in the same direction
        this.angle = this.angle; // Keep the same angle
      } else {
        this.angle = Math.random() * 2 * Math.PI; // Choose a new direction randomly
      }

      this.wanderMove = Math.floor(Math.random() * 100 + 100); // Reset wanderMove
    } else {
      const speed = 0.2 + Math.random() * 0.5; // Adjust speed by game clock

      let dx = Math.cos(this.angle) * speed * this.game.clockTick;
      let dy = Math.sin(this.angle) * speed * this.game.clockTick;

      let newX = this.ravagerX + dx;
      let newY = this.ravagerY + dy;
      let newZ = this.ravagerZ;

      if (this.collisions.isCollision(newX, newY, newZ)) {
        this.ravagerX = newX;
        this.ravagerY = newY;

        if (this.collisions.state === -1) {
          this.ravagerZ--;
        } else if (this.collisions.state === 1) {
          this.ravagerZ++;
        }
        this.wanderMove--;
      } else {
        this.wanderMove = 0;
      }
    }
  }*/


  calculateDirection() {
    let dx = this.steve.playerX - this.ravagerX;
    let dy = this.steve.playerY - this.ravagerY;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "east" : "west";
    } else {
      return dy > 0 ? "south" : "north";
    }
  }
  wander() {
    if (this.wanderMove <= 0) {
      // Generate a new direction angle at random
      this.angle = Math.random() * 2 * Math.PI; // Full circle random direction

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

        if (this.collisions.state === -1) {
          this.ravagerZ--;
        } else if (this.collisions.state === 1) {
          this.ravagerZ++;
        }
        console.log("Checking collision for:", newX, newY, newZ);
        this.wanderDirection = this.calculateWanderDirection(newX - oldX, newY - oldY); 
        this.wanderMove--;
      } else {
        this.wanderMove = 0;
      }
    }
  }

  calculateWanderDirection(dx, dy) {
    // Normalize the deltas to get the direction of movement
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const normalizedDx = dx / magnitude;
    const normalizedDy = dy / magnitude;

    // Define the threshold for diagonal movement
    const diagonalThreshold = Math.cos(Math.PI / 4); // cos(45°)

    // Determine the primary direction of movement based on the normalized deltas
    if (Math.abs(normalizedDx) > diagonalThreshold && Math.abs(normalizedDy) <= diagonalThreshold) {
      //console.log(`Angle: ${angleDeg}, Direction: ${"east"}`);
      return normalizedDx > 0 ? "east" : "west";
    } else if (Math.abs(normalizedDy) > diagonalThreshold && Math.abs(normalizedDx) <= diagonalThreshold) {
      return normalizedDy > 0 ? "south" : "north";
    } else if (normalizedDx > 0 && normalizedDy > 0) {
      return "southEast";
    } else if (normalizedDx > 0 && normalizedDy < 0) {
      return "northEast";
    } else if (normalizedDx < 0 && normalizedDy > 0) {
      return "southWest";
    } else if (normalizedDx < 0 && normalizedDy < 0) {
      return "northWest";
    }
    return "unknown"; // Default case if no direction is determined
  }

}
  
 /* calculateWanderDirection() {
    let angleDeg = this.angle * (180 / Math.PI); // Convert radians to degrees
    console.log(angleDeg + " angle");

    // Correcting the angle ranges to match the updated game world directions
    if (angleDeg >= 337.5 || angleDeg < 22.5) {
      console.log(`Angle: ${angleDeg}, Direction: ${"east"}`); // 270 degrees
      return "east";
    } else if (angleDeg >= 22.5 && angleDeg < 67.5) {
      console.log(`Angle: ${angleDeg}, Direction: ${"northEast"}`); // Transitioning towards north
      return "northEast";
    } else if (angleDeg >= 67.5 && angleDeg < 112.5) {
      console.log(`Angle: ${angleDeg}, Direction: ${"north"}`); // 180 degrees
      return "north";
    } else if (angleDeg >= 112.5 && angleDeg < 157.5) {
      console.log(`Angle: ${angleDeg}, Direction: ${"northWest"}`); // Transitioning towards west
      return "northWest";
    } else if (angleDeg >= 157.5 && angleDeg < 202.5) {
      console.log(`Angle: ${angleDeg}, Direction: ${"west"}`); // 0/360 degrees
      return "west";
    } else if (angleDeg >= 202.5 && angleDeg < 247.5) {
      console.log(`Angle: ${angleDeg}, Direction: ${"southWest"}`); // Transitioning towards south
      return "southWest";
    } else if (angleDeg >= 247.5 && angleDeg < 292.5) {
      console.log(`Angle: ${angleDeg}, Direction: ${"south"}`); // 90 degrees
      return "south";
    } else {
      // angleDeg >= 292.5 && angleDeg < 337.5
      console.log(`Angle: ${angleDeg}, Direction: ${"southEast"}`); // Transitioning towards east
      return "southEast";
    }
  }*/
  


