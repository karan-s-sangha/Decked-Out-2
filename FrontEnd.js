class FrontEnd {
    constructor(game, sceneManager) {
        this.game = game;
        this.sceneManager = sceneManager;

        // Game state flags
        this.isInMenu = true;
        this.isInCredits = false;
        this.isShowInstructions = false;
        this.isInWinScreen = false;
        this.isInLoseScreen = false;

        // Initialize UI components
        this.setupButtons();
        this.initializeReturnToTitleButton();
    }

    // Sets up the dimensions and initial positions for UI buttons
    setupButtons() {
        this.menuButtonDimensions = { w: 250, h: 50 };
        const canvasCenterX = this.game.ctx.canvas.width / 2 - this.menuButtonDimensions.w / 2;
        const canvasCenterY = this.game.ctx.canvas.height / 3;

        this.buttons = {
            startButton: {
                x: canvasCenterX,
                y: canvasCenterY - 60,
                ...this.menuButtonDimensions,
                text: "Start Game",
                color: "#3B92E4",
                action: this.startGame.bind(this)
            },
            instructionsButton: {
                x: canvasCenterX,
                y: canvasCenterY,
                ...this.menuButtonDimensions,
                text: "Instructions",
                color: "#3B92E4",
                action: this.showInstructionsScreen.bind(this)
            },
            creditsButton: {
                x: canvasCenterX,
                y: canvasCenterY + 60,
                ...this.menuButtonDimensions,
                text: "Credits",
                color: "#3B92E4",
                action: this.showCreditsScreen.bind(this)
            },
            backButton: {
                x: 20,
                y: this.game.ctx.canvas.height - 70,
                ...this.menuButtonDimensions,
                text: "Back",
                color:"#3B92E4",
                action: () => this.goBack()
            }
        };
    }

    // Initializes the return to title button with its properties
    initializeReturnToTitleButton() {
        this.returnToTitleButton = {
            x: this.game.ctx.canvas.width / 2 - 125,
            y: this.game.ctx.canvas.height - 100,
            w: 250,
            h: 50,
            text: "Return to Title",
            color: "#3B92E4"
        };
    }

     // Starts the game, setting the appropriate game state flags
     startGame() {
        Object.assign(this, { isInMenu: false, isInCredits: false, isShowInstructions: false, isInWinScreen: false, isInLoseScreen: false });
        this.sceneManager.gameOver = false;
        this.sceneManager.loadSceneManager("levelOne", true);
    }

    // Displays the instructions screen
    showInstructionsScreen() {
        Object.assign(this, { isInMenu: false, isShowInstructions: true, isInCredits: false });
    }

    // Displays the credits screen
    showCreditsScreen() {
        Object.assign(this, { isInMenu: false, isInCredits: true, isShowInstructions: false });
    }

    // Returns to the main menu from any state
    goBack() {
        Object.assign(this, { isInMenu: true, isInCredits: false, isShowInstructions: false });
    }

    // Handles the update logic, including button interactions and music management
    update() {
        // Check for mouse presence and update accordingly
        if (this.game.mouse && (this.isInMenu || this.isInCredits || this.isShowInstructions)) {
            this.handleButtonInteractions();
        }
        this.manageMusic();
    }

    handleButtonInteractions() {
        Object.values(this.buttons).forEach(button => {
            // Change the button color if the mouse is hovering over it
            button.color = this.mouseHover(this.game.mouse, button) ? '#FF5733' : '#3B92E4';
    
            // Execute the button's action if it is clicked
            if (this.game.click && this.mouseHover(this.game.click, button)) {
                button.action(); // Call the action defined in the button setup
                this.game.click = null; // Reset click to prevent repeated actions
            }
        });
    
        // Special case for returning to the title from win/lose screens
        if ((this.isInWinScreen || this.isInLoseScreen) && this.game.click) {
            if (this.mouseHover(this.game.click, this.returnToTitleButton)) {
                this.returnToTitle();
                this.game.click = null; // Prevent further clicks from being processed
            }
        }
    }
    

    manageMusic() {
        const titleMusicPath = "./Art/music/Decked_Out.mp3";
        // Check if the player is in a state that should have music playing
        if (this.isInMenu || this.isInCredits || this.isShowInstructions) {
            let titleMusic = ASSET_MANAGER.getAsset(titleMusicPath);
            // Play music if it's not already playing
            if (titleMusic && titleMusic.paused) {
                ASSET_MANAGER.autoRepeat(titleMusicPath);
            }
        } else {
            // Stop the music when the player is not in the menu, credits, or instructions
            ASSET_MANAGER.pauseBackgroundMusic(titleMusicPath);
        }
    }
    
    returnToTitle() {
        // Reset the game state to show the title screen
        this.isInMenu = true;
        this.isInWinScreen = false;
        this.isInLoseScreen = false;
        this.isInCredits = false;
        this.isShowInstructions = false;
    }

   
    drawReturnToTitleButton(ctx) {
        const button = this.returnToTitleButton; // Use the button defined in the constructor
        this.drawButton(ctx, button);
    }

    mouseHover(mousePos, button) {
        return mousePos.x >= button.x && mousePos.x <= (button.x + button.w) &&
               mousePos.y >= button.y && mousePos.y <= (button.y + button.h);
    }

    // Draws the current state of the game UI
    draw(ctx) {
        ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height); // Clear the canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height); // Draw the background

        if (this.isInMenu) {
            this.drawMenu(ctx);
        } else if (this.isShowInstructions) {
            this.drawInstruction(ctx);
            this.drawButton(ctx, this.buttons.backButton);
        } else if (this.isInCredits) {
            this.drawCredits(ctx);
            this.drawButton(ctx, this.buttons.backButton);
        } else if (this.isInWinScreen) {
            this.drawWinScreen(ctx);
        } else if (this.isInLoseScreen) {
            this.drawLoseScreen(ctx);
        }
    }

    drawMenu(ctx) {
        // Assuming the background and title setup is already handled elsewhere or not needed for the menu.
        // Loop through the buttons and draw them if they're not the 'Back' button.
        Object.values(this.buttons).forEach(button => {
            if (button.text !== "Back") { // This check prevents drawing the Back button in the main menu.
                this.drawButton(ctx, button);
            }
        });
    }
    

    drawWinScreen(ctx) {
        // // Assume both images are loaded and complete for simplicity
        // let backgroundImage = ASSET_MANAGER.cache["./Art/background.png"];
        // let winImage = ASSET_MANAGER.cache["./Art/win.png"];
    
        // // Draw the background image first
        // if (backgroundImage && backgroundImage.complete) {
        //     ctx.drawImage(backgroundImage, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        // }
    
        // // Then draw the win image on top of the background
        // if (winImage && winImage.complete) {
        //     // Set the desired scale factor for the win image (e.g., 0.7)
        //     const scaleFactor = 0.7;
    
        //     // Calculate the scaled dimensions for the win image
        //     const scaledWidth = winImage.width * scaleFactor;
        //     const scaledHeight = winImage.height * scaleFactor;
    
        //     // Calculate the position to center the scaled win image on the canvas
        //     const x = (this.game.ctx.canvas.width - scaledWidth) / 2;
        //     const y = (this.game.ctx.canvas.height - scaledHeight) / 2;
    
            // Draw the scaled win image on top of the background
            ctx.drawImage(winImage, x, y, scaledWidth, scaledHeight);
        }
    }
    
    
    drawLoseScreen(ctx) {
        // // Fill the background
        // let backgroundLoseImage = ASSET_MANAGER.cache["./Art/losing_background.png"];
        // let loseImage = ASSET_MANAGER.cache["./Art/lose.png"];
        // let bruhImage = ASSET_MANAGER.cache["./Art/bruh.png"];
        
        // // Ensure the background image for losing is drawn first
        // if (backgroundLoseImage && backgroundLoseImage.complete) {
        //     ctx.drawImage(backgroundLoseImage, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        // }
    
        // // Set the desired scale factor for the lose image
        // const scaleFactorLose = 0.7;
    
        // // Calculate the scaled dimensions for the lose image
        // const scaledWidthLose = loseImage.width * scaleFactorLose;
        // const scaledHeightLose = loseImage.height * scaleFactorLose;
    
        // // Calculate the position to center the scaled lose image on the canvas
        // const xLose = (this.game.ctx.canvas.width - scaledWidthLose) / 2;
        // const yLose = (this.game.ctx.canvas.height - scaledHeightLose) / 2;
    
        // // Draw the scaled lose image onto the canvas at position (xLose, yLose)
        // if (loseImage && loseImage.complete) {
        //     ctx.drawImage(loseImage, xLose, yLose, scaledWidthLose, scaledHeightLose);
        // }
    
        // // Draw the "Bruh" image next to the "You Lose" image
        // if (bruhImage && bruhImage.complete) {
        //     // Set the desired scale factor for the bruh image 
        //     const scaleFactorBruh = 0.5;
            
        //     // Calculate the scaled dimensions for the bruh image
        //     const scaledWidthBruh = bruhImage.width * scaleFactorBruh;
        //     const scaledHeightBruh = bruhImage.height * scaleFactorBruh;
    
        //     // Position the "Bruh" image next to the "You Lose" image
        //     const xBruh = xLose + scaledWidthLose - 90; 
        //     const yBruh = yLose  - 200; 
    
            // Draw the scaled "Bruh" image onto the canvas at position (xBruh, yBruh)
            ctx.drawImage(bruhImage, xBruh, yBruh, scaledWidthBruh, scaledHeightBruh);
        }
    }
    

    drawButton(ctx, button) {
        // Set fillStyle to 'white' for the rectangle background
        ctx.fillStyle = 'whitesmoke';
        // Calculate buttonWidth based on whether it's the "Back" button or not
        let buttonWidth = button.text === "Back" ? button.w - 100 : button.w;
        // Draw the rectangle first
        ctx.fillRect(button.x - (button.text === "Back" ? 50 : 0), button.y, buttonWidth, button.h);
    
        // Now set the fillStyle to the button's color for the text
        ctx.fillStyle = button.color; // This ensures the text color is set as per the button's color property
        ctx.font = "100% 'Press Start 2P'";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    
        // Adjust text position based on buttonWidth and whether it's the "Back" button
        ctx.fillText(button.text, button.x + buttonWidth / 2 - (button.text === "Back" ? 30 : 0), button.y + button.h / 2);
    }
    

    drawCredits(ctx) {
        const lines = [
            { text: "Credits", style: "bolder 200% 'Press Start 2P'" },
            { text: "Game Developed by", style: "150% 'Press Start 2P'" },
            { text: "Karan Sangha", style: "100% 'Press Start 2P'" },
            { text: "Ingeun Hwang", style: "100% 'Press Start 2P'" },
            { text: "Khin Win", style: "100% 'Press Start 2P'" }
        ];
    
        const colors = ['#3494E6', '#4291E2', '#508EDD', '#5E8BD9', '#6D88D4', '#7B85D0',
        '#8982CC', '#9780C7', '#A57DC3', '#B37ABF', '#C277BA', '#D074B6', '#DE71B1', '#EC6EAD'];
    
        let startX = this.game.ctx.canvas.width / 2;
        let startY = this.game.ctx.canvas.height / 2 - 60;
    
        // Draw each line with the multicolored effect
        for (let line of lines) {
            this.drawMulticoloredText(ctx, line.text, startX, startY, line.style, colors);
            startY += 70; // Increment Y position for the next line
        }
    }

    drawInstruction(ctx) {
        const lines = [
            { text: "Instructions", style: "bolder 150% 'Press Start 2P'" },
            { text: "", style: "  'Press Start 2P'" },
            { text: "* WSAD to move around the Map", style: "100% 'Press Start 2P'" },
            { text: "* Follow the Arrow to the Artifact", style: "100%'Press Start 2P'" },
            { text: "* Space to Jump", style: "100% 'Press Start 2P'" },
            { text: "* Shift + WSAD to move faster", style: "100% 'Press Start 2P'" },
            { text: "* Use Cursor to rotate Steve", style: "100% 'Press Start 2P'" },
            {text:  "", style: "'Press Start 2P'" },
            { text: " BE CAREFUL OF RAVAGERS!!", style: "bolder 150% 'Press Start 2P' italic" }, 
        ];
    
        const colors = ['#3494E6', '#4291E2', '#508EDD', '#5E8BD9', '#6D88D4', '#7B85D0', '#8982CC', '#9780C7', '#A57DC3', '#B37ABF', '#C277BA', '#D074B6', '#DE71B1', '#EC6EAD'];
    
        let startX = this.game.ctx.canvas.width / 2;
        let startY = this.game.ctx.canvas.height / 2 - 200 ;
    
        // Draw each line with the multicolored effect
        for (let line of lines) {
            this.drawMulticoloredText(ctx, line.text, startX, startY, line.style, colors);
            startY += 50; // Adjusted spacing for better fit
        }
    }
    

    drawMulticoloredText(ctx, text, startX, startY, font, colors) {
        let offsetX = 0;
        ctx.font = font; // Use the font passed as a parameter
    
        for (let i = 0; i < text.length; i++) {
            ctx.fillStyle = colors[i % colors.length]; // Cycle through colors
            let letter = text[i];
            ctx.fillText(letter, startX + offsetX - (ctx.measureText(text).width / 2), startY);
    
            // Adjust offsetX by measuring the width of the letter just drawn
            offsetX += ctx.measureText(letter).width;
        }
    }
    
    
    
    
}
