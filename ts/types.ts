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
class Player {
  name: string = "David";
  gender: Gender = "male";
  cash: number = 100;
  house: Home = Homes.smallUrban;
  job: Job = Jobs.garbageCollector;
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
