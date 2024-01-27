const LOW_HEALTH = 10; // constant value for palyer health

class Ravager {
    constructor(game, steve,collisions, x, y, walkSpeed, runSpeed,size) {
        this.game = game;
        this.steve = steve;
        this.ravagerX = x;
        this.ravagerY = y;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.size = size;
        this.playerInView = false;
        this.lastSeenPlayerTime = null;
        this.lastPlayerPosition = { x: null, y: null }; // Stores the last known position of the player
        this.directionX = 0;
        this.directionY =  0;
        this.loadAnimations();
        this.state = 'wandering';
        this.collisions = collisions;

        this.angle = Math.random() * 2 * Math.PI;
        

        this.stuckTime = 0;
        this.maxStuckTime = 2000;

    }
    

    loadAnimations() {
        this.walkingSpriteSheet = new Image();
        this.walkingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager-walking-running.png"];
        this.walkingAnimations = new Animator(this.game, this.walkingSpriteSheet, 0, 0, 286, 809, 40, 0.03, 0, false, true  );

        this.attackingSpriteSheet = new Image();
        this.attackingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager-attacking.png"];
        this.attackingAnimations = new Animator(this.game, this.attackingSpriteSheet, 0, 0, 286, 723, 40, 0.03, 0, false, true );
        
        this.standingSpriteSheet = new Image();
        this.standingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/Ravager-standing.png"];
        this.standingAnimations = new Animator(this.game, this.standingSpriteSheet, 0, 0, 286, 679, 1, 0.03, 0, false, true);
    }
// draw coresponding image
    draw(ctx) {
        let scale = 0.25; 
        let scaleX = this.ravagerX - this.game.camera.cameraX;
        let scaleY = this.ravagerY - this.game.camera.cameraY;
       // console.log("scalex   " + scaleX + "scaley   " + scaleY);

        // switch(this.state) {
        //     case 'attacking':
        //         // Draw attacking animation
        //         this.attackingAnimations.drawFrame(this.game.clockTick, ctx, scaleX, scaleY, scale);
        //         break;
        //     case 'moving':
        //     case 'running':
        //         // Draw walking/running animation
        //         this.walkingAnimations.drawFrame(this.game.clockTick, ctx, scaleX, scaleY, scale);
        //         break;
        //     //case 'idle':
        //     case 'wandering':
        //         // Draw idle or wandering animation
        //         this.standingAnimations.drawFrame(this.game.clockTick, ctx, scaleX, scaleY, scale);
        //         //console.log("scalex   " + scaleX + "scaley   " + scaleY);
        //         break;
        //     default:
        //         // If state is unknown, you might want to log an error or handle it in some way
        //         console.error("Unknown state:", this.state);
        //         break;
        // }
        this.attackingAnimations.drawFrame(this.game.clockTick, ctx, scaleX, scaleY, scale);
        ctx.strokeStyle = "red";
        ctx.strokeRect(scaleX, scaleY, 3, 3);
        ctx.save();
    }
// change location
    update() {
        //let now = new Date().getTime();
      //  const currentTime = new Date().getTime();
        
       // if (this.lastUpdateTime) {
            //const deltaTime = currentTime - this.lastUpdateTime;
            console.log(`Delta time since last update: ${this.game.clockTick} ms`);
        //}

    //     this.lastUpdateTime = currentTime;

    //     // Handling the 'stuck' state
    //     // if (this.state === 'stuck') {
    //     //     if (now - this.stuckTime > this.maxStuckTime) {
    //     //         this.state = 'wandering';
    //     //         this.angle = Math.random() * 2 * Math.PI;
    //     //         this.stuckTime = 0;
    //     //     }
    //     // } else {
    //         //console.log(`Ravager position at start of update: (${this.ravagerX}, ${this.ravagerY})`);
    //        // console.log("can see " + this.canSeePlayer());
    //         if (this.canSeePlayer()) {
    //         this.playerInView = true;
    //         this.lastSeenPlayerTime = new Date();
    //         this.lastPlayerPosition = { x: this.steve.playerX, y: this.steve.playerY };
    //         this.moveTo(this.steve.playerX, this.steve.playerY, this.canRun() ? this.runSpeed : this.walkSpeed);
    //        // console.log("move To " + this.steve.playerX + this.steve.playerY);
    //     } else {
    //         const timeSinceLastSeen = new Date() - this.lastSeenPlayerTime;
    //         if (this.playerInView && timeSinceLastSeen <= 2000) {
    //             this.moveTo(this.lastPlayerPosition.x, this.lastPlayerPosition.y, this.walkSpeed);
    //         } else {
    //             this.playerInView = false;
    //             this.state = 'wandering';
    //             this.wander();
    //         }
    //   //  }
    // }

    //    this.updateAnimation();
    //     this.handleBoundaryAndCollision();
        if(this.canSeePlayer() && !this.collisions.isCollision(this.ravagerX, this.ravagerY)){
            this.moveTo(this.steve.playerX, this.steve.playerY,1);
        } else if (!this.collisions.isCollision(this.ravagerX, this.ravagerY)){
            this.wander();
        }
       
    }


