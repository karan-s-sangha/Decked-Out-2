class FrontEnd {
    constructor(game, sceneManager) {
        this.game = game;
        this.sceneManager = sceneManager;

        this.isInMenu = true; // The game starts in the main menu.
        this.isInCredits = false; // Only true when viewing the credits screen.
        this.isShowInstructions = false; // Only true when viewing the instructions screen.

        this.isInWinScreen = false; // Only true when the player wins the game.
        this.isInLoseScreen = false; // Only true when the player loses the game.

        // Setup buttons with dimensions and positions
        this.setupButtons();
        this.initializeReturnToTitleButton();
        //this.playTitleMusic = this.playTitleMusic.bind(this);

    }

    playTitleMusic() {
        let titleMusicPath = "./Art/music/Decked_Out.mp3"; 
        let titleMusic = ASSET_MANAGER.getAsset(titleMusicPath);
        if (titleMusic && titleMusic.paused) {
            // Instead of just playing the asset, use autoRepeat to ensure it loops.
            ASSET_MANAGER.autoRepeat(titleMusicPath);
        }
    }
    
    
    
    stopTitleMusic() {
        let titleMusicPath = "./Art/music/Decked_Out.mp3"; 
        ASSET_MANAGER.pauseBackgroundMusic(titleMusicPath);
        
    }
    
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
                action: () => this.showInstructionsScreen()
            },
            creditsButton: {
                x: canvasCenterX,
                y: canvasCenterY + 60,
                ...this.menuButtonDimensions,
                text: "Credits",
                color: "#3B92E4",
                action: () => this.showCreditsScreen()
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

    startGame() {
        this.isInMenu = false;
        this.isInCredits = false;
        this.sceneManager.gameOver = false;
        this.isShowInstructions = false;
        this.isInWinScreen = false; // Only true when the player wins the game.
        this.isInLoseScreen = false;
        this.sceneManager.loadSceneManager("levelOne", true);
    }

    showInstructionsScreen() {
        this.isInMenu = false;
        this.isShowInstructions = true;
        this.isInCredits = false;
        this.isInLoseScreen = false;
        this.isInWinScreen = false;
    }

    showCreditsScreen() {
        this.isInMenu = false;
        this.isInCredits = true;
        this.isShowInstructions = false;
        this.isInLoseScreen = false;
        this.isInWinScreen = false;
    }

    goBack() {
        this.isInMenu = true;
        this.isInCredits = false;
        this.isShowInstructions = false;
        this.isInLoseScreen = false;
        this.isInWinScreen = false;
    }

    // Initializes the return to title button with its properties
    initializeReturnToTitleButton() {
        this.returnToTitleButton = {
            x: this.game.ctx.canvas.width / 2 - 125,
            y: this.game.ctx.canvas.height - 100,
            w: 300,
            h: 50,
            text: "Return To Title",
            color: "rgba(170, 0, 0, 0.5)"
        };
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


    update() {
            // Handle button interactions based on the current game state
            if (this.isInMenu || this.isShowInstructions || this.isInCredits) {
                Object.values(this.buttons).forEach(button => {
                    button.color = this.mouseHover(this.game.mouse, button) ? '#FF5733' : '#3B92E4';
                    
                    if (this.game.click && this.mouseHover(this.game.click, button)) {
                        button.action();
                        this.game.click = null;
                    }
                });
            }
        
            // Handle Return to Title button interaction in win/lose screens
          /*  if ((this.isInWinScreen || this.isInLoseScreen) && this.game.click) {
                if (this.mouseHover(this.game.click, this.returnToTitleButton)) {
                    this.returnToTitle();
                    this.game.click = null;
                }
            }*/
        
            // Background music control
            if (this.isInMenu || this.isInCredits || this.isShowInstructions) {
                this.playTitleMusic();
            } else {
                this.stopTitleMusic();
            }
        }
        
    
    


    mouseHover(mousePos, button) {
        return mousePos.x >= button.x && mousePos.x <= (button.x + button.w) &&
               mousePos.y >= button.y && mousePos.y <= (button.y + button.h);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        ctx.fillStyle = 'white'; 
        ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height); // Fill the entire canvas
    
        if (this.isInMenu && !this.isShowInstructions && !this.isInCredits &&
            !this.isInLoseScreen && !this.isInWinScreen   ) {
            // Draw menu buttons except the back button
            Object.values(this.buttons).forEach(button => {
                if (button.text !== "Back") this.drawButton(ctx, button);
                
            });
        } else if (this.isShowInstructions || this.isInCredits) {
            
            this.drawButton(ctx, this.buttons.backButton);

            if (this.isInCredits) {
                // Draw the credits text
                this.drawCredits(ctx);
            } else if (this.isShowInstructions){
                this.drawInstruction(ctx);
            }
        }
        else if (this.isInWinScreen) {
            // Draw the win screen
            this.drawWinScreen(ctx);
        } else if (this.isInLoseScreen) {
            // Draw the lose screen
            this.drawLoseScreen(ctx);
        }
    }

    drawWinScreen(ctx) {
        // Assume both images are loaded and complete for simplicity
        let backgroundImage = ASSET_MANAGER.cache["./Art/background.png"];
        let winImage = ASSET_MANAGER.cache["./Art/win.png"];
    
        // Draw the background image first
        if (backgroundImage && backgroundImage.complete) {
            ctx.drawImage(backgroundImage, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        }
    
        // Then draw the win image on top of the background
        if (winImage && winImage.complete) {
            // Set the desired scale factor for the win image (e.g., 0.7)
            const scaleFactor = 0.7;
    
            // Calculate the scaled dimensions for the win image
            const scaledWidth = winImage.width * scaleFactor;
            const scaledHeight = winImage.height * scaleFactor;
    
            // Calculate the position to center the scaled win image on the canvas
            const x = (this.game.ctx.canvas.width - scaledWidth) / 2;
            const y = (this.game.ctx.canvas.height - scaledHeight) / 2;
    
            // Draw the scaled win image on top of the background
            ctx.drawImage(winImage, x, y, scaledWidth, scaledHeight);
        }
        //this.drawReturnToTitleButton(ctx);
    }

    
    
    
 drawLoseScreen(ctx) {

         // Fill the background
         let backgroundLoseImage = ASSET_MANAGER.cache["./Art/losing_background.png"];
         let loseImage = ASSET_MANAGER.cache["./Art/lose.png"];
         let bruhImage = ASSET_MANAGER.cache["./Art/bruh.png"];
         
         // Ensure the background image for losing is drawn first
         if (backgroundLoseImage && backgroundLoseImage.complete) {
             ctx.drawImage(backgroundLoseImage, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
         }
     
         // Set the desired scale factor for the lose image
         const scaleFactorLose = 0.7;
     
         // Calculate the scaled dimensions for the lose image
         const scaledWidthLose = loseImage.width * scaleFactorLose;
         const scaledHeightLose = loseImage.height * scaleFactorLose;
     
         // Calculate the position to center the scaled lose image on the canvas
         const xLose = (this.game.ctx.canvas.width - scaledWidthLose) / 2;
         const yLose = (this.game.ctx.canvas.height - scaledHeightLose) / 2;
     
         // Draw the scaled lose image onto the canvas at position (xLose, yLose)
         if (loseImage && loseImage.complete) {
             ctx.drawImage(loseImage, xLose, yLose, scaledWidthLose, scaledHeightLose);
         }
     
         // Draw the "Bruh" image next to the "You Lose" image
         if (bruhImage && bruhImage.complete) {
             // Set the desired scale factor for the bruh image 
             const scaleFactorBruh = 0.5;
             
             // Calculate the scaled dimensions for the bruh image
             const scaledWidthBruh = bruhImage.width * scaleFactorBruh;
             const scaledHeightBruh = bruhImage.height * scaleFactorBruh;
     
             // Position the "Bruh" image next to the "You Lose" image
             const xBruh = xLose + scaledWidthLose - 90; 
             const yBruh = yLose  - 200; 
     
             // Draw the scaled "Bruh" image onto the canvas at position (xBruh, yBruh)
             ctx.drawImage(bruhImage, xBruh, yBruh, scaledWidthBruh, scaledHeightBruh);
         }
         //this.drawReturnToTitleButton(ctx);
     }

  /*  drawWinScreen(ctx) {
        //ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        ctx.fillStyle = 'rgba(170, 0, 0, 0.5)'; // Semi-transparent dark red
        //ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.drawReturnToTitleButton(ctx);
    }
    
    
    drawLoseScreen(ctx) {
        ctx.fillStyle = 'rgba(170, 0, 0, 0.5)'; // Semi-transparent dark red
        //ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.drawReturnToTitleButton(ctx);
    }*/
    
    

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
            { text: "Credits", style: "bolder 40px 'Press Start 2P'" },
            { text: "Game Developed by", style: "30px 'Press Start 2P'" },
            { text: "Karan Sangha", style: "25px 'Press Start 2P'" },
            { text: "Ingeun Hwang", style: "25px 'Press Start 2P'" },
            { text: "Khin Win", style: "25px 'Press Start 2P'" }
        ];
    
        const colors = ['#555555', '#00AAAA', '#971607', '#FF5555', '#DDD605', 'B4684D'];
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
    
        const colors = ['#555555', '#00AAAA', '#971607', '#FF5555', '#DDD605', 'B4684D'];
    
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