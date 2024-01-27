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
        switch(this.state) {
            case 'attacking':
                // Draw attacking animation
                this.attackingAnimations.drawFrame(this.game.clockTick, ctx, scaleX, scaleY, scale);
                break;
            case 'running':
                // Draw walking/running animation
                this.walkingAnimations.drawFrame(this.game.clockTick, ctx, scaleX, scaleY, scale);
                break;
            case 'wandering':
                // Draw idle or wandering animation
                this.standingAnimations.drawFrame(this.game.clockTick, ctx, scaleX, scaleY, scale);
                break;
            default:
                // If state is unknown, you might want to log an error or handle it in some way
                console.error("Unknown state:", this.state);
                break;
        }
    }
// change location
    update() {
        if (this.canSeePlayer()){
            if (this.shouldAttackPlayer()) {
                this.state = 'attacking'; //need to implement the logic here 
            } else {
                this.state = 'running';
                this.followPlayer();
            }
        }
        else {
            this.state = 'wandering';
            this.wander();
        }
    }

    canSeePlayer() {
        const visibilityDistance = 300; 
        const dx = this.steve.playerX - this.playerX;
        const dy = this.steve.playerY - this.playerY;
        return Math.sqrt(dx * dx + dy * dy) < visibilityDistance;
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

    moveTo(targetX, targetY, speed) {
        const dx = targetX - this.ravagerX;
        const dy = targetY - this.ravagerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.state = this.steve.isRunning ? 'running' : 'moving';

        if (distance > 0) {
            this.ravagerX += (dx / distance) * speed;
            this.ravagerY += (dy / distance) * speed;
        }
    }
    shouldAttackPlayer() {
        const attackDistance = 50;
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        return Math.sqrt(dx * dx + dy * dy) < attackDistance;
    }

    followPlayer() {
        // Determine ravager's speed based on player's heath state
        const ravagerSpeed = this.steve.speed + 2;

        // Calculate the vector from the Ravager to the player
        let dx = this.steve.playerX - this.ravagerX;
        let dy = this.steve.playerY - this.ravagerY;
    
        // Normalize the vector
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / magnitude;
        let dirY = dy / magnitude;
    
        // Move the Ravager towards the player
        let newX = this.x + dirX * ravagerSpeed;
        let newY = this.y + dirY * ravagerSpeed;
        // Check for boundary and collision before moving
        if (!this.collisions.isCollision(newX, newY)) {
            this.ravagerX = newX;
            this.ravagerY = newY;
        }
        else {
            this.wander();
            this.state = 'wandering';
        }
    }

    wander() {
        let angle = Math.random() * 2 * Math.PI; // Choose a random direction
        let newX = this.ravagerX + Math.cos(angle) * this.walkSpeed;
        let newY = this.ravagerY + Math.sin(angle) * this.walkSpeed;
        if (!this.collisions.isCollision(newX, newY)) {
            this.ravagerX = newX;
            this.ravagerY = newY;
        } 
        
    }
    
   
    

}