   /* update() {
        if (this.canSeePlayer()) {
            this.playerInView = true;
            this.lastSeenPlayerTime = new Date();
            this.lastPlayerPosition = { x: this.steve.playerX, y: this.steve.playerY };

            if (this.shouldAttackPlayer()) {
                this.state = 'attacking';
            } else {
                this.state = 'moving';
                this.moveTo(this.steve.playerX, this.steve.playerY, this.canRun() ? this.runSpeed : this.walkSpeed);
            }
        } else {
            const timeSinceLastSeen = new Date() - this.lastSeenPlayerTime;
            if (this.playerInView && timeSinceLastSeen <= 2000) {
                this.moveTo(this.lastPlayerPosition.x, this.lastPlayerPosition.y, this.walkSpeed);
            } else {
                this.playerInView = false;
                this.state = 'wandering';
                this.wander();
            }
        }

        if (this.canSeePlayer()) {
            this.playerInView = true;
            this.lastSeenPlayerTime = new Date();
            this.lastPlayerPosition = { x: this.steve.playerX, y: this.steve.playerY };
            this.moveTo(this.steve.playerX, this.steve.playerY, this.canRun() ? this.runSpeed : this.walkSpeed);
           // console.log("move To " + this.steve.playerX + this.steve.playerY);
        } else {
            const timeSinceLastSeen = new Date() - this.lastSeenPlayerTime;
            if (this.playerInView && timeSinceLastSeen <= 2000) {
                this.moveTo(this.lastPlayerPosition.x, this.lastPlayerPosition.y, this.walkSpeed);
            } else {
                this.playerInView = false;
                this.state = 'wandering';
                this.wander();
            }
        }

        this.updateAnimation();
        this.handleBoundaryAndCollision();
    }*/
    canRun() {
        return this.steve.health <= 10; // LOW_HEALTH threshold
    }

    moveTo(targetX, targetY, speed) {
        const dx = targetX - this.ravagerX;
        const dy = targetY - this.ravagerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxStep = speed; 
    
        if (distance > 0 && !this.collisions.isCollision(this.ravagerX +(dx / distance) * maxStep, this.ravagerY += (dy / distance) * maxStep)) {
            
            this.ravagerX += (dx / distance) * maxStep;
            this.ravagerY += (dy / distance) * maxStep;
        }
    }

    wander() {
        let angle = Math.random() * 2 * Math.PI;
        this.moveTo(this.ravagerX + Math.cos(angle) * 100, this.ravagerY + Math.sin(angle) * 100, this.walkSpeed);
    }

    handleBoundaryAndCollision() {
        let futureX = this.ravagerX + Math.cos(this.angle) * this.walkSpeed;
        let futureY = this.ravagerY + Math.sin(this.angle) * this.walkSpeed;

        if (this.checkPathForCollision(this.ravagerX, this.ravagerY, futureX, futureY)) {
            //this.state = 'stuck';
            this.stuckTime = new Date().getTime(); 
            this.findNewDirection();
        } else {
            this.ravagerX = futureX;
            this.ravagerY = futureY;
        }
    }

    checkPathForCollision(startX, startY, endX, endY) {
        const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
        const stepX = (endX - startX) / steps;
        const stepY = (endY - startY) / steps;

        for (let i = 0; i <= steps; i++) {
            let checkX = startX + stepX * i;
            let checkY = startY + stepY * i;
            if (this.collisions.isCollision(checkX, checkY)) {
                return true; // Collision detected
            }
        }
        return false; // No collision detected
    }


    findNewDirection() {
        this.angle = Math.random() * 2 * Math.PI;
        this.angle %= (2 * Math.PI);
    }

    canSeePlayer() {
        const visibilityDistance = 300; 
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
    
        console.log(`Player position for steve: (${this.steve.playerX}, ${this.steve.playerY})`);
        console.log(`Ravager position: (${this.ravagerX}, ${this.ravagerY})`);
        console.log(`Distance to player: ${distanceToPlayer}`);
    
        if (distanceToPlayer < visibilityDistance) {
            const lineOfSightClear = this.isLineOfSightClear(this.ravagerX, this.ravagerY, this.steve.playerX, this.steve.playerY);
            console.log(`Line of sight clear: ${lineOfSightClear}`);
            //return lineOfSightClear;
            return true;
        }
    
        return false;
    }
    

    shouldAttackPlayer() {
        const attackDistance = 250; 
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
       // console.log("for steve" + this.steve.playerX + "y" + this.steve.playerY);
        //console.log ("distanceToPlayer   " + distanceToPlayer) ; 
        if (distanceToPlayer < attackDistance) {
            return this.isLineOfSightClear(this.ravagerX, this.ravagerY, this.steve.playerX, this.steve.playerY);
        }
        return false;
    }


