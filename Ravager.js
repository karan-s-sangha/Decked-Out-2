class Ravager {
    constructor(game, steve, collisions, x, y, walkSpeed, runSpeed, size) {
        this.game = game;
        this.steve = steve;

        this.ravagerX = x;
        this.ravagerY = y;
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;
        this.size = 0.25;

        this.attack = false;
        this.push = 300;
        this.attackCoolDown = 0;

        this.attackFlag = false;
       

        this.dx = 0;
        this.dy = 0;

        this.loadAnimations();
        this.state = 'wandering';
        this.collisions = collisions;
        this.wanderMove = 0;
        this.angle = Math.random() * 2 * Math.PI;
        this.moveAttemptTimer = 0; // Timer to track movement attempts
        this.moveAttemptDuration = 2; // Duration in seconds after which to switch state
    }

    findAngle() {
        return Math.atan2(this.steve.playerY - this.ravagerY, this.steve.playerX - this.ravagerX);
    }

    loadAnimations() {
        this.walkingSpriteSheet = new Image();
        this.walkingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager-walking-running.png"];
        this.walkingAnimations = new Animator(this.game, this.walkingSpriteSheet, 0, 0, 286, 809, 95, 0.02, 0, false, true);

        this.attackingSpriteSheet = new Image();
        this.attackingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/ravager-attacking.png"];
        this.attackingAnimations = new Animator(this.game, this.attackingSpriteSheet, 0, 0, 286, 723, 40, 0.02, 0, false, true);

        this.standingSpriteSheet = new Image();
        this.standingSpriteSheet = ASSET_MANAGER.cache["./Art/Ravager_Animations/Ravager-standing.png"];
        this.standingAnimations = new Animator(this.game, this.standingSpriteSheet, 0, 0, 286, 679, 1, 0.02, 0, false, true);
    }

    draw(ctx) {
        let scaleX = this.ravagerX - this.game.camera.cameraX;
        let scaleY = this.ravagerY - this.game.camera.cameraY;


        switch (this.state) {
            case 'attacking':
                this.angle = this.findAngle();
                // Draw attacking animation
                this.attackingAnimations.drawFrameAngle(this.game.clockTick, ctx, scaleX, scaleY, this.size, this.angle + Math.PI / 2);
                break;
            case 'running':
                this.angle = this.findAngle();
                // Draw walking/running animation
                this.walkingAnimations.drawFrameAngle(this.game.clockTick, ctx, scaleX, scaleY, this.size, this.angle + Math.PI / 2);
                break;
            case 'wandering':
                // Draw wandering animation
                this.walkingAnimations.drawFrameAngle(this.game.clockTick, ctx, scaleX, scaleY, this.size, this.angle + Math.PI / 2);
                break;
            default:
                // If state is unknown, you might want to log an error or handle it in some way
                break;
        }

        ctx.strokeStyle = "red";
        ctx.strokeRect(scaleX, scaleY, 3, 3);
        
    }

    update() {
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

    }

    canSeePlayer() {
        const visibilityDistance = 300;
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

        if (distanceToPlayer > visibilityDistance) {
            return false;
        }

        // draw a line 
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 1; i <= steps; i++) { //want to check every single steps 
            const checkX = this.ravagerX + (dx / steps) * i;
            const checkY = this.ravagerY + (dy / steps) * i;

            if (this.collisions.isCollisionRavager(checkX, checkY, this.size)) {
                return false; // false if ther is a wall
            }
        }

        return true; // Clear line of sight to the player
    }


    shouldAttackPlayer() {
        const attackDistance = 50;
        const dx = this.steve.playerX - this.ravagerX;
        const dy = this.steve.playerY - this.ravagerY;
        return Math.sqrt(dx * dx + dy * dy) < attackDistance;
    }

    followPlayer() {
        const ravagerSpeed = this.steve.playerWalkSpeed * 0.8;
        let dx = this.steve.playerX - this.ravagerX;
        let dy = this.steve.playerY - this.ravagerY;

        let magnitude = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / magnitude;
        let dirY = dy / magnitude;

        let nextX = this.ravagerX + dirX * ravagerSpeed * this.game.clockTick;
        let nextY = this.ravagerY + dirY * ravagerSpeed * this.game.clockTick;

        if (this.collisions.isCollisionRavager(nextX, nextY, this.size)) { // if there has a collision 
            this.avoidObstacle(nextX, nextY, this.steve.playerWalkSpeed / 2);
            this.moveAttemptTimer += this.game.clockTick;
            if (this.moveAttemptTimer > this.moveAttemptDuration) {
                // If stuck for more than the duration, switch to wandering behavior
                this.state = 'wandering';
                this.wander();
                this.moveAttemptTimer = 0; // Reset the timer
            }
        } else {
            // If able to move, reset the timer
            this.ravagerX = nextX;
            this.ravagerY = nextY;
            this.moveAttemptTimer = 0;
        }
    }



    avoidObstacle(predictedX, predictedY, speed) {
        let foundPath = false; // found the path or not for boolean
        // i will move 10 degrees to see there has a good path to move or not
        for (let angle = 0; angle <= 2 * Math.PI; angle += Math.PI / 18) {
            let newX = this.ravagerX + Math.cos(angle) * speed * this.game.clockTick;
            let newY = this.ravagerY + Math.sin(angle) * speed * this.game.clockTick;

            if (!this.collisions.isCollisionRavager(newX, newY, this.size)) {
                this.ravagerX = newX;
                this.ravagerY = newY;
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
        if (this.wanderMove <= 0) {
            const angleChange = Math.random() * Math.PI - Math.PI / 2;
            this.angle += angleChange;
            this.wanderMove = Math.floor(Math.random() * 1000);
        } else {
            const speed = 75 + Math.random() * 0.5;
            let newX = this.ravagerX + Math.cos(this.angle) * speed * this.game.clockTick;
            let newY = this.ravagerY + Math.sin(this.angle) * speed * this.game.clockTick;
            const lookAheadX = newX + Math.cos(this.angle) * this.size;
            const lookAheadY = newY + Math.sin(this.angle) * this.size;

            if (!this.collisions.isCollisionRavager(lookAheadX, lookAheadY, this.size)) {
                this.ravagerX = newX;
                this.ravagerY = newY;
                this.wanderMove--;
            } else {
                this.wanderMove = 0;
            }
        }
    }

}