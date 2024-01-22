const LOW_HEALTH = 10; // constant value for palyer health

class Ravager {
    constructor(game, steve,collisions, x, y, walkSpeed, runSpeed,size) {
        this.game = game;
        this.steve = steve;
        this.x = x;
        this.y = y;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.size = size;
        this.playerInView = false;
        this.lastSeenPlayerTime = null;
        this.lastPlayerPosition = { x: null, y: null }; // Stores the last known position of the player
        this.direction = { x: 0, y: 0 };
        this.loadAnimations();
        this.state = 'idle';
        this.angle=0;
        
        this.collisions = collisions;
    }
    

    loadAnimations() {
        this.walkingSpriteSheet = new Image();
        this.walkingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager-walking-running.png"];
        this.walkingAnimations = new Animator(this.walkingSpriteSheet, 0, 0, 286, 809, 40, 0.2, 0, false, true);

        this.attackingSpriteSheet = new Image();
        this.attackingSpriteSheet.src = "./Art/Level_1_UpperView_Art/ravager-atacking.png";
        this.attackingAnimations = new Animator(this.attackingSpriteSheet, 290, 0, 286, 723, 40, 0.2, 14, false, true );
        console.log("passed");
    }

    //draw(ctx) {
        // Draw the Mario image on top of the black background
    //  ctx.drawImage(this.spritesheet, 209, 0, 32, 16, this.x, this.y, 64,32);
    // this.animations.drawFrame(this.game.clockTick,ctx,this.x,this.y,3);
    // console.log("pass"); let angle = 0; // Default angle for 'idle' and 'wandering'
    draw(ctx) {
        let angle = 0; // Default angle if not 'moving' or 'running'
    
        if (this.state === 'moving' || this.state === 'running') {
            // Calculate angle towards the player
            angle = Math.atan2(this.lastPlayerPosition.y - this.y, this.lastPlayerPosition.x - this.x);
            if (angle < 0) angle += Math.PI * 2;
        }
    
        // Optionally, include different logic for 'attacking' or other states
    
        // Choose the appropriate animator based on the state
        if (this.state === 'attacking') {
            // Use attackingAnimations
            this.attackingAnimations.drawFrameAngle(this.game.clockTick, ctx, this.x, this.y, 3, angle);
        } else {
            // Default to walkingAnimations for other states
            this.walkingAnimations.drawFrameAngle(this.game.clockTick, ctx, this.x, this.y, 3, angle);
        }
    }
    

    //update(player, collisions) {
    // update(player) {
    //     if (this.canSeePlayer(player)) {
    //         this.playerInView = true; // if player is in view
    //         this.lastSeenPlayerTime = new Date(); // get a time that ravagener sees player
    //         this.lastPlayerPosition = { x: player.x, y: player.y }; // Update the last known position
    //         this.followPlayer(player);
    //         this.state = 'moving';
    //     } else {
    //         if (this.playerInView && (new Date() - this.lastSeenPlayerTime > 2000)) {// if it is more than 2 secs
    //             this.playerInView = false;
    //             // Only move to the last known position if it's set
    //             if (this.lastPlayerPosition.x !== null && this.lastPlayerPosition.y !== null) {
    //                 this.moveLastPlayerPosition(this.lastPlayerPosition);
    //                 this.state = 'idle';
    //             } else {
    //                 //this.wander(collisions);
    //             }
    //         } else {
    //            // this.wander(collisions);// fallback
    //         }
    //     }
    // }
    update(player) {
        if (this.canSeePlayer(player)) {
            this.playerInView = true;
            this.lastSeenPlayerTime = new Date();
            this.lastPlayerPosition = { x: player.x, y: player.y };

            // Determine state based on conditions
            this.state = (player.health <= LOW_HEALTH) ? 'running' : 'moving';

            this.followPlayer(player); // Call followPlayer
        } else {
            // Logic for when the player is out of view
            if (this.playerInView && (new Date() - this.lastSeenPlayerTime > 2000)) {
                this.playerInView = false;
                this.state = 'wandering';
                this.wander();
            }
        }

        // Update the animation based on the current state
        this.updateAnimation();
    }*/

    isPlayerRecentlySeen() {
        const timeSinceLastSeen = new Date() - this.lastSeenPlayerTime;
        return timeSinceLastSeen <= 2000; // 2 seconds threshold
    }
    
