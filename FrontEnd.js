class FrontEnd {
    constructor(game, sceneManager) {
        this.game = game;
        this.sceneManager = sceneManager;

        this.isInMenu = true; // The game starts in the main menu.
        this.isInCredits = false; // Only true when viewing the credits screen.
        this.isShowInstructions = false; // Only true when viewing the instructions screen.

        this.isInWinScreen = false; // Only true when the player wins the game.


        // Setup buttons with dimensions and positions
        this.setupButtons();
        this.initializeReturnToTitleButton();
        this.initCredits();

        // Variables for scrolling control
        this.creditsElapsedTime = 0;
        this.creditsScrollSpeed = 0.5; // Adjust as needed for speed
        this.selectedLevel = 'easy'; // Default level
        this.selectLevel(this.selectedLevel);


    }

    

    playTitleMusic(path) {
        ASSET_MANAGER.autoRepeat(path);

    }

    stopTitleMusic(path) {
        let titleMusicPath = path;
        ASSET_MANAGER.pauseBackgroundMusic(titleMusicPath);

    }

    setupButtons() {
        this.menuButtonDimensions = { w: 250, h: 50 };
        const canvasCenterX = this.game.ctx.canvas.width / 2 - this.menuButtonDimensions.w / 2;
        const canvasCenterY = this.game.ctx.canvas.height / 1.5;


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
                color: "#3B92E4",
                action: () => this.goBack()
            }
        };

        // Calculate positions for level selection buttons
        const levelLabels = ['Easy', 'Medium', 'Hard'];
        const buttonSpacing = 10; // Space between each level button
        const levelButtonWidth = 140; // Increased width for better text fitting
        const levelButtonHeight = 50;
        const totalButtonsWidth = levelLabels.length * levelButtonWidth + (levelLabels.length - 1) * buttonSpacing;
        const baseX = this.buttons.creditsButton.x - (totalButtonsWidth/4);
        const baseY = this.buttons.creditsButton.y + 70; // Position below the Credits button

        // Dynamically add level selection buttons to the this.buttons object
        levelLabels.forEach((level, index) => {
            this.buttons[`${level.toLowerCase()}LevelButton`] = {
                x: baseX + index * (levelButtonWidth + buttonSpacing),
                y: baseY,
                w: levelButtonWidth,
                h: levelButtonHeight,
                text: level,
                color: "#3B92E4", 
                action: () => this.selectLevel(level.toLowerCase())
            };
        });

    }
    selectLevel(level) {
        this.selectedLevel = level;
        // Update button colors to indicate the selected level
        ['easy', 'medium', 'hard'].forEach(lvl => {
            this.buttons[`${lvl}LevelButton`].color = lvl === level ? "orange" : "#3B92E4"; 
        });
        this.sceneManager.updateGameDifficulty(level);
       // console.log(level + " level");
    }


    startGame() {
        this.isInMenu = false;
        this.isInCredits = false;
        this.isShowInstructions = false;
        this.isInWinScreen = false; // Only true when the player wins the game.
        this.sceneManager.loadSceneManager(this.selectedLevel, true);
        
    }

    showInstructionsScreen() {
        this.isInMenu = false;
        this.isShowInstructions = true;
        this.isInCredits = false;
        this.isInWinScreen = false;
    }

    showCreditsScreen() {
        this.isInMenu = false;
        this.isInCredits = true;
        this.isShowInstructions = false;
        this.isInWinScreen = false;
    }

    goBack() {
        this.isInMenu = true;
        this.isInCredits = false;
        this.isShowInstructions = false;
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
        // Handle button interactions based on the current game state m
        if (this.isInMenu) {
            // Only interact with start, instructions, and credits buttons
            ['startButton', 'instructionsButton', 'creditsButton', 'easyLevelButton', 
            'mediumLevelButton', 'hardLevelButton'].forEach(key => {
                let button = this.buttons[key];
                button.color = this.mouseHover(this.game.mouse, button) ? '#FF5733' : '#3B92E4';

                if (this.game.click && this.mouseHover(this.game.click, button)) {
                    button.action();
                    this.game.click = null; // Reset click to prevent repeat actions
                }
            });
        } else if (this.isShowInstructions || this.isInCredits) {
            // Only interact with the back button
            let button = this.buttons.backButton;
            button.color = this.mouseHover(this.game.mouse, button) ? '#FF5733' : '#3B92E4';
            if (this.game.click && this.mouseHover(this.game.click, button)) {
                button.action();
                this.game.click = null;
            }
        }

        // Background music control 
        if (this.isInMenu || this.isInCredits || this.isShowInstructions) {
            this.playTitleMusic("./Art/music/titleMusic.mp3");
        } else {
            this.stopTitleMusic("./Art/music/titleMusic.mp3");
        }
    }



    mouseHover(mousePos, button) {
        return mousePos.x >= button.x && mousePos.x <= (button.x + button.w) &&
            mousePos.y >= button.y && mousePos.y <= (button.y + button.h);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);

        // Check if the game is in the main menu state
        if (this.isInMenu && !this.isShowInstructions && !this.isInCredits) {
            let backgroundImage = ASSET_MANAGER.cache["./Art/titlepage.png"];
            if (backgroundImage && backgroundImage.complete) {
                ctx.drawImage(backgroundImage, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
            }

            if (this.isInMenu) {
                Object.keys(this.buttons).forEach(key => {
                    if (key.includes('LevelButton')) {
                        // Keep the selected level button highlighted
                        const level = key.replace('LevelButton', '');
                        if (this.selectedLevel === level) {
                            this.buttons[key].color = "orange";
                        } else {
                            this.buttons[key].color = "#3B92E4";
                        }
                    }
                    // Exclude the "Back" button unless you're in instructions or credits
                    if (!this.isShowInstructions && !this.isInCredits && key !== "backButton") {
                        this.drawButton(ctx, this.buttons[key]);
                    }
                });
            }
        } else if (this.isShowInstructions) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
            // Draw the instruction screen elements
            this.drawButton(ctx, this.buttons.backButton);
            this.drawInstruction(ctx);
        } else if (this.isInCredits) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
            // Draw the credits screen elements
            this.drawButton(ctx, this.buttons.backButton);
            this.drawCredits(ctx);
        }
    }

    initCredits() {
        this.credits = [
            "Congratulations! You win!",
            "Lead Problem Solver: Every Coffee Cup in a 5-Mile Radius",
            "Bug Hunter Extraordinaire: Stack Overflow",
            "Infinite Loop Director: That One Misplaced Semi-Colon",
            "Memory Leak Investigator: Yours Truly at 3 AM",
            "Thanks to All Nighters, Pizza, and Passion",
            "Ready for the Next Challenge: You!"
        ];
    }

    drawWinScreen(ctx) {

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);

        // Increment time for scrolling effect
        this.creditsElapsedTime += this.creditsScrollSpeed;

        // Start position for credits, adjusted by elapsed time for scrolling effect
        let startY = ctx.canvas.height - this.creditsElapsedTime;

        this.credits.forEach((credit, index) => {
            let lineStartY = startY + (index * 50); // Adjust line height + margin

            let minecraftColors = ['#6A7324', '#564D33', '#787878', '#4C7F99', '#8DB360'];


            // Draw each credit line
            this.drawMulticoloredText(ctx, credit, ctx.canvas.width / 2, lineStartY, "20px 'Press Start 2P'", minecraftColors);
        });

        // Reset or loop credits if they've all scrolled past
        if (startY + (this.credits.length * 50) < 0) {
            this.creditsElapsedTime = 0; // Reset to start scrolling again from the bottom
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
            { text: "", style: "'Press Start 2P'" },
            { text: " BE CAREFUL OF RAVAGERS!!", style: "bolder 150% 'Press Start 2P' italic" },
        ];

        const colors = ['#555555', '#00AAAA', '#971607', '#FF5555', '#DDD605', 'B4684D'];

        let startX = this.game.ctx.canvas.width / 2;
        let startY = this.game.ctx.canvas.height / 2 - 200;

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