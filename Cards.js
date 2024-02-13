class Cards {
    constructor(steve, treasure, ember) {
        this.steve = steve;
        this.steveEnhancedSpeed = this.steve.playerRunSpeed * 1.4;

        this.treasure =  0;
        this.frostEmbers = 0;

        this.clankBlock = 0;
        this.hazardBlock = 0;
        this.clank = 0;
        this.hazard = 0;

        this.speedEffectDuration = 0;
        this.regenerationEffectDuration = 0;
        this.adrenalineRushDuration = 0;

        this.cardProperties = [];
        

        // Scheduler for managing timed events
        this.scheduler = [];
        this.schedulerIntervalID = null;

        // Properties for the cards
        this.nimbleLootingActive = false;
        this.nimmleCardsActive = 0; 
 
        this.adrenalineRushActive = false; 
        this.adrenalineRushDuration = 0;
        this.adrenalineCardsActive = 0; 

        this.cardDeck = [];
        this.masterDeck = [];
        this.loadCards();
        this.startHeartbeat(); // Start the heartbeat process
       
    }
   
    DeckOfCards(array){
        this.cardDeck = this.shuffleArray([...array]); // Clone and shuffle the array
        this.masterDeck = [...this.cardDeck]; // Clone to masterDeck

        // ResTriction the User to the Maximum of cards
        this.cardDeck = array.filter(card => {
           card.amount = card.amount % card.maxAllowed;
        });

        this.scheduleTask(() => { // Calling each Cards After 30 seconds
            this.cardDeck = this.shuffleArray(this.cardDeck); // Clone and shuffle the array
            if (this.cardDeck.length > 0) {
                let card = this.cardDeck[0];              
                this.applyCardProperties(card);
                if(card.type === "Normal"){
                    if(card.amount > 1)
                       card.amount--;
                    else 
                    this.cardDeck.shift();
                }
                if(card.type === "Ethereal"){
                    if(card.amount > 1){
                       const cardIndexInMaster = this.masterDeck.findIndex(c => c.name === card.name);
                       if (cardIndexInMaster !== -1) {
                       this.masterDeck[cardIndexInMaster].amount--;
                       }
                       card.amount--;
                    }
                    else {
                    const cardIndexInMaster = this.masterDeck.findIndex(c => c.name === cardName && c.type !== "Ethereal");
                    if (cardIndexInMaster !== -1) {
                        this.masterDeck.splice(cardIndexInMaster, 1);
                    }
                    this.cardDeck.shift();
                     }
                }   
            }
            else{
                this.stopScheduler();
            }
        }, 30, 0,true); 

        this.startScheduler(); // Start the scheduler to handle timed events
        //return this.masterDeck;
    }
   
    shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }


    scheduleTask(action,initialDelay, interval, TimesRepeating , Looping) {
        this.scheduler.push({
            action: action, // The action to perform
            initialDelay : initialDelay, // Seconds to start the task later
            interval: interval, // How often to perform it in seconds
            nextTick: interval, // Seconds until the next execution
            TimesRepeating: TimesRepeating, // Whether this task repeats
            Looping : Looping // Wheter the task will repet infinitly.
        });
    }

    startScheduler() {
        this.schedulerIntervalID = setInterval(() => {
            this.scheduler.forEach((task, index) => {
                if(--task.initialDelay <= 0 ){
                    if (--task.nextTick <= 0) {
                        task.action(); // Execute the scheduled task
                        if (task.Looping) {
                            task.nextTick = task.interval; // Reset the tick counter for repeating tasks
                        } 
                        else if (task.TimesRepeating > 0) {
                            task.nextTick = task.interval; // Reset the tick counter for repeating tasks
                            task.TimesRepeating--;
                        }
                        else {
                            // Remove non-repeating tasks after execution
                            this.scheduler.splice(index, 1);
                        }
                    }
                }
                else 
                   --task.initialDelay;
            });
        }, 1000); // Scheduler checks and runs tasks every second
    }
    stopScheduler() {
        if (this.schedulerIntervalID != null) {
            clearInterval(this.schedulerIntervalID);
            this.schedulerIntervalID = null; // Clear the stored ID to indicate the scheduler is stopped
        }
    }
    startHeartbeat() {
        const adjustHeartbeatInterval = () => {
            // Adjust the heartbeat interval based on clank, not going below the fastest interval
            let newInterval = this.heartbeatInterval - (this.clank * this.heartbeatIncreaseFactor);
            newInterval = Math.max(newInterval, this.heartbeatFastestInterval);
    
            // Schedule the next heartbeat
            setTimeout(() => {
                this.onHeartbeat();
                adjustHeartbeatInterval(); // Adjust again for the next heartbeat
            }, newInterval);
        };
    
        adjustHeartbeatInterval(); // Start the heartbeat adjustment cycle
    }
    
    onHeartbeat() {
        // Define what happens on each heartbeat
        console.log("Heartbeat occurred.");
    
    }
        
    loadCards() { // Method to initialize card properties

    //------------COMMON CARDS --------------------

        this.cardProperties.push({
            name: "Sneak",
            description: "Blocks 2 Clank",
            type: "Normal",
            cost: 7,
            clankBlock: 2,
            maxAllowed : 5,
            amount : 0
        });
        this.cardProperties.push({
            name: "Stability",
            description: "Blocks 2 Hazard",
            type: "Normal",
            cost: 8,
            hazardBlock: 2,
            maxAllowed : 5,
            amount : 0
        });
        this.cardProperties.push({
            name: "Treasure Hunter",
            description: "Generates 4 Treasure drops",
            type: "Normal",
            cost: 9,
            treasure: 4,
            maxAllowed : 5,
            amount : 0
        });
        this.cardProperties.push({
            name: "Ember Seeker",
            description: "Generates 2 Frost Ember drops",
            type: "Normal",
            cost: 10,
            frostEmbers: 2,
            maxAllowed : 5,
            amount : 0
        });
        this.cardProperties.push({
            name: "Moment of Clarity",
            description: "Blocks 2 Clank, Blocks 2 Hazard, generates 4 Treasure drops, and generates 2 Frost Ember drops.",
            type: "Ethereal",
            cost: 6,
            clankBlock: 2,
            hazardBlock: 2,
            treasure: 4,
            frostEmbers: 2,
            maxAllowed : 5,
            amount : 0
        });

        //------------UNCOMMON CARDS --------------------

        this.cardProperties.push({
            name: "Evasion",
            description: "Blocks 4 Clank.",
            type: "Normal",
            cost: 16,
            clankBlock: 4,
            maxAllowed : 3,
            amount : 0
        });

        this.cardProperties.push({
            name: "Tread Lightly",
            description: "Blocks 4 Hazard.",
            type: "Normal",
            cost: 18,
            hazardBlock: 4,
            maxAllowed : 3,
            amount : 0
        });
        this.cardProperties.push({
            name: "Frost Focus",
            description: "Generates 4 Frost Ember drops.",
            type: "Normal",
            cost: 20,
            frostEmbers: 4,
            maxAllowed : 3,
            amount : 0
        });
        this.cardProperties.push({
            name: "Loot & Scoot",
            description: "Generates 7 Treasure drops and gives 15 seconds of Speed II.",
            type: "Normal",
            cost: 20,
            treasure: 7,
            speedTime : 15,
            maxAllowed : 3,
            amount : 0 
        });
        this.cardProperties.push({
            name: "Second Wind",
            description: "Gives 15 seconds of Regeneration II and Speed II.",
            type: "Normal",
            speedTime : 15 ,
            regenerationTime : 15,
            maxAllowed : 3,
            amount : 0 
        });
        this.cardProperties.push({
            name: "Reckless Charge",
            description: "Generates 2 Hazard. If you trigger a Shrieker within 8 seconds, gain 10 Frost Ember drops.",
            type: "Normal",
            cost: 28,
            hazard : 2,
            frostEmbers : 10,
            maxAllowed : 3,
            amount : 0
        });
        this.cardProperties.push({
            name: "Sprint",
            description: "Gives 60 seconds of Speed II.",
            type: "Normal",
            cost: 30,
            speedTime : 60,
            maxAllowed : 3,
            amount : 0
        });
      
        this.cardProperties.push({
            name: "Smash & Grab",
            description: "Generates 13 Treasure drops, but adds 2 Clank.",
            type: "Normal",
            cost: 34,
            clank: 2,
            treasure: 13,
            maxAllowed : 3,
            amount : 0
        });

        this.cardProperties.push({
            name: "Nimble Looting",
            description: "Blocks 1 Clank and generates 2 Treasure drops. Until Clank increases, each Clank blocked generates 2 Treasure.",
            type: "Normal",
            cost: 32,
            clankBlock: 1,
            treasure: 2,
            maxAllowed : 3,
            amount : 0
        });

        this.cardProperties.push({
            name: "Quickstep",
            description: "Blocks 2 Clank, gives 15 seconds of Speed II, and the next non-ethereal card played will be recycled, allowing it to be played again.",
            type: "Normal",
            cost: 36,
            clankBlock: 2,
            speedTime : 15,
            maxAllowed : 3,
            amount : 0
        });

        this.cardProperties.push({
            name: "Adrenaline Rush",
            description: "Adds 1 Hazard. Every heartbeat for the next 20 seconds generates 1 Treasure drop.",
            type: "Normal",
            cost: 40,
            hazard : 1,
            maxAllowed : 3,
            amount : 0,
            heartBeat : 20
        });
    }

    applyCardProperties(Card) {
        const card = this.cardProperties.find(c => c.name === Card.name);
        
        if (card) {
        
            if (card.clankBlock)        // Handle clankBlock addition as a scheduled task
               this.AddClankBlock(card.clankBlock);
        
            if (card.hazardBlock)       // Handle hazardBlock addition as a scheduled task
                this.AddHazardBlock(card.hazardBlock);
                    
            if (card.treasure)          // Handle treasure addition as a scheduled task
                this.AddTreasure(card.treasure);
          
            if (card.frostEmbers)       // Handle frostEmbers addition as a scheduled task
               this.AddFrostEmbers(card.frostEmbers);
         
            if (card.clank)             // Handle clank addition as a scheduled task
               this.AddClank(card.clank);
          
            if (card.hazard)            // Handle hazard addition as a scheduled task
                this.AddHazard(card.hazard);
            
            if (card.speedTime)         // Handle speedTime addition as a scheduled task
                this.AddSpeedTime(card.speedTime);
     
            if (card.regenerationTime)  // Handle RegenerationTime addition as a scheduled task
                this.AddRegenerationTime(card.regenerationTime);
            
            if (card.name === "Nimble Looting") {
                this.nimbleLootingActive = true;
                this.nimmleCardsActive++;
            }

            if (card.name === "Quickstep") {
                this.etherealActive = true;
            }

            if (this.etherealActive) {
                this.etherealActive = false;
                this.cardDeck.push(card);
            }

            if (card.name === "Adrenaline Rush") {
                 this.AddAdrenalineRush(card.heartBeat);
            }

        }
    }
    AddClankBlock(num){
        this.scheduleTask(() => {
            this.clankBlock += 1;               
        },0, 1,num, false); // Schedule clankBlock addition to happen every second
    }

    DeleteClankBlock(num){
        this.scheduleTask(() => {
            this.clankBlock -= 1;               
        },0, 1,num, false); // Schedule clankBlock addition to happen every second
    }

    AddHazardBlock(num){
        this.scheduleTask(() => {
            this.hazardBlock += 1;               
        },0, 1,num, false); // Schedule hazardBlock addition to happen every second
    }

    DeleteHazardBlock(num){
        this.scheduleTask(() => {
            this.hazardBlock -= 1;               
        },0, 1,num, false); // Schedule clankBlock addition to happen every second
    
    }

    AddTreasure(num){
        this.scheduleTask(() => {
            this.treasure += 1;               
        }, 0, 3, num, false); // Schedule treasure addition to happen every second

        this.scheduleTask(() => {
            this.treasure -= 1;               
        }, num+2, 3, num, false);
    }

    AddFrostEmbers(num){
        this.scheduleTask(() => {
            this.frostEmbers += 1;               
        },0, 1, num, false); // Schedule frostEmbers addition to happen every second

        this.scheduleTask(() => {
            this.frostEmbers -= 1;               
        }, num+2, 3, num, false);
    }
    AddClank(num) {
          
        if (this.clankBlock >= num) {
            if(this.nimbleLootingActive){
                this.AddTreasure(2*this.nimmleCardsActive);
            }
            this.DeleteClankBlock(num);
        } else {
            const excessClank = num - this.clankBlock;
            this.clank += excessClank;
            this.nimbleLootingActive = false;
            this.nimmleCardsActive = 0;

            this.DeleteClankBlock(this.clankBlock);
        }
    }

    AddHazard(num){
        if(this.hazardBlock >= num ){
            this.DeleteHazardBlock(num);
        }else {
            num -= this.hazardBlock;
            this.hazard +=num;
            this.DeleteHazardBlock(this.hazardBlock);
        }
    }

    AddSpeedTime(num) {
        // Initially apply enhanced speed if not already applied
        if (this.speedEffectDuration <= 0) {
            this.steve.playerRunSpeed = this.steveEnhancedSpeed;
        }
    
        // Add new duration to existing speedEffectDuration
        this.speedEffectDuration += num;
    
        // If there is no ongoing interval for decreasing speedEffectDuration, start it
        if (!this.speedDecreaseScheduled) {
            this.speedDecreaseScheduled = true; // Indicate that the decrease interval is set
    
            const decreaseSpeedEffect = () => {
                if (this.speedEffectDuration > 0) {
                    this.speedEffectDuration--;
    
                    if (this.speedEffectDuration <= 0) {
                        // Once all speedTime effects have expired, revert to normal speed
                        this.steve.playerRunSpeed = this.steve.playerRunSpeed / 1.4;
                        this.speedDecreaseScheduled = false; // Indicate that the decrease interval can be set again
                        clearInterval(this.speedEffectIntervalID); // Clear the interval to stop decrementing
                    }
                }
            };
    
            // Set an interval to decrement speedEffectDuration every second
            this.speedEffectIntervalID = setInterval(decreaseSpeedEffect, 1000);
        }
    }
    
    AddRegenerationTime(num){
            // // Initially apply enhanced speed if not already applied
            // if (this.speedEffectDuration <= 0) {
            //     this.steve.playerRunSpeed = this.steveEnhancedSpeed;
            // }
        
            // // Add new duration to existing speedEffectDuration
            // this.speedEffectDuration += num;
        
            // // If there is no ongoing interval for decreasing speedEffectDuration, start it
            // if (!this.speedDecreaseScheduled) {
            //     this.speedDecreaseScheduled = true; // Indicate that the decrease interval is set
        
            //     const decreaseSpeedEffect = () => {
            //         if (this.speedEffectDuration > 0) {
            //             this.speedEffectDuration--;
        
            //             if (this.speedEffectDuration <= 0) {
            //                 // Once all speedTime effects have expired, revert to normal speed
            //                 this.steve.playerRunSpeed = this.steve.playerRunSpeed / 1.4;
            //                 this.speedDecreaseScheduled = false; // Indicate that the decrease interval can be set again
            //                 clearInterval(this.speedEffectIntervalID); // Clear the interval to stop decrementing
            //             }
            //         }
            //     };
        
            //     // Set an interval to decrement speedEffectDuration every second
            //     this.speedEffectIntervalID = setInterval(decreaseSpeedEffect, 1000);
            // }
    }

    // this.adrenalineRushDuration = 0;
    // this.adrenalineCardsActive = 0; 

    AddAdrenalineRush(num) {
    // Add 1 hazard as part of the Adrenaline Rush effect
    //this.AddHazard(1);

    // Add new duration to existing adrenalineRushDuration
    this.adrenalineRushDuration += num;

    // If there is no ongoing interval for decreasing adrenalineRushDuration, start it
    if (!this.speedDecreaseScheduled) {
        this.speedDecreaseScheduled = true; // Indicate that the decrease interval is set

        const decreaseSpeedEffect = () => {
            if (this.adrenalineRushDuration > 0) {
                this.adrenalineRushDuration--;

                if (this.adrenalineRushDuration <= 0) {
                    // Once all speedTime effects have expired, revert to normal speed
                    this.steve.playerRunSpeed = this.steve.playerRunSpeed / 1.4;
                    this.speedDecreaseScheduled = false; // Indicate that the decrease interval can be set again
                    clearInterval(this.speedEffectIntervalID); // Clear the interval to stop decrementing
                }
            }
        };

        // Set an interval to decrement speedEffectDuration every second
        this.speedEffectIntervalID = setInterval(decreaseSpeedEffect, 1000);
      }
    }
}