    shouldAttackPlayer(player) {
        // Implement logic to decide if the Ravager should attack
        // Example: Attack if within a certain distance
        const attackDistance = 50; // Example distance
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) < attackDistance;
    }
    

    updateAnimation() {
        switch (this.state) {
            case 'moving':
                // Adjust animation for walking
                this.walkingAnimations.frameDuration = 0.3; // Slower frame rate for walking
                break;
            case 'running':
                // Adjust animation for running
                this.walkingAnimations.frameDuration = 0.1; // Faster frame rate for running
                break;
            case 'attacking':
               this.attackingAnimations.frameDuration = 0.2;
                break;
            case 'idle':
                // Use idle animation
                this.standingAnimations.frameDuration = 0.4;
                break;
        }
    }
    shouldAttackPlayer() {
        // Example: Attack if within a certain distance
        const attackDistance = 50;
        const dx = this.steve.x - this.x;
        const dy = this.steve.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) < attackDistance;
    }

    canSeePlayer() {
        // Basic visibility logic (e.g., based on distance)
        const visibilityDistance = 300; // example distance
        const dx = this.steve.x - this.x;
        const dy = this.steve.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) < visibilityDistance;
    }


   //followPlayer() {
    /*const dx = this.steve.x - this.x;
    const dy = this.steve.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        const dirX = dx / distance;
        const dirY = dy / distance;
        const newX = this.x + dirX * this.walkSpeed;
        const newY = this.y + dirY * this.walkSpeed;

        // Simplified boundary check
        console.log("Boundary Check for:", newX, newY, "is", this.isWithinBounds(newX, newY));
        if (this.isWithinBounds(newX, newY)) {
            // Simplified collision check
            console.log("Collision Check for:", newX, newY, "is", this.collisions.isCollision(newX, newY));
            if (!this.collisions.isCollision(newX, newY)) {
                this.x = newX;
                this.y = newY;
            }
        }

        console.log("Following player. New Position:", this.x, this.y);
    }*/

    

   followPlayer() {
        // Determine ravager's speed based on player's heath state
        const ravagerSpeed = (this.steve.isRunning || this.steve.health <= LOW_HEALTH) ? this.runSpeed : this.walkSpeed;

        // Calculate the vector from the Ravager to the player
        let dx = this.steve.x - this.x;
        let dy = this.steve.y - this.y;
    
        // Normalize the vector
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / magnitude;
        let dirY = dy / magnitude;
    
        // Move the Ravager towards the player
        let newX = this.x + dirX * ravagerSpeed;
        let newY = this.y + dirY * ravagerSpeed;
        // Check for boundary and collision before moving
        if (this.isWithinBounds(newX, newY) && !this.collisions.isCollision(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
    }

    wander() {
        console.log(this.x + "calling from ravager class" + this.y);
        // Random movement logic and need to update more advance wander method
        const moveAmount = 2; // speed of wandering
        let newX = this.x + (Math.random() - 0.5) * moveAmount;
        let newY = this.y + (Math.random() - 0.5) * moveAmount;
    
    
        // if (!collisions.checkCollision(newX, newY, this.size)) {
        //     this.x = newX;
        //     this.y = newY;
        // }
        if (this.isWithinBounds(newX, newY) && !this.collisions.isCollision(newX, newY)) {// need ot add collision
            this.x = newX;
            this.y = newY;
            console.log(this.x + "X" + this.y + "Y");
        }
    }
    isWithinBounds(x, y) {
        const leftBound = 0;
        const rightBound = this.game.surfaceWidth; 
        const topBound = 0;
        const bottomBound = this.game.surfaceHeight;
    
        // Check if the new position is within the bounds
        return x >= leftBound && x <= rightBound && y >= topBound && y <= bottomBound;
    }
    
moveTowardsLastSeenPosition() {
    const dx = this.lastPlayerPosition.x - this.x;
    const dy = this.lastPlayerPosition.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
        const dirX = dx / distance;
        const dirY = dy / distance;
        let newX = this.x + dirX * this.walkSpeed;
        let newY = this.y + dirY * this.walkSpeed;

        // Check for collision and boundary before moving
        if (this.isWithinBounds(newX, newY) && !this.collisions.isCollision(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
    } else {
        // If the Ravager reaches the last seen position, it can start wandering
        this.state = 'wandering';
    }
}


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
