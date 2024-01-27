class Gold {
    constructor(game) {
        this.frostX = 0;
        this.frostY = 0;
        this.game = game;
        this.levelOneArtifacts = [
            [210, 160], [236, 316], [322, 580], [260, 888], [436, 919],
            [428, 1036], [230, 1214], [152, 1434], [346, 1696], [673, 1783],
            [757, 1625], [990, 1440], [830, 1264], [1126, 1174], [1212, 815],
            [1100, 555], [788, 524]
        ];
        this.image = ASSET_MANAGER.cache["./Art/Artifacts/Hoodofawyah.png"];

        // Properties for fancy vertical movement
        this.verticalMovement = 0;
        this.time = 0; // Time counter for sine wave calculation
        this.amplitude = 15; // Amplitude of the sine wave (how high it moves)
        this.frequency = 0.01; // Frequency of the sine wave (how fast it moves)

        // Properties for scaling effect
        this.scale = 1;         // Current scale of the artifact
        this.scaleSpeed = 0.01; // Speed of scaling
        this.minScale = 0;    // Minimum scale (closed)
        this.maxScale = 1;      // Maximum scale (open)
        this.scalingDown = true; // Flag to determine if scaling down or up

        this.getRandomArtifact();
    }

    getRandomArtifact() {
        let randomIndex = Math.floor(Math.random() * this.levelOneArtifacts.length);
        let selectedArtifact = this.levelOneArtifacts[randomIndex];
        this.artifactX = selectedArtifact[0];
        this.artifactY = selectedArtifact[1];
    }

    update() {
        // Update the time counter and calculate fancy vertical movement using sine wave
        this.time += this.frequency;
        this.verticalMovement = Math.sin(this.time) * this.amplitude;

        // Update scale for opening and closing effect
        if (this.scalingDown) {
            if (this.scale > this.minScale) {
                this.scale -= this.scaleSpeed;
            } else {
                this.scalingDown = false;
            }
        } else {
            if (this.scale < this.maxScale) {
                this.scale += this.scaleSpeed;
            } else {
                this.scalingDown = true;
            }
        }
    }

    draw(ctx) {
        if (!this.image) return; // Do nothing if image is not loaded

        // Calculate the scaled width and height
        var scaledWidth = this.image.width * this.scale;
        var scaledHeight = this.image.height ;

        // Draw the image with scaling and vertical movement
        ctx.drawImage(this.image, 
            300 - scaledWidth / 2, 
            300 + this.verticalMovement - scaledHeight / 2, 
            scaledWidth, 
            scaledHeight
        );   
    }

    getX() {
        return this.frostX;
    }

    getY() {
        return this.frostY;
    }
}
