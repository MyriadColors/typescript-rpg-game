// Types
interface Weapon {
  name: string;
  power: number;
}

interface Monster {
  name: string;
  level: number;
  health: number;
}

interface Location {
  name: string;
  buttonText: string[];
  buttonFunctions: (() => void)[];
  text: string;
}

// Game State
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting: number | null = null;
let monsterHealth: number | null = null;
let inventory: string[] = ["stick"];

// DOM Selectors
const button1 = document.querySelector('#button1') as HTMLButtonElement;
const button2 = document.querySelector("#button2") as HTMLButtonElement;
const button3 = document.querySelector("#button3") as HTMLButtonElement;
const text = document.querySelector("#text") as HTMLElement;
const xpText = document.querySelector("#xpText") as HTMLElement;
const healthText = document.querySelector("#healthText") as HTMLElement;
const goldText = document.querySelector("#goldText") as HTMLElement;
const monsterStats = document.querySelector("#monsterStats") as HTMLElement;
const monsterName = document.querySelector("#monsterName") as HTMLElement;
const monsterHealthText = document.querySelector("#monsterHealth") as HTMLElement;

const weapons: Weapon[] = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

const monsters: Monster[] = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
];

const locations: Location[] = [
  {
    name: "town square",
    buttonText: ["Go to store", "Go to cave", "Fight dragon"],
    buttonFunctions: [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    buttonText: ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    buttonFunctions: [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    buttonText: ["Fight slime", "Fight fanged beast", "Go to town square"],
    buttonFunctions: [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    buttonText: ["Attack", "Dodge", "Run"],
    buttonFunctions: [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    buttonText: ["Go to town square", "Go to town square", "Go to town square"],
    buttonFunctions: [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
    buttonFunctions: [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"], 
    buttonFunctions: [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    buttonText: ["2", "8", "Go to town square?"],
    buttonFunctions: [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

window.addEventListener('DOMContentLoaded', () => {
  button1.onclick = goStore;
  button2.onclick = goCave;
  button3.onclick = fightDragon;
  update(locations[0]);
});


/**
 * Updates the game interface based on the current location.
 * 
 * This function updates the text and functionality of the buttons,
 * sets the main text content, and hides the monster stats display.
 * 
 * @param location - The Location object containing information about the current game location.
 * @param location.buttonText - An array of strings for button labels.
 * @param location.buttonFunctions - An array of functions to be assigned to button click events.
 * @param location.text - The main text content to be displayed for this location.
 * 
 * @returns void
 */
function update(location: Location) {
  monsterStats.style.display = "none";

  button1.innerText = location.buttonText[0];
  button1.onclick = location.buttonFunctions[0];

  button2.innerText = location.buttonText[1];
  button2.onclick = location.buttonFunctions[1];

  button3.innerText = location.buttonText[2];
  button3.onclick = location.buttonFunctions[2];

  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

/**
 * Attempts to purchase health for the player in exchange for gold.
 * 
 * This function checks if the player has enough gold (10 or more) to buy health.
 * If successful, it deducts 10 gold from the player's total and increases their health by 10 points.
 * The function then updates the displayed gold and health values in the UI.
 * If the player doesn't have enough gold, it displays a message indicating insufficient funds.
 * 
 * @returns {void}
 */
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    if (goldText instanceof HTMLElement) {
      goldText.innerText = gold.toString();
    }
    if (healthText instanceof HTMLElement) {
      healthText.innerText = health.toString();
    }
  } else {
    if (text instanceof HTMLElement) {
      text.innerText = "You do not have enough gold to buy health.";
    }
  }
}

/**
 * Handles the purchase of a new weapon for the player.
 * 
 * This function attempts to buy the next available weapon in the weapons array.
 * It checks if the player has enough gold and if there are more powerful weapons available.
 * If successful, it updates the player's gold, current weapon, and inventory.
 * @returns {void}
 */
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      updateGoldText();
      const newWeapon = weapons[currentWeapon].name;
      updateInventoryText(newWeapon);
      inventory.push(newWeapon);
    } else {
      updateText("You do not have enough gold to buy a weapon.");
    }
  } else {
    updateText("You already have the most powerful weapon!");
    updateButton2("Sell weapon for 15 gold", sellWeapon);
  }
}

function updateGoldText() {
  if (goldText instanceof HTMLElement) {
    goldText.innerText = gold.toString();
  }
}

function updateInventoryText(newWeapon: string) {
  if (text instanceof HTMLElement) {
    text.innerText = `You now have a ${newWeapon}. In your inventory you have: ${inventory}`;
  }
}

function updateText(message: string) {
  if (text instanceof HTMLElement) {
    text.innerText = message;
  }
}

function updateButton2(label: string, onClick: () => void) {
  if (button2 instanceof HTMLButtonElement) {
    button2.innerText = label;
    button2.onclick = onClick;
  }
}

function sellWeapon() {
  if (inventory.length <= 1) {
    updateText("Don't sell your only weapon!");
    return;
  }

  gold += 15;
  updateGoldText();

  const soldWeapon = inventory.shift();
  updateText(`You sold a ${soldWeapon}. In your inventory you have: ${inventory.join(', ')}`);
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  if (fighting !== null) {
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth.toString();
  }
}

/**
 * Handles the attack action in the game combat system.
 * 
 * This function simulates a combat round where both the player and the monster attack each other.
 * It updates the health of both entities, checks for hits and misses, and handles end-of-battle conditions.
 * Additionally, it includes a chance for the player's weapon to break during combat.
 * @returns {void}
 */
function attack() {
  if (
    text instanceof HTMLElement &&
    healthText instanceof HTMLElement &&
    monsterHealthText instanceof HTMLElement &&
    fighting !== null &&
    monsterHealth !== null
  ) {
    if (fighting === null || monsterHealth === null) {
      text.innerText = "You are already fighting!";
      return;
    }

    const monster = monsters[fighting];
    const currentWeaponName = weapons[currentWeapon].name;

    text.innerText = `The ${monster.name} attacks. You attack it with your ${currentWeaponName}.`;

    // Player takes damage
    health -= getMonsterAttackValue(monster.level);
    healthText.innerText = health.toString();

    // Monster takes damage if hit
    if (isMonsterHit()) {
      const damageDealt = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
      monsterHealth -= damageDealt;
      text.innerText += ` You hit the ${monster.name} for ${damageDealt} damage.`;
    } else {
      text.innerText += " You miss.";
    }
    monsterHealthText.innerText = monsterHealth.toString();

    // Check for end of battle conditions
    if (health <= 0) {
      lose();
    } else if (monsterHealth <= 0) {
      fighting === 2 ? winGame() : defeatMonster();
    }

    // Weapon breaking logic
    if (Math.random() <= 0.1 && inventory.length > 1) {
      const brokenItem = inventory.pop();
      if (brokenItem) {
        text.innerText += ` Your ${brokenItem} breaks.`;
        currentWeapon--;
      }
    }
  }
}

function getMonsterAttackValue(level: number): number {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return Math.max(0, hit); 
}


function isMonsterHit(): boolean {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  if (text instanceof HTMLElement && fighting !== null) {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
  }
}

/**
 * Handles the scenario when the player defeats a monster.
 * Updates the player's gold and experience points, and updates the UI.
 *
 * @remarks
 * This function is called when the player's health drops to zero after a successful attack.
 * It calculates the amount of gold and experience points the player earns based on the monster's level.
 * It then updates the player's gold and experience points, and calls the `update` function to change the location to the "kill monster" location.
 *
 * @returns {void}
 */
function defeatMonster() {
  if (fighting !== null 
    && goldText instanceof HTMLElement 
    && xpText instanceof HTMLElement) {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold.toString();
    xpText.innerText = xp.toString();
    update(locations[4]);
  }
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

/**
 * Restarts the game by resetting all player stats and inventory to their initial values.
 * 
 * This function:
 * - Resets the player's experience points, health, and gold to their starting values.
 * - Sets the current weapon to the initial weapon (index 0).
 * - Resets the inventory to contain only the starting item ("stick").
 * - Updates the UI elements to reflect the new values.
 * - Moves the player back to the town (starting location).
 * 
 * @remarks
 * This function assumes the existence of global variables for player stats and UI elements.
 * It also relies on the `goTown` function to update the game state to the starting location.
 * 
 * @returns {void}
 */
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  if (goldText instanceof HTMLElement) {
    goldText.innerText = gold.toString();
  }
  if (healthText instanceof HTMLElement) {
    healthText.innerText = health.toString();
  }
  if (xpText instanceof HTMLElement) {
    xpText.innerText = xp.toString();
  }
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess: number) {
  const numbers = Array.from({length: 10}, () => Math.floor(Math.random() * 11));
  const message = `You picked ${guess}. Here are the random numbers:\n${numbers.join('\n')}\n`;

  if (numbers.includes(guess)) {
    gold += 20;
    updateGoldText();
    text.innerText = message + "Right! You win 20 gold!";
  } else {
    health -= 10;
    updateHealthText();
    text.innerText = message + "Wrong! You lose 10 health!";
    if (health <= 0) {
      lose();
    }
  }
}

function updateHealthText() {
  healthText.innerText = health.toString();
}