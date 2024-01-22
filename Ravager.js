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
        this.walkingAnimations = new Animator(this.walkingSpriteSheet, 0, 0, 286, 809, 40, 0.2, 0, false, true  );

        this.attackingSpriteSheet = new Image();
        this.attackingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager-attacking.png"];
        this.attackingAnimations = new Animator(this.attackingSpriteSheet, 0, 0, 286, 723, 40, 0.2, 0, false, true );
        
        this.standingSpriteSheet = new Image();
        this.standingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/Ravager-standing.png"];
        this.standingAnimations = new Animator(this.standingSpriteSheet, 0, 0, 286, 679, 1, 0.03, 0, false, true);
    }

    draw(ctx) {
        let scale = 0.07; // Example scale, adjust as necessary

        switch(this.state) {
            case 'attacking':
                // Draw attacking animation
                this.attackingAnimations.drawFrame(this.game.clockTick, ctx, this.x, this.y, scale);
                break;
            case 'moving':
            case 'running':
                // Draw walking/running animation
                this.walkingAnimations.drawFrame(this.game.clockTick, ctx, this.x, this.y, scale);
                break;
            case 'idle':
            case 'wandering':
                // Draw idle or wandering animation
                this.standingAnimations.drawFrame(this.game.clockTick, ctx, this.x, this.y, scale);
                break;
            default:
                // If state is unknown, you might want to log an error or handle it in some way
                console.error("Unknown state:", this.state);
                break;
        }
    }

    update() {
        switch (this.state) {
            case 'idle':
                this.wander(); // Optionally wander or stay still
                break;
            case 'moving':
            case 'running':
                if (this.canSeePlayer()) {
                    this.followPlayer();
                } else {
                    this.state = 'wandering';
                }
                break;
            case 'attacking':
                // Implement attacking behavior (e.g., stay in place or move towards player)
                break;
            case 'wandering':
                this.wander();
                break;
        }

        this.applyMovement();
        this.updateAnimation();
        console.log(this.x + "calling from ravager class" + this.y);
    }

    handlePlayerVisibility() {
        this.playerInView = true;
        this.lastSeenPlayerTime = new Date();
        this.lastPlayerPosition = { x: this.steve.x, y: this.steve.y };

        // Check if the Ravager should attack the player
        if (this.shouldAttackPlayer()) {
            this.state = 'attacking';
        } else {
            this.state = this.steve.isRunning ? 'running' : 'moving';
            this.followPlayer();
        }
    }

    handlePlayerInvisibility() {
        this.playerInView = false;
        const timeSinceLastSeen = new Date() - this.lastSeenPlayerTime;
        if (timeSinceLastSeen <= 2000) { // 2 seconds threshold
            this.moveTowardsLastSeenPosition();
        } else {
            this.state = 'wandering';
            this.wander();
        }
    }

    applyMovement() {
        // Initialize speed variable.
        let speed = 0;

        // Check and ensure direction is an object before accessing its properties.
        if (typeof this.direction !== 'object' || this.direction === null) {
            this.direction = { x: 0, y: 0 }; // Reinitialize direction if it's not an object.
        }

        // Determine the speed and update direction based on the current state.
        switch (this.state) {
            case 'moving':
                speed = this.walkSpeed;
                // Update direction towards the player.
                this.direction = this.updateDirectionTowardsPlayer();
                break;
            case 'running':
                speed = this.runSpeed;
                // Update direction towards the player.
                this.direction = this.updateDirectionTowardsPlayer();
                break;
            case 'attacking':
                // The Ravager might not move when attacking, hence speed remains 0.
                break;
            case 'wandering':
                speed = this.walkSpeed;
                // Update direction for wandering.
                this.direction = this.updateWanderingDirection();
                break;
            case 'idle':
                // No movement when idle.
                break;
            default:
                console.error("Unhandled state:", this.state);
                break;
        }

        // Apply the movement if speed is greater than 0.
        if (speed > 0) {
            this.x += this.direction.x * speed;
            this.y += this.direction.y * speed;
        }

        // Check for boundary and collision.
        this.handleBoundaryAndCollision();
    }

    updateDirectionTowardsPlayer() {
        // Calculate the vector pointing from the Ravager to the player
        const dx = this.steve.x - this.x;
        const dy = this.steve.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize the vector to get the direction
        return {
            x: distance > 0 ? dx / distance : 0,
            y: distance > 0 ? dy / distance : 0
        };
    }


    updateWanderingDirection() {
        // Update direction randomly for wandering
        // This can be a simple random direction change at intervals
        if (this.shouldChangeDirection()) { // Implement this logic as needed
            this.adjustDirection(Math.random() * 360); // Random angle
        }
    }

    handleBoundaryAndCollision() {
        if (!this.isWithinBounds(this.x, this.y) || this.collisions.isCollision(this.x, this.y)) {
            this.handleCollision();
        }
    }

    hhandleCollision() {
        // Strategy 1: Fallback slightly
        this.fallback();

        // Strategy 2: Adjust direction by 45 degrees
       // this.adjustDirection(45);

        // Strategy 3: Move around the object (more complex)
        //this.navigateAroundObstacle();
    }

    fallback() {
        // Move back slightly in the opposite direction
        this.x -= this.direction.x * this.walkSpeed;
        this.y -= this.direction.y * this.walkSpeed;
    }

    adjustDirection(degree) {
        // Convert degree to radians and adjust the current angle
        let radians = degree * (Math.PI / 180);
        this.angle += radians;

        // Update direction based on the new angle
        this.direction = {
            x: Math.cos(this.angle),
            y: Math.sin(this.angle)
        };
    }
 
    /*update() {
        //console.log("Ravager update called");
        // Check if the Ravager can see the player
        if (this.canSeePlayer()) {
            this.playerInView = true;
            this.lastSeenPlayerTime = new Date();
            this.lastPlayerPosition = { x: this.steve.x, y: this.steve.y };

            // Check if the Ravager should attack the player
            if (this.shouldAttackPlayer()) {
                this.state = 'attacking';
            } else {
                // Follow the player
                this.state = this.steve.isRunning ? 'running' : 'moving';
                this.followPlayer();
            }
        } else {
            // Logic when the player is not visible
            this.playerInView = false;
            if (this.isPlayerRecentlySeen()) {
                // Move towards the last known position of the player
                this.moveTowardsLastSeenPosition();
            } else {
                // Wander around if the player hasn't been seen recently
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