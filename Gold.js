class Gold {
    constructor(game) {
        this.frostX = 0;
        this.frostY = 0;
        this.game = game;
        this.levelOneArtifacts = [
            [678, 1778], [332, 1700], [172, 1452], [230, 1215], [260, 894],
            [352, 578], [254, 332], [196, 170], [761, 1620], [426, 1030],
            [438, 932], [970, 1420], [836, 1251], [1130, 1166], [1206, 844],
            [1070, 530], [788, 512]
        ];
        this.image = ASSET_MANAGER.cache["./Art/Currency/Crown.png"];
        this.image = ASSET_MANAGER.cache["./Art/Currency/Coin.png"];


        // Properties for fancy vertical movement
        this.verticalMovement = 0;
        this.time = Math.random()*10; // Time counter for sine wave calculation
        this.amplitude = 15; // Amplitude of the sine wave (how high it moves)
        this.frequency = 0.02; // Frequency of the sine wave (how fast it moves)

        // Properties for scaling effect
        this.scale = Math.random();         // Current scale of the artifact
        this.scaleSpeed = 0.01; // Speed of scaling
        this.minScale = 0;    // Minimum scale (closed)
        this.maxScale = 1;      // Maximum scale (open)
        this.scalingDown = true; // Flag to determine if scaling down or up

        this.getRandomLocation();
    }

    getRandomLocation() {
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
            400 - scaledWidth / 2, 
            400 + this.verticalMovement - scaledHeight / 2, 
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
