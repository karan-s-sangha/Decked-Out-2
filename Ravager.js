class Ravager {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.playerInView = false;
        this.lastSeenPlayerTime = null;
    }

    update(player, walls) {
        if (this.canSeePlayer(player, walls)) {
            this.playerInView = true;
            this.lastSeenPlayerTime = new Date();
            this.followPlayer(player);
        } else {
            if (this.playerInView && new Date() - this.lastSeenPlayerTime > 2000) {
                this.playerInView = false;
                this.wander();
            }
        }
    }

    canSeePlayer(player, walls) {
        // Implement logic to determine if the player is in view
        // considering walls and line of sight
    }

    followPlayer(playerX, playerY) {
        // Calculate the vector from the revenger to the player
        let dx = playerX - this.x;
        let dy = playerY - this.y;

        // Normalize the vector (to get the direction)
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / magnitude;
        let dirY = dy / magnitude;

        // Move the revenger towards the player
        this.x += dirX * this.speed;
        this.y += dirY * this.speed;
    }

    wander() {
        // Implement logic for random movement
        // Make sure the revenger doesn't move through walls
    }
}
