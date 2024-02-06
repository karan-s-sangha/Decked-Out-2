class FrontEnd {
    constructor(gameEngine, sceneManager) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;

        // Initialize UI components and state flags
        this.currentScreen = 'title'; // Default screen
        this.showOverlay = false;
        this.overlayMessage = null;

        // UI Styling
        this.titleTextColor = 'black';
        this.titleTextFont = 'bold 24px Arial';
        this.gameTitle = 'Decked Out 2'; // Game title
        this.gameTitleFont = 'bold 30px Arial'; // Font for the game title

        // Button setup
        this.menuButtonDimensions = { w: 180, h: 50 };
        const canvasCenterX = this.gameEngine.ctx.canvas.width / 2 - this.menuButtonDimensions.w / 2;
        const canvasCenterY = this.gameEngine.ctx.canvas.height / 2;
        this.startButton = { x: canvasCenterX, y: canvasCenterY - 60, ...this.menuButtonDimensions, text: "Play" };
        this.instructionsButton = { x: canvasCenterX, y: canvasCenterY, ...this.menuButtonDimensions, text: "Instructions" };
        this.creditsButton = { x: canvasCenterX, y: canvasCenterY + 60, ...this.menuButtonDimensions, text: "Credits" };
        this.creditsBackButton = { x: canvasCenterX, y: this.gameEngine.ctx.canvas.height - 80, ...this.menuButtonDimensions, text: "Back" };
    }

    loadAnimations() {
        // Assuming ASSET_MANAGER is a global or passed reference that loads and caches assets
        this.backgroundImg = new Image();
        //this.backgroundImg.src = ASSET_MANAGER.cache["./Art/Player/ex.png"];
    }

    handleClick(pos) {
        switch (this.currentScreen) {
            case 'title':
                if (this.isWithinBounds(pos.x, pos.y, this.startButton)) {
                    // Transition to the gameplay scene
                    this.sceneManager.switchScene('gameplay', new GameplayScene(this.gameEngine, this.sceneManager));
                } else if (this.isWithinBounds(pos.x, pos.y, this.creditsButton)) {
                    // Show credits information
                    this.currentScreen = 'credits';
                    this.showOverlay = true;
                    this.overlayMessage = "Game Developed by Team XYZ...";
                } else if (this.isWithinBounds(pos.x, pos.y, this.instructionsButton)) {
                    // Show instructions
                    this.currentScreen = 'instructions';
                    this.showOverlay = true;
                    this.overlayMessage = "Instructions: \n - Use Arrow Keys to move\n - Space to jump";
                }
                break;
            case 'credits':
            case 'instructions':
                if (this.isWithinBounds(pos.x, pos.y, this.creditsBackButton)) {
                    // Return to the title screen from credits or instructions
                    this.currentScreen = 'title';
                    this.showOverlay = false;
                }
                break;
            // Other cases as needed
        }
    }
    

    isWithinBounds(x, y, bounds) {
        return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
    }

    draw(ctx) {
        // Clear the canvas and set a white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Display the game title
        ctx.font = this.gameTitleFont;
        ctx.fillStyle = this.titleTextColor;
        ctx.textAlign = 'center';
        ctx.fillText(this.gameTitle, ctx.canvas.width / 2, 100); // Adjust Y as needed

        // Draw UI elements based on the current screen
        switch (this.currentScreen) {
            case 'title':
                this.drawTitleScreen(ctx);
                break;
            case 'credits':
                this.drawCreditsScreen(ctx);
                break;
            // Optionally handle 'instructions' screen drawing
        }
        // Draw overlays if needed
        if (this.showOverlay && this.overlayMessage) {
            this.drawOverlayMessage(ctx, this.overlayMessage);
        }
    }

    

    drawTitleScreen(ctx) {
        // Draw buttons: Play, Instructions, Credits
        [this.startButton, this.instructionsButton, this.creditsButton].forEach(button => {
            ctx.fillStyle = 'lightgray'; // Button background color
            ctx.fillRect(button.x, button.y, button.width, button.height);

            ctx.font = this.titleTextFont;
            ctx.fillStyle = this.titleTextColor;
            ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
        });
    }

    drawCreditsScreen(ctx) {
        // Draw credits information and a "Back" button
        ctx.fillStyle = this.creditsBackButton.color;
        ctx.fillRect(this.creditsBackButton.x, this.creditsBackButton.y, this.creditsBackButton.width, this.creditsBackButton.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("Back", this.creditsBackButton.x + 5, this.creditsBackButton.y + 20);

        // Draw the actual credits text
        // Adjust positioning and content as necessary
    }

    drawOverlayMessage(ctx, message) {
        const overlayX = 50, overlayY = 150;
        const overlayWidth = ctx.canvas.width - 100, overlayHeight = ctx.canvas.height - 300;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black background
        ctx.fillRect(overlayX, overlayY, overlayWidth, overlayHeight); // Drawing the background rectangle
    
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white'; // Text color
        const lines = message.split('\n'); // Splitting the message into lines
        lines.forEach((line, index) => {
            // Drawing each line of text
            ctx.fillText(line, overlayX + 10, overlayY + 30 + (index * 20));
        });
    }
    
}
