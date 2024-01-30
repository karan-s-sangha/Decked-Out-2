class Ravager {
    constructor(game, steve,collisions, x, y, walkSpeed, runSpeed,size) {
        this.game = game;
        this.steve = steve;
        this.ravagerX = x;
        this.ravagerY = y;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.size = size;      
   
        this.loadAnimations();
        this.state = 'wandering';
        this.collisions = collisions;
        this.wanderMove = 0;
        this.angle = Math.random() * 2 * Math.PI;

        this.path = []; // Path for A* pathfinding
        this.isStuckCounter = 0; // Counter to keep track of stuck state
        this.lastPosition = { x: this.ravagerX, y: this.ravagerY }; // Last known position for stuck detection
     }

    findAngle() {
        return Math.atan2(this.steve.playerY - this.ravagerY, this.steve.playerX - this.ravagerX);
    }

    loadAnimations() {
        this.walkingSpriteSheet = new Image();
        this.walkingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager-walking-running.png"];
        this.walkingAnimations = new Animator(this.game, this.walkingSpriteSheet, 0, 0, 286, 809, 95, 0.02, 0, false, true  );

        this.attackingSpriteSheet = new Image();
        this.attackingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager-attacking.png"];
        this.attackingAnimations = new Animator(this.game, this.attackingSpriteSheet, 0, 0, 286, 723, 40, 0.02, 0, false, true );
        
        this.standingSpriteSheet = new Image();
        this.standingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/Ravager-standing.png"];
        this.standingAnimations = new Animator(this.game, this.standingSpriteSheet, 0, 0, 286, 679, 1, 0.02, 0, false, true);
    }

    draw(ctx) {
        let scale = 0.25; 
        let scaleX = this.ravagerX - this.game.camera.cameraX;
        let scaleY = this.ravagerY - this.game.camera.cameraY;
        
        switch(this.state) {
            case 'attacking':
                this.angle = this.findAngle();
                // Draw attacking animation
                this.attackingAnimations.drawFrameAngle(this.game.clockTick, ctx, scaleX, scaleY, scale, this.angle + Math.PI/2);
                break;
            case 'running':
                this.angle = this.findAngle();
                // Draw walking/running animation
                this.walkingAnimations.drawFrameAngle(this.game.clockTick, ctx, scaleX, scaleY, scale, this.angle + Math.PI/2);
                break;
            case 'wandering':
                // Draw wandering animation
                this.walkingAnimations.drawFrameAngle(this.game.clockTick, ctx, scaleX, scaleY, scale, this.angle + Math.PI/2);
                break;
            default:
                // If state is unknown, you might want to log an error or handle it in some way
                console.error("Unknown state:", this.state);
                break;
        }

        ctx.strokeStyle = "red";
        ctx.strokeRect(scaleX, scaleY, 3, 3);
        ctx.save();
    }

    update() {
        if (this.canSeePlayer() && this.steve.health > 0){
           if (this.shouldAttackPlayer()) {
               this.state = 'attacking'; 
               this.steve.health -= 7.5;

               let dx = this.steve.playerX - this.ravagerX;
               let dy = this.steve.playerY - this.ravagerY;
           
               // Normalize the vector
               let magnitude = Math.sqrt(dx * dx + dy * dy);
               let dirX = dx / magnitude;
               let dirY = dy / magnitude;
           
               // Move the Ravager towards the player
               let newX = this.steve.playerX + dirX * 300;
               let newY = this.steve.playerY + dirY * 300;

               if (!this.collisions.isCollision(newX, newY)) {
                this.steve.playerX = newX;
                this.steve.playerY = newY;
            }
               
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
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        return Math.sqrt(dx * dx + dy * dy) < visibilityDistance;
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
        const ravagerSpeed = this.steve.playerWalkSpeed * 1.2;

        // Calculate the vector from the Ravager to the player
        let dx = this.steve.playerX - this.ravagerX;
        let dy = this.steve.playerY - this.ravagerY;
    
        // Normalize the vector
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / magnitude;
        let dirY = dy / magnitude;
    
        // Move the Ravager towards the player
        let newX = this.ravagerX + dirX * ravagerSpeed;
        let newY = this.ravagerY + dirY * ravagerSpeed;
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
        if (this.wanderMove <= 0) {
            const angleChange = Math.random() * Math.PI - Math.PI / 2; 
            this.angle += angleChange;
            this.wanderMove = Math.floor(Math.random() * 1000);
        } else {
            const speed = 0.5 + Math.random() * 0.5; 
            let newX = this.ravagerX + Math.cos(this.angle) * speed;
            let newY = this.ravagerY + Math.sin(this.angle) * speed;
            const lookAheadX = newX + Math.cos(this.angle) * this.size;
            const lookAheadY = newY + Math.sin(this.angle) * this.size;
    
            if (!this.collisions.isCollision(lookAheadX, lookAheadY)) {
                this.ravagerX = newX;
                this.ravagerY = newY;
                this.wanderMove--;
            } else {
                this.wanderMove = 0;
            }
        }
    }
    
}