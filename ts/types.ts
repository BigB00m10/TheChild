//Biological characteristics
type Sex = "male" | "female" | "herm";
//Social characteristics
type Gender = "boy" | "girl" | "nb";
type Genitals = "cunny" | "pussy" | "penis" | "dick";
type AllGenitals = {
  "male": Genitals
  "female": Genitals
  "all": string
}
interface Home {
  name: string;
  rent: number;
  //Spaces that this house have using the names of the main passages on that space
  spaces: string[];
}
//Returns the SugarCube variables object in Typescript format (variables saved in history).
function Variables(): any {
  return variables() as any;
}
//Returns the SugarCube temporary object in Typescript format (variables saved in memory that will vanish on the next passage).
function Temporary(): any {
  return temporary() as any;
}
class Player {
  //Zero UID identifies the player.
  uid: Uid = 0;
  name: string;
  sex: Sex;
  gender: Gender;
  genitals: AllGenitals;
  hasPussy: boolean;
  hasPenis: boolean;
  //The name of the hole where the player can be fucked by default (not sure if this will be used)
  sexHole: string;
  home: Home = Homes.smallUrban;
  job: Job = Jobs.garbageCollector;
  cash: number = 100;
  energy: number = 100;
  //Unused, not sure if it will ever be used.
  lust: number;
  //Set to true when the player goes to sleep so the bed passage knows that the player just woke up and to know if energy should be reduced or restored
  sleeping: boolean;
  //Just a flag to check if the player has worked already to avoid evading responsibilities.
  workedToday: boolean = false;
  //Holds the items that the player has available to use.
  inventory: Inventory = new Inventory();
  //Gets the player inventory object from the Sugarcube variables.
  getInventory() {
    return new Inventory(Variables().player.inventory);
  }
  //Checks if the player has an item in their inventory.
  has(itemName: string, count: number = 1) {
    return this.getInventory().has(itemName, count);
  }
  removeItem(itemName: string) {
    return this.getInventory().removeByName(itemName);
  }
  manageEnergy(hoursPassed: number) {
    let player = Variables().player as Player;
    let multiplier =
      player.sleeping || Variables().settings.infiniteEnergy ? 1 : -0.46;
    let increment = Math.round((hoursPassed / 8) * 100 * multiplier);
    if (increment == 0) increment = multiplier < 0 ? -1 : 1;
    player.energy = (player.energy + increment).clamp(0, 100);
  }
  setGender(gender: Gender) {
    let player = Variables().player as Player;
    player.gender = gender;
  }
  //Use this to change the player's sex.
  setSex(sex: Sex, player?: Player) {
    if(!player)
      player = Variables().player as Player;
    player.sex = sex;
    if (sex == "male") {
      player.genitals = {
        "male": "dick",
        "female": null,
        "all": "dick"
      };
      player.hasPenis = true;
      player.hasPussy = false;
      player.sexHole = "ass";
    }
    if (sex == "female") {
      player.genitals = {
        "male": null,
        "female": "pussy",
        "all": "pussy"
      };
      player.hasPenis = false;
      player.hasPussy = true;
      player.sexHole = "pussy";
    }
    if (sex == "herm") {
      player.genitals = {
        "male": "dick",
        "female": "pussy",
        "all": "dick and pussy"
      };
      player.hasPenis = true;
      player.hasPussy = true;
      player.sexHole = "pussy";
    }
  }
  //Achievements are used to keep track of what things are already done before.
  hasAchievement(achievement: string) {
    return (Variables().achievements as string[]).includes(achievement);
  }
  //Get how the specified NPC calls the player (how is the player addressed)
  getAddressing(npc: Npc) {
    let variables = Variables();
    let $player: Player = variables.player;
    if (npc.status == "citizen")
      return $player.gender != "boy" ? "lady" : "mister";
    let $addressing = variables.settings.addressing;
    if (npc.mom == this.uid || npc.dad == this.uid)
      return $addressing && $addressing.offspring
        ? $addressing.offspring
        : $player.gender != "boy"
        ? "mommy"
        : "daddy";
    let result = $player.name;
    if (!$addressing) return result;
    if ($addressing.slave) result = $addressing.slave;
    if (npc.status == "slave") return result;
    var specific = $addressing[npc.status];
    return specific ? specific : result;
  }
}
/* Snippet to hook an event to an object. Might be useful someday.
interface ILiteEvent<T> {
  on(handler: { (data?: T): void }): void;
  off(handler: { (data?: T): void }): void;
}
class LiteEvent<T> implements ILiteEvent<T> {
  private handlers: { (data?: T): void }[] = [];

  public on(handler: { (data?: T): void }): void {
    this.handlers.push(handler);
  }

  public off(handler: { (data?: T): void }): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  public trigger(data?: T) {
    this.handlers.slice(0).forEach((h) => h(data));
  }
}*/
interface String {
  /**
   * Split camelcase words and upper the first letter.
   */
  beautifyStat(): string;
}
//Split camelcase words and upper the first letter.
String.prototype.beautifyStat = function () {
  return this.toUpperFirst().replace(/(\B[A-Z])/g, " $1");
};
interface Array<T> {
  getSentence(): string;
}
//Constructs a sentence from an array of strings ["1","2","3"] becomes "1, 2 and 3"
Array.prototype.getSentence = function () {
  if (!this.length) return "";
  if (this.length == 1) return this[0];
  let clone = this.slice();
  let last = clone.pop();
  return clone.join(", ") + " and " + last;
};
//Useful class to make a less random generator than the one in Math or in Sugarcube.
//Two identical results appearing together is way les likely with this class if a correlative seed is provided.
class PseudoRandom {
  //Generates a seed from other objects. Player/npc stats, traits and name can be used, recommended to include something incremental like turns() or the current time.
  static getSeed(...components: any[]): number {
    let seed = 0;
    for (const index in components) {
      const component = components[index];
      switch (typeof component) {
        case "boolean":
        case "number":
          seed += component as number;
          break;
        case "string":
          for (let charIndex = 0; charIndex < component.length; charIndex++)
            seed = (seed << 5) - seed + component.charCodeAt(charIndex);
          break;
      }
    }
    return Math.abs(seed);
  }
  //Get a pseudorandom integer using the provided seed
  static getInt(seed: number): number {
    //27 is a coprime of 100 and 10-1 is divisible by 27's factors (3)
    return (27 * seed + 10) % 100;
  }
  //Get a pseudorandom floating comma number using the provided seed
  static getFloat(seed: number): number {
    return this.getInt(seed) / 100;
  }
  //Get a random integer number from a range of integer numbers using the provided seed
  static getFromRange(seed: number, start: number, end: number): number {
    return start + Math.floor(this.getFloat(seed) * (end - start));
  }
  //Get a random item from the provided array using the provided seed.
  static either<T>(seed: number, options: Array<T>): T {
    return options[this.getFromRange(seed, 0, options.length)];
  }
}
type Uid = number;
//Gets a unique identification number to identify objects, items, individuals or even places that can be generated.
//Since all other properties of an object has the possibility to be changed (even name) this can be used to save in an npc the Uid of their mother for instance.
//The zero Uid is reserved to identify the player.
function getUid(variables?: any): Uid {
  if (!variables) variables = Variables();
  variables.lastUid = variables.lastUid ? variables.lastUid + 1 : 1;
  return variables.lastUid;
}
