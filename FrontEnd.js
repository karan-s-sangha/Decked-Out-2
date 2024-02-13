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
        let titleMusicPath = "./Art/music/Decked_Out.mp3"; // Ensure this is the correct path
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
        // Loop through each button to check for mouseover and click events
        Object.values(this.buttons).forEach(button => {
            // Check if the mouse is over the button
            button.color = this.mouseHover(this.game.mouse, button) ? '#FF5733' : '#3B92E4';
            
            // If there's a click, and it's on the button
            if (this.game.click && this.mouseHover(this.game.click, button)) {
                button.action(); // Execute the button's action
                this.game.click = null; // Reset click to avoid repeated clicks
            }
        });

         // Handling click on the Return to Title button in win/lose screens
         if ((this.isInWinScreen || this.isInLoseScreen) && this.game.click) {
            if (this.mouseHover(this.game.click, this.returnToTitleButton)) {
                this.returnToTitle();
                this.game.click = null; // Prevent further clicks from being processed
            }
        }
        // Play title music if on the main menu, credits, or instructions screen
    if (this.isInMenu || this.isInCredits || this.isShowInstructions) {
        if (this.game.mouse.x <= this.game.ctx.canvas.width || this.game.mouse.x >= 0){
           // console.log (this.game.mouse.x);
        this.playTitleMusic();
        }
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
    
        if (this.isInMenu) {
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
    }
    
    
    drawLoseScreen(ctx) {
        //ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        ctx.fillStyle = 'rgba(170, 0, 0, 0.5)'; // Semi-transparent dark red
        //ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        this.drawReturnToTitleButton(ctx);
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