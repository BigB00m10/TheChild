type Gender = "male" | "female";
interface Home {
  name: string;
  rent: number;
}
let Homes: Record<string, Home> = {
  smallUrban: { name: "small urban house", rent: 400 },
};
function Variables(): any {
  return variables() as any;
}
function Temporary(): any {
  return temporary() as any;
}
class Player {
  name: string;
  gender: Gender;
  genitals: string;
  sexHole: string;
  house: Home = Homes.smallUrban;
  job: Job = Jobs.garbageCollector;
  cash: number = 100;
  energy: number = 100;
  lust: number;
  sleeping: boolean;
  workedToday: boolean = false;
  inventory: Inventory = new Inventory();
  getInventory() {
    return new Inventory(Variables().player.inventory);
  }
  has(itemName: string, count: number = 1) {
    return this.getInventory().has(itemName, count);
  }
  removeItem(itemName: string) {
    return this.getInventory().removeByName(itemName);
  }
  manageEnergy(hoursPassed: number) {
    let player = Variables().player as Player;
    let multiplier = player.sleeping ? 1 : -0.46;
    let increment = Math.round((hoursPassed / 8) * 100 * multiplier);
    if (increment == 0) increment = multiplier < 0 ? -1 : 1;
    player.energy = (player.energy + increment).clamp(0, 100);
  }
  setGender(gender: Gender) {
    let player = Variables().player as Player;
    player.gender = gender;
    player.genitals = gender != "male" ? "pussy" : "dick";
    player.sexHole = gender != "male" ? "pussy" : "ass";
  }
  hasAchievement(achievement: string) {
    return (Variables().achievements as string[]).includes(achievement);
  }
}
interface HomeSpace {
  contents: Inventory;
  muffleBase: number;
  securityBase: number;
}
class Basement implements HomeSpace {
  contents: Inventory = new Inventory();
  muffleBase: number = 90;
  securityBase: number = 25;
  constructor() {
    window.OnlineStore.get("Mattress").transferTo(this.contents);
  }
  has(itemName: string, count: number = 1): boolean {
    return new Inventory(Variables().basement.contents).has(itemName, count);
  }
  availableBeds(): number {
    let variables = Variables();
    var contents = new Inventory(variables.basement.contents);
    var oldItem = contents.get("Matress");
    if (oldItem)
      //TODO: fix old misspelling, remove later
      oldItem.name = "Mattress";
    return contents.get("Mattress").count - variables.slaves.length;
  }
  getDemandingSlaves() {
    let slaves = Variables().slaves as Person[];
    let candidates: Person[] = [];
    for (let slaveIndex = 0; slaveIndex < slaves.length; slaveIndex++) {
      const slave = slaves[slaveIndex];
      if (slave.age >= 1 && slave.hunger >= 25) {
        slave.index = slaveIndex;
        slave.need = "hunger";
        candidates.push(slave);
      }
    }
    return candidates.sort(() => PseudoRandom.getFloat(turns()) - 0.5);
  }
}
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
}
interface String {
  /**
   * Split camelcase words and upper the first letter.
   */
  beautifyStat(): string;
}
String.prototype.beautifyStat = function () {
  return this.toUpperFirst().replace(/(\B[A-Z])/g, " $1");
};
class PseudoRandom {
  static getInt(seed: number): number {
    //27 is a coprime of 100 and 10-1 is divisible by 27's factors (3)
    return (27 * seed + 10) % 100;
  }
  static getFloat(seed: number): number {
    return this.getInt(seed) / 100;
  }
  static getFromRange(seed: number, start: number, end: number): number {
    return start + Math.floor(this.getFloat(seed) * (end - start));
  }
  static either<T>(seed: number, options: Array<T>): T {
    return options[this.getFromRange(seed, 0, options.length)];
  }
}
