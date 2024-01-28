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
        if (this.canSeePlayer()){
           if (this.shouldAttackPlayer()) {
               this.state = 'attacking'; //need to implement the logic here 
           } else {
               this.state = 'running';
                this.followPlayer();
                console.log("running");
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
        const ravagerSpeed = this.steve.playerSpeed / 2;

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

   /* wander() {
        if(this.wanderMove <= 0) {
            this.angle = Math.random() * 2 * Math.PI; // Choose a random direction   //45Deg
            this.wanderMove = Math.floor(Math.random() * 500);                                   //25moves
        } else {
            let newX = this.ravagerX + Math.cos(this.angle) * this.walkSpeed;
            let newY = this.ravagerY + Math.sin(this.angle) * this.walkSpeed;
           
            if (!this.collisions.isCollision(newX, newY)) {
                this.ravagerX = newX;
                this.ravagerY = newY;
            }
           
        }
        console.log(this.wanderMove);
        this.wanderMove--;
    }*/





    wander() {
        if (this.isStuck() && this.path.length === 0) { 
            let target = this.chooseNewTarget();
            this.path = this.calculatePath(this.ravagerX, this.ravagerY, target.x, target.y);
        }
        this.followPath();
        this.updateStuckState();
    }

    chooseNewTarget() {
        // Choose a random point within the visible area for the new target
        const maxX = this.game.canvas.width;
        const maxY = this.game.canvas.height;
        return { x: Math.random() * maxX, y: Math.random() * maxY };
    }

    isStuck() {
        const minDistanceMoved = 15;
        const stuckFramesThreshold = 50;
        const distanceMoved = this.distance(this.ravagerX, this.ravagerY, this.lastPosition.x, this.lastPosition.y);
        return distanceMoved < minDistanceMoved && this.isStuckCounter > stuckFramesThreshold;
    }

    updateStuckState() {
        if (this.isStuck()) {
            this.isStuckCounter++;
        } else {
            this.isStuckCounter = 0;
            this.lastPosition = { x: this.ravagerX, y: this.ravagerY };
        }
    }

    followPath() {
        if (this.path.length > 0) {
            const targetNode = this.path[0];
            if (this.moveToTargetNode(targetNode)) {
                this.path.shift(); // Target reached, remove it from the path
            }
        } else {
            this.randomWandering(); // Continue random wandering if no path
        }
    }

    randomWandering() {
        // Adjust random wandering to change direction less frequently
        if (this.wanderMove <= 0 || this.isStuck()) {
            this.angle = Math.random() * 2 * Math.PI; // Change direction
            this.wanderMove = Math.floor(Math.random() * 700); // Adjust move count
        } else {
            this.performWanderingMove();
        }
        this.wanderMove--;
    }

    performWanderingMove() {
        let newX = this.ravagerX + Math.cos(this.angle) * this.walkSpeed;
        let newY = this.ravagerY + Math.sin(this.angle) * this.walkSpeed;
        if (!this.collisions.isCollision(newX, newY)) {
            this.ravagerX = newX;
            this.ravagerY = newY;
        }
    }

    moveToTargetNode(targetNode) {
        const distanceToTarget = this.distance(this.ravagerX, this.ravagerY, targetNode.x, targetNode.y);
        if (distanceToTarget <= this.walkSpeed) {
            // If Ravager is close enough to the target node, snap to it and return true
            this.ravagerX = targetNode.x;
            this.ravagerY = targetNode.y;
            return true; // Target reached
        } else {
            // If not close enough, move towards the target node
            const angleToTarget = Math.atan2(targetNode.y - this.ravagerY, targetNode.x - this.ravagerX);
            this.ravagerX += Math.cos(angleToTarget) * this.walkSpeed;
            this.ravagerY += Math.sin(angleToTarget) * this.walkSpeed;
            return false; // Still moving towards target
        }
    }
    

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    calculatePath(startX, startY, targetX, targetY) {
        const openSet = new PriorityQueue((a, b) => a.f - b.f);
        const openSetMap = new Map();
        const closedSet = new Set();
    
        const startNode = new Node(startX, startY, 0, this.heuristic(startX, startY, targetX, targetY));
        openSet.enqueue(startNode);
        openSetMap.set(startNode.toString(), startNode);
    
        while (!openSet.isEmpty()) {
            const currentNode = openSet.dequeue();
            openSetMap.delete(currentNode.toString());
    
            if (currentNode.x === targetX && currentNode.y === targetY) {
                return this.reconstructPath(currentNode);
            }
    
            closedSet.add(currentNode.toString());
    
            this.getNeighbors(currentNode, targetX, targetY).forEach(neighbor => {
                if (closedSet.has(neighbor.toString())) {
                    return;
                }
    
                if (!openSetMap.has(neighbor.toString()) || openSetMap.get(neighbor.toString()).g > neighbor.g) {
                    openSet.enqueue(neighbor);
                    openSetMap.set(neighbor.toString(), neighbor);
                }
            });
        }
    
        return []; // No path found
    }
    
    reconstructPath(node) {
        const path = [];
        while (node) {
            path.unshift({ x: node.x, y: node.y });
            node = node.parent;
        }
        return path;
    }
    

    heuristic(x1, y1, x2, y2) {
        // Manhattan distance
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

   
    getNeighbors(node, targetX, targetY) {
        const directions = [
            { dx: 1, dy: 0 },  // Right
            { dx: -1, dy: 0 }, // Left
            { dx: 0, dy: 1 },  // Down
            { dx: 0, dy: -1 }  // Up
        ];
    
        const neighbors = [];
        directions.forEach(dir => {
            const newX = node.x + dir.dx;
            const newY = node.y + dir.dy;
    
            if (!this.collisions.isCollision(newX, newY)) {
                const gCost = node.g + 1;
                const hCost = this.heuristic(newX, newY, targetX, targetY);
                neighbors.push(new Node(newX, newY, gCost, hCost, node));
            }
        });
    
        return neighbors;
    }

}
