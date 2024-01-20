const LOW_HEALTH = 10; // constant value for palyer health

class Ravager {
    constructor(game, x, y, walkSpeed, runSpeed, size) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.size = size;
        this.playerInView = false;
        this.lastSeenPlayerTime = null;
        this.lastPlayerPosition = { x: null, y: null }; // Stores the last known position of the player

        this.loadAnimations();
        
        //this.collisions = collisions;
    }
    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet.src = "./Art/Level_1_UpperView_Art/ravenger.png";
        this.animations = new Animator(this.spritesheet, 239, 0, 47, 68, 1, 0.5, 14, false, true);
        //this.animations = new Animator(this.spritesheet, 239, 0, 16, 16, 3, 0.5, 14, false, true);
        
    }

    draw(ctx) {
        // Draw the Mario image on top of the black background
    //  ctx.drawImage(this.spritesheet, 209, 0, 32, 16, this.x, this.y, 64,32);
    this.animations.drawFrame(this.game.clockTick,ctx,this.x,this.y,3);
    console.log("pass");

}

    //update(player, collisions) {
    update(player) {
        if (this.canSeePlayer(player)) {
            this.playerInView = true; // if player is in view
            this.lastSeenPlayerTime = new Date(); // get a time that ravagener sees player
            this.lastPlayerPosition = { x: player.x, y: player.y }; // Update the last known position
            this.followPlayer(player);
        } else {
            if (this.playerInView && (new Date() - this.lastSeenPlayerTime > 2000)) {// if it is more than 2 secs
                this.playerInView = false;
                // Only move to the last known position if it's set
                if (this.lastPlayerPosition.x !== null && this.lastPlayerPosition.y !== null) {
                    this.moveLastPlayerPosition(this.lastPlayerPosition);
                } else {
                    //this.wander(collisions);
                }
            } else {
               // this.wander(collisions);// fallback
            }
        }
    }

    canSeePlayer(player) {
        
        return false;
    }


   followPlayer(player) {
   // followPlayer(player, collisions) {
        // Determine ravager's speed based on player's heath state
        const ravagerSpeed = (player.isRunning || player.health <= LOW_HEALTH) ? this.runSpeed : this.walkSpeed;

        // Calculate the vector from the Ravager to the player
        let dx = player.x - this.x;
        let dy = player.y - this.y;
    
        // Normalize the vector
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / magnitude;
        let dirY = dy / magnitude;
    
        // Move the Ravager towards the player
        let newX = this.x + dirX * ravagerSpeed;
        let newY = this.y + dirY * ravagerSpeed;

        // Check for collision
        // if (!collisions.checkCollision(newX, newY, this.size)) {
        //     this.x = newX;
        //     this.y = newY;
        // }
    }

    // wander(collisions) {
    //     // Random movement logic and need to update more advance wander method
    //     const moveAmount = 5;
    //     let newX = this.x + (Math.random() - 0.5) * moveAmount;
    //     let newY = this.y + (Math.random() - 0.5) * moveAmount;
    
    //     if (!collisions.checkCollision(newX, newY, this.size)) {
    //         this.x = newX;
    //         this.y = newY;
    //     }
    // }

    // moveLastPlayerPosition(position, collisions) {
    //     let dx = position.x - this.x;
    //     let dy = position.y - this.y;
    //     let distance = Math.sqrt(dx * dx + dy * dy);
    
    //     // Normalize the direction
    //     let dirX = dx / distance;
    //     let dirY = dy / distance;
    
    //     // Try moving directly towards the position
    //     let newX = this.x + dirX * this.walkSpeed;
    //     let newY = this.y + dirY * this.walkSpeed;
    
    //     if (collisions.checkCollision(newX, newY, this.size)) {
    //         // Collision detected, try to move around the obstacle, so adjust direction slightly
    //         let angle = Math.atan2(dy, dx); // calculate the angle in radians
    //         let leftAngle = angle + (50 * Math.PI / 180); // Adjust 50 degrees to the left (180/pi)
    //         let rightAngle = angle - (50 * Math.PI / 180); // Adjust 50 degrees to the right
    
    //         // Calculate new potential positions
    //         let newLeftX = this.x + Math.cos(leftAngle) * this.walkSpeed; //x coordinate horizontal
    //         let newLeftY = this.y + Math.sin(leftAngle) * this.walkSpeed; // y coordinate up
    //         let newRightX = this.x + Math.cos(rightAngle) * this.walkSpeed;
    //         let newRightY = this.y + Math.sin(rightAngle) * this.walkSpeed;// y coordinate down
    
    //         // Check which adjusted position is avaliable
    //         if (!collisions.checkCollision(newLeftX, newLeftY, this.size)) {
    //             this.x = newLeftX;
    //             this.y = newLeftY;
    //         } else if (!collisions.checkCollision(newRightX, newRightY, this.size)) {
    //             this.x = newRightX;
    //             this.y = newRightY;
    //         } else {
    //             // If both are blocked, the Ravager might need to retreat
    //             this.retreat(collisions);
    //         }
            
    //     } else {
    //         // No collision, move directly towards the position
    //         this.x = newX;
    //         this.y = newY;
    //     }
    // }
    // retreat(collisions) {
    //     // needs to think about the logic 
    // }
}