    isWithinBounds(x, y) {
        const leftBound = 0;
        const rightBound = this.game.surfaceWidth;
        const topBound = 0;
        const bottomBound = this.game.surfaceHeight;
        return x >= leftBound && x <= rightBound && y >= topBound && y <= bottomBound;
    }

    updateAnimation() {
        switch (this.state) {
            case 'moving':
                // Adjust animation for walking
                this.walkingAnimations.frameDuration = 1; // Slower frame rate for walking
                break;
            case 'running':
                // Adjust animation for running
                this.walkingAnimations.frameDuration = 1; // Faster frame rate for running
                break;
            case 'attacking':
               this.attackingAnimations.frameDuration = 1;
                break;
        }
    }

    isLineOfSightClear(x1, y1, x2, y2) {
       
        // let dx = Math.abs(x2 - x1);
        // let dy = -Math.abs(y2 - y1);
        // let sx = (x1 < x2) ? 1 : -1;
        // let sy = (y1 < y2) ? 1 : -1;
        // let error = dx + dy;

        // while (true) {
        //     // Check for collision at the current point
        //     console.log(this.collisions.isCollision(x1, y1));
        //     if (this.collisions.isCollision(x1, y1)) {

        //         return false; // Collision detected
        //     }

        //     if (x1 === x2 && y1 === y2) break; // End point reached

        //     let e2 = 2 * error;
        //     if (e2 >= dy) {
        //         if (x1 === x2) break;
        //         error += dy;
        //         x1 += sx;
        //     }
        //     if (e2 <= dx) {
        //         if (y1 === y2) break;
        //         error += dx;
        //         y1 += sy;
        //     }
        // }

        return true; // No collision detected along the line
    }
}


















   /* update() {
        if (this.canSeePlayer()) {
            this.handlePlayerVisibility();
        } else {
            this.handlePlayerInvisibility();
        }
        this.applyMovement();
        this.updateAnimation();
    }

    handlePlayerVisibility() {
        this.playerInView = true;
        this.lastSeenPlayerTime = new Date();
        this.lastPlayerPosition = { x: this.steve.x, y: this.steve.y };

        if (this.shouldAttackPlayer()) {
            this.state = 'attacking';
        } else {
            this.state = 'moving';
        }
    }

    handlePlayerInvisibility() {
        if (this.isPlayerRecentlySeen()) {
            this.moveTowardsLastSeenPosition();
        } else {
            this.state = 'wandering';
        }
    }

    applyMovement() {
        switch (this.state) {
            case 'moving':
                this.moveTowards(this.steve.x, this.steve.y, this.walkSpeed);
                break;
            case 'running':
                this.moveTowards(this.steve.x, this.steve.y, this.runSpeed);
                break;
            case 'wandering':
                this.wander();
                break;
            case 'attacking':
                // No movement logic for attacking
                break;
        }
    }

    moveTowards(targetX, targetY, speed) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
            this.handleBoundaryAndCollision();
        }
    }

    wander() {
        // Random wandering logic
        const angle = Math.random() * 2 * Math.PI;
        const moveAmount = 5; // Speed of wandering
        this.x += Math.cos(angle) * moveAmount;
        this.y += Math.sin(angle) * moveAmount;
        this.handleBoundaryAndCollision();
    }

    handleBoundaryAndCollision() {
        if (!this.isWithinBounds(this.x, this.y) || this.collisions.isCollision(this.x, this.y)) {
            this.handleCollision();
        }
    }

    handleCollision() {
        
        this.fallback();
    }

    fallback() {
        // Move back slightly in the opposite direction
        this.x -= this.directionX * this.walkSpeed;
        this.y -= this.directionY * this.walkSpeed;
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
        }
    }
    shouldAttackPlayer() {
        const attackDistance = 50;
        const dx = this.steve.playerX - this.x;
        const dy = this.steve.playerY - this.y;
        return Math.sqrt(dx * dx + dy * dy) < attackDistance;
    }

    canSeePlayer() {
        const visibilityDistance = 50; // example distance
        const dx = this.steve.playerX - this.x;
        const dy = this.steve.playerY - this.y;
        return Math.sqrt(dx * dx + dy * dy) < visibilityDistance;
    }

   followPlayer() {
        // Determine ravager's speed based on player's heath state
        const ravagerSpeed = (this.steve.isRunning || this.steve.health <= LOW_HEALTH) ? this.runSpeed : this.walkSpeed;

        // Calculate the vector from the Ravager to the player
        let dx = this.steve.playerX - this.x;
        let dy = this.steve.playerY - this.y;
    
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

    // wander() {
    //     const moveAmount = 5; // speed of wandering
    //     let newX = this.x + (Math.random() - 0.5) * moveAmount;
    //     let newY = this.y + (Math.random() - 0.5) * moveAmount;
    //     console.log(newX + "X value  from wander " + newY + "Y value from wander");
    //     if (this.isWithinBounds(newX, newY) && !this.collisions.isCollision(newX, newY)) {
    //         this.x = newX;
    //         this.y = newY;
            
    //     }
    // }
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
}*/

