class Cards {
    constructor(steve) {
        this.clankBlock = 0;
        this.hazardBlock = 0;
        this.treasure = 0;
        this.frostEmbers = 0;

        this.steve = steve;
        this.cardProperties = []; // Array to hold multiple items

        this.loadCards(); // Correctly reference the method with 'this'
    }

    loadCards() { // Method to initialize card properties

    //------------COMMON CARDS --------------------

        this.cardProperties.push({
            name: "Sneak",
            description: "Blocks 2 Clank",
            type: "Normal",
            cost: 7,
            clankBlock: 2
        });
        this.cardProperties.push({
            name: "Stability",
            description: "Blocks 2 Hazard",
            type: "Normal",
            cost: 8,
            hazardBlock: 2
        });
        this.cardProperties.push({
            name: "Treasure Hunter",
            description: "Generates 4 Treasure drops",
            type: "Normal",
            cost: 9,
            treasure: 4
        });
        this.cardProperties.push({
            name: "Ember Seeker",
            description: "Generates 2 Frost Ember drops",
            type: "Normal",
            cost: 10,
            frostEmbers: 2
        });
        this.cardProperties.push({
            name: "Moment of Clarity",
            description: "Blocks 2 Clank, Blocks 2 Hazard, generates 4 Treasure drops, and generates 2 Frost Ember drops.",
            type: "Ethereal",
            cost: 6,
            clankBlock: 2,
            hazardBlock: 2,
            treasure: 4,
            frostEmbers: 2
        });

        //------------UNCOMMON CARDS --------------------

        this.cardProperties.push({
            name: "Evasion",
            description: "Blocks 4 Clank.",
            type: "Normal",
            cost: 16,
            clankBlock: 4,
        });

        this.cardProperties.push({
            name: "Tread Lightly",
            description: "Blocks 4 Hazard.",
            type: "Normal",
            cost: 18,
            hazardBlock: 4,
        });
        this.cardProperties.push({
            name: "Frost Focus",
            description: "Generates 4 Frost Ember drops.",
            type: "Normal",
            cost: 20,
            frostEmbers: 4
        });
        this.cardProperties.push({
            name: "Loot & Scoot",
            description: "Generates 7 Treasure drops and gives 15 seconds of Speed II.",
            type: "Normal",
            cost: 20,
            treasure: 7,
            speed : "15 seconds"
        });
        this.cardProperties.push({
            name: "Second Wind",
            description: "Gives 15 seconds of Regeneration II and Speed II.",
            type: "Normal",
            speed : "15 seconds",
            regeneration : "15 seconds"
        });
        this.cardProperties.push({
            name: "Reckless Charge",
            description: "Generates 2 Hazard. If you trigger a Shrieker within 8 seconds, gain 10 Frost Ember drops.",
            type: "Normal",
            cost: 28,
            hazard : 2,
        });
        this.cardProperties.push({
            name: "Sprint",
            description: "Gives 60 seconds of Speed II.",
            type: "Normal",
            cost: 30,
        });
        this.cardProperties.push({
            name: "Nimble Looting",
            description: "Blocks 1 Clank and generates 2 Treasure drops. Until Clank increases, each Clank blocked generates 2 Treasure.",
            type: "Normal",
            cost: 32,
            clankBlock: 1,
            treasure: 2,
        });
        this.cardProperties.push({
            name: "Smash & Grab",
            description: "Generates 13 Treasure drops, but adds 2 Clank.",
            type: "Normal",
            cost: 34,
            clank: 2,
            treasure: 13,
        });
        this.cardProperties.push({
            name: "Quickstep",
            description: "Blocks 2 Clank, gives 15 seconds of Speed II, and the next non-ethereal card played will be recycled, allowing it to be played again.",
            type: "Normal",
            cost: 36,
            clankBlock: 2,
            speed : "15 seconds",
        });
        this.cardProperties.push({
            name: "Adrenaline Rush",
            description: "Adds 1 Hazard. Every heartbeat for the next 20 seconds generates 1 Treasure drop.",
            type: "Normal",
            cost: 40,
            hazard : 1,
        });

        //------------RARE CARDS --------------------
        this.cardProperties.push({
            name: "Eerie Silence",
            description: "Blocks 8 Clank and 2 Hazard, but the next card that would have been drawn will have no effect.",
            type: "Normal",
            cost: 42,
            clankBlock: 8,
            hazardBlock: 2,
        });

        this.cardProperties.push({
            name: "Dungeon Repairs",
            description: "Blocks 7 Hazard, but generates 1 Clank.",
            type: "Normal",
            cost: 44,
            clank: 1,
            hazardBlock: 7,
        
        });

        this.cardProperties.push({
            name: "Swagger",
            description: "Generates 10 Treasure and 10 Frost Ember drops, but adds 2 Stumble cards into the deck.",
            type: "Normal",
            cost: 46,
            treasure: 10,
            frostEmbers: 10
        });

        this.cardProperties.push({
            name: "Chill Step",
            description: "Any future Sneak cards played will generate 2 Frost Ember drops. This effect may stack, for a maximum of 6 Frost Ember drops.",
            type: "Normal",
            cost: 48,
        });

        this.cardProperties.push({
            name: "Eyes On The Prize",
            description: "Grants an extra available purchase (an extra card option) at the post-run Frost Ember Shop.",
            type: "Normal",
            cost: 52,
        });

        this.cardProperties.push({
            name: "Cold Snap",
            description: "Generates 3 Hazard, but for the next 3 cards played, Frost Ember drops double.",
            type: "Normal",
            cost: 58,
            hazard: 3,
        });

        this.cardProperties.push({
            name: "Silent Runner",
            description: "Every 15 seconds that a Speed buff is active, 50% chance to block 1 Clank.",
            type: "Permanent",
            cost: 60,
        });

        this.cardProperties.push({
            name: "Brilliance",
            description: "The next two non-ethereal cards played will be recycled into the deck, allowing them to be played again.",
            type: "Normal",
            cost: 66
        });
    }

    // Method to apply a card's properties based on its name
    applyCardProperties(cardName) {
        const card = this.cardProperties.find(c => c.name === cardName);
        if (card) {
            this.clankBlock += card.clankBlock || 0;
            this.hazardBlock += card.hazardBlock || 0;
            this.treasure += card.treasure || 0;
            this.frostEmbers += card.frostEmbers || 0;
        }
    }
}

// Usage example:
const cardDeck = new Cards();
cardDeck.applyCardProperties("Sneak"); // Apply properties of the "Sneak" card
