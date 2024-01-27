class Artifact {
    constructor(game){
        this.artifactX = 0;
        this.artifactY = 0;
        this.game = game;
        this.levelOneArtifacts = [
            [950, 500], [750, 1500], [595, 1624], [372, 1588], [340, 1700],
            [177, 1442], [113, 1156], [126, 784], [1235, 1090], [1058, 980],
            [1050, 1284], [990, 1505], [890, 1294], [447, 930], [333, 1080],
            [997, 1390], [463, 1416], [865, 1000], [1115, 720]
        ];
        this.image = ASSET_MANAGER.cache["./Art/Artifacts/Hoodofawyah.png"];

        // Properties for fancy vertical movement
        this.verticalMovement = 0;
        this.time = 0; // Time counter for sine wave calculation
        this.amplitude = 10; // Amplitude of the sine wave (how high it moves)
        this.frequency = 0.05; // Frequency of the sine wave (how fast it moves)

        this.getRandomArtifact();
    }

    getRandomArtifact(){
        let randomIndex = Math.floor(Math.random() * this.levelOneArtifacts.length);
        let selectedArtifact = this.levelOneArtifacts[randomIndex];
        this.artifactX = selectedArtifact[0];
        this.artifactY = selectedArtifact[1];
    }

    update() {
        // Update the time counter and calculate fancy vertical movement using sine wave
        this.time += this.frequency;
        this.verticalMovement = Math.sin(this.time) * this.amplitude;
    }

    draw(ctx) {
        if (!this.image) return; // Do nothing if image is not loaded

        // Draw the image at its position with vertical movement
        ctx.drawImage(offscreenCanvas, 700,700);   
       
    }

    getX(){
        return this.artifactX;
    }

    getY(){
        return this.artifactY;
    }
}
