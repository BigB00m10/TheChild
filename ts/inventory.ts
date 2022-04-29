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
  itemName: string;
  price: number;
  description: string;
  packQuantity: number = 1;
  avaliable: number;
  tags: Set<string>;
  constructor(init?: Partial<Product>) {
    Object.assign(this, init);
  }
  transferTo(inventory: Inventory, count: number = 1) {
    inventory.add({
      name: this.itemName ? this.itemName : this.name,
      description: this.description,
      count: count * this.packQuantity,
      tags: this.tags,
    });
    this.avaliable -= count;
  }
}
class Item {
  name: string;
  description: string;
  count: number = 1;
  tags: Set<string>;
  constructor(init?: Partial<Item>) {
    Object.assign(this, init);
  }
}
class Inventory {
  items: Item[] = [];
  add(item: Item): void {
    let existing: Item = this.items.firstOrDefault(
      (i: Item) => (i.name = item.name)
    );
    if (existing) existing.count += item.count;
    else this.items.push(item);
  }
  remove(item: Item, count: number = 0): void {
    if (!item) return;
    if (!count || count >= item.count) this.items.delete(item);
    else item.count -= count;
  }
  get(name: string): Item {
    return this.items.firstOrDefault((i: Item) => (i.name = name));
  }
  removeByName(name: string, count: number = 0): void {
    this.remove(this.get(name), count);
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
  move(itemIndex: number, destination: Inventory): void {
    destination.add(this.items[itemIndex]);
    this.items.deleteAt(itemIndex);
  }
  clear(): void {
    this.items = [];
  }
}
class OnlineStore {
  products: Product[] = [
    new Product({
      name: "Matress",
      description:
        "Adds an additional bed to your basement so another slave can move in.",
      price: 70,
      tags: new Set(["basement", "home", "furniture"]),
    }),
    new Product({
      name: "Chloroform",
      itemName: "chloroform doses",
      description:
        "Helps getting a good sleep, and in your life in general. Can be used on others.",
      price: 33,
      tags: new Set(["player", "consumable"]),
      packQuantity: 10,
    }),
  ];
  bought: Inventory = new Inventory();
  get(name: string): Product {
    let store: OnlineStore = this;
    if (SugarCube.State) {
      let variables = SugarCube.State.variables as any;
      store = variables.onlineStore as OnlineStore;
    }
    return store.products.firstOrDefault((p: Product) => p.name == name);
  }
  buy(productIndex: number, count: number = 1): void {
    let variables = SugarCube.State.variables as any;
    let store = variables.onlineStore as OnlineStore;
    let product = store.products[productIndex];
    product.transferTo(store.bought);
    (variables.player as Player).cash -= product.price * count;
    if (product.avaliable > 0) {
      if (product.avaliable <= count) store.products.deleteAt(productIndex);
      else store.products[productIndex].avaliable -= count;
    }
  }
  receiveBought(): void {
    let variables = SugarCube.State.variables as any;
    let store = variables.onlineStore as OnlineStore;
    let player = variables.player as Player;
    let basement = variables.basement as Basement;
    for (let index = 0; index < store.bought.items.length; index++) {
      const item = store.bought.items[index];
      switch ([...item.tags][0]) {
        case "basement":
          basement.contents.add(item);
          break;
        default:
          player.inventory.add(item);
          break;
      }
    }
    store.bought.clear();
  }
  pendingOrder(): boolean {
    let variables = SugarCube.State.variables as any;
    let store = variables.onlineStore as OnlineStore;
    return store.bought.items.length > 0;
  }
}
