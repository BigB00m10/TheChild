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
  sleeping: boolean = true;
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
    player.energy = Math.round(
      player.energy + (hoursPassed / 8) * 100 * multiplier
    ).clamp(0, 100);
  }
  setGender(gender: Gender) {
    let player = Variables().player as Player;
    player.gender = gender;
    player.genitals = gender != "male" ? "pussy" : "dick";
    player.sexHole = gender != "male" ? "pussy" : "ass";
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
    window.OnlineStore.get("matress").transferTo(this.contents);
  }
  has(itemName: string, count: number = 1): boolean {
    return new Inventory(Variables().basement.contents).has(itemName, count);
  }
  avaliableBeds(): number {
    let variables = Variables();
    return (
      new Inventory(variables.basement.contents).get("matress").count -
      variables.slaves.length
    );
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
