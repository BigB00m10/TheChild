type Gender = "male" | "female";
type Genitals = "cunny" | "pussy" | "penis" | "dick";
interface Home {
  name: string;
  rent: number;
  spaces: string[];
}
function Variables(): any {
  return variables() as any;
}
function Temporary(): any {
  return temporary() as any;
}
class Player {
  uid: Uid = 0;
  name: string;
  gender: Gender;
  genitals: Genitals;
  sexHole: string;
  home: Home = Homes.smallUrban;
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
    let multiplier =
      player.sleeping || Variables().settings.infiniteEnergy ? 1 : -0.46;
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
  getAddressing(npc: Npc) {
    let variables = Variables();
    let $player: Player = variables.player;
    if (npc.status == "citizen")
      return $player.gender != "male" ? "lady" : "mister";
    let $addressing = variables.settings.addressing;
    if ($player.gender != "male" ? npc.mom == this.uid : npc.dad == this.uid)
      return $addressing && $addressing.offspring
        ? $addressing.offspring
        : $player.gender != "male"
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
type Uid = number;
function getUid(variables?: any): Uid {
  if (!variables) variables = Variables();
  variables.lastUid = variables.lastUid ? variables.lastUid + 1 : 1;
  return variables.lastUid;
}
