class Artifact {
    constructor(game) {
        this.artifactX = 0;
        this.artifactY = 0;
        this.game = game;
        this.artiScale = 0.8;
        this.levelOneArtifacts = [
            [950, 500], [750, 1500], [595, 1624], [372, 1588], [340, 1700],
            [177, 1442], [113, 1156], [126, 784], [1235, 1090], [1058, 980],
            [1050, 1284], [990, 1505], [890, 1294], [447, 930], [333, 1080],
            [997, 1390], [463, 1416], [865, 1000], [1115, 720]
        ];
        this.imagePaths = [
            "./Art/Artifacts/Axeofthescreaminvoid.png",
            "./Art/Artifacts/Butchersapron.png",
            "./Art/Artifacts/Chiselundead.png",
            "./Art/Artifacts/Deathloop.png",
            "./Art/Artifacts/Hoodofawyah.png",
            "./Art/Artifacts/Hornofthegoat.png",
            "./Art/Artifacts/Hypnoticbandana.png",
            "./Art/Artifacts/Jarofspeedyslime.png",
            "./Art/Artifacts/Le_waffle.png",
            "./Art/Artifacts/Papasslippers.png",
            "./Art/Artifacts/Pearlofcleansing.png",
            "./Art/Artifacts/Shadesofthedog.png",
            "./Art/Artifacts/Tomeofthehills.png"
        ];
        this.imageValue = {
            "./Art/Artifacts/Axeofthescreaminvoid.png": 7,
            "./Art/Artifacts/Butchersapron.png": 20,
            "./Art/Artifacts/Chiselundead.png": 19,
            "./Art/Artifacts/Deathloop.png": 13,
            "./Art/Artifacts/Hoodofawyah.png" : 6,
            "./Art/Artifacts/Hornofthegoat.png" : 18,
            "./Art/Artifacts/Hypnoticbandana.png": 21,
            "./Art/Artifacts/Jarofspeedyslime.png": 11,
            "./Art/Artifacts/Le_waffle.png": 8,
            "./Art/Artifacts/Papasslippers.png": 10,
            "./Art/Artifacts/Pearlofcleansing.png": 14,
            "./Art/Artifacts/Shadesofthedog.png": 9,
            "./Art/Artifacts/Tomeofthehills.png": 12
        };

        // Properties for fancy vertical movement
        this.verticalMovement = 0;
        this.time = Math.random()*10; // Time counter for sine wave calculation
        this.amplitude = 15; // Amplitude of the sine wave (how high it moves)
        this.frequency = 0.02; // Frequency of the sine wave (how fast it moves)

        // Properties for scaling effect
        this.scaleSpeed = 0.01; // Speed of scaling
        this.minScale = 0;    // Minimum scale (closed)
        this.maxScale = 1;      // Maximum scale (open)
        this.scale = Math.random() * this.maxScale;         // Current scale of the artifact
        this.scalingDown = true; // Flag to determine if scaling down or up
  
        this.getRandomArtifact();
        this.getRandomLocation();
    }
    getRandomArtifact() {
        let randomIndex = Math.floor(Math.random() * this.imagePaths.length);
        let selectedImagePath = this.imagePaths[randomIndex];
        this.image = ASSET_MANAGER.cache[selectedImagePath];

        // Assign a selected value to the selected image
        this.imageValue = this.imageValue[selectedImagePath];
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

        //Draw the image with scaling and vertical movement
        ctx.drawImage(this.image, 
            this.artifactX * this.game.GameScale - this.game.camera.cameraX - scaledWidth / 2  , 
            this.artifactY * this.game.GameScale - this.game.camera.cameraY - scaledHeight / 2 + this.verticalMovement  , 
            scaledWidth * this.artiScale, 
            scaledHeight * this.artiScale
        );   
    }

    getX() {
        return this.artifactX;
    }

    getY() {
        return this.artifactY;
    }
}
