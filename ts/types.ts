type Gender = "male" | "female";
interface Home {
  name: string;
  rent: number;
}
let Homes: Record<string, Home> = {
  smallUrban: { name: "small urban house", rent: 400 },
};
interface Array<T> {
  firstOrDefault<T>(predicate: Function): T;
}
Array.prototype.firstOrDefault = function <T>(predicate: Function) {
  return this.reduce((accumulator: T, currentValue: T) => {
    if (!accumulator && predicate(currentValue)) accumulator = currentValue;
    return accumulator;
  }, null);
};
class Product {
  name: string;
  price: number;
  description: string;
  packQuantity: number = 1;
  avaliable: number;
  tags: Set<string> = new Set<string>();
}
class Item {
  name: string;
  description: string;
  count: number = 1;
  tags: Set<string> = new Set<string>();
}
class Inventory {
  items: Item[];
  add(item: Item): void {
    let existing: Item = this.items.firstOrDefault(
      (i: Item) => (i.name = item.name)
    );
    if (existing) existing.count += item.count;
    else this.items.push(item);
  }
  remove(itemName: string, count: number = 0): void {
    let item: Item = this.items.firstOrDefault(
      (i: Item) => (i.name = itemName)
    );
    if (!item) return;
    if (!count || count >= item.count) this.items.delete(item);
    else item.count -= count;
  }
  has(itemName: string, count: number = 0): boolean {
    let item: Item = this.items.firstOrDefault(
      (i: Item) => (i.name = itemName)
    );
    if (!count) return item !== null;
    return item.count >= count;
  }
  hasAll(itemNames: string[]): boolean {
    return itemNames.countWith((n) => this.has(n)) == itemNames.length;
  }
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
}
interface Window {
  Now: Now;
  Homes: Record<string, Home>;
  Jobs: Record<string, Job>;
  Player: Player;
  Person: Person;
  PersonGeneration: PersonGeneration;
}
window.Now = new Now();
window.Homes = Homes;
window.Jobs = Jobs;
window.Player = new Player();
window.Person = new Person();
