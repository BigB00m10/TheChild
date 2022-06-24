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
  available: number;
  soldOut: boolean = false;
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
    //if (this.available > 0) this.available -= count;
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
      (i: Item) => i.name == item.name
    );
    if (existing) existing.count += item.count;
    else this.items.push(item);
  }
  remove(item: Item, count: number = 1): void {
    if (!item) return;
    if (!count || count >= item.count) this.items.delete(item);
    else item.count -= count;
  }
  get(name: string): Item {
    let found: Item = this.items.firstOrDefault(
      (i: Item) => i.name.toLowerCase() == name.toLowerCase()
    );
    if (!found)
      found = this.items.firstOrDefault(
        (i: Item) => i.name.split(" ")[0].toLowerCase() == name.toLowerCase()
      );
    return found;
  }
  removeByName(name: string, count: number = 1): void {
    this.remove(this.get(name), count);
  }
  has(itemName: string, count: number = 0): boolean {
    let item: Item = this.get(itemName);
    if (item === null) return false;
    if (!count) return true;
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
  constructor(init?: Partial<Inventory>) {
    Object.assign(this, init);
  }
}
class OnlineStore {
  version: number = 2;
  products: Product[] = [
    new Product({
      name: "Chloroform",
      itemName: "chloroform doses",
      description:
        "Helps getting a good sleep, and in your life in general. Can be used on others.",
      price: 33,
      tags: new Set(["player", "consumable", "capture"]),
      packQuantity: 10,
    }),
    new Product({
      name: "Mattress",
      description:
        "Adds an additional bed to your basement so another slave can move in.",
      price: 70,
      tags: new Set(["basement", "home", "furniture"]),
    }),
    new Product({
      name: "Lube",
      description:
        "Slippery lotion. Can be used for easier screwing, among other things<<emoji 😏>>",
      price: 15,
      tags: new Set(["player", "sex"]),
      available: 1,
    }),
    new Product({
      name: "Candy",
      description: "Most people like these. Kids, especially<<emoji 🤭>>.",
      price: 5,
      tags: new Set(["player", "lure", "bribery", "capture", "food"]),
      available: 5,
      soldOut: true, //Hidden product, for now
    }),
    new Product({
      name: "Sleeping pills",
      description: "Sweet dreams are made of these.<<emoji 💤>>.",
      price: 12,
      tags: new Set(["player", "capture", "medicine"]),
      available: 20,
      soldOut: true, //Hidden product, for now
    }),
  ];
  bought: Inventory = new Inventory();
  get(name: string): Product {
    let store: OnlineStore = Variables().onlineStore as OnlineStore;
    if (!store) store = this;
    return store.products.firstOrDefault(
      (p: Product) => p.name.toLowerCase() == name.toLowerCase()
    );
  }
  canBuy(productIndex: number, count: number = 1): boolean {
    let variables = Variables();
    let player = variables.player as Player;
    let store = variables.onlineStore as OnlineStore;
    let product = store.products[productIndex];
    return player.cash >= product.price * count;
  }
  buy(productIndex: number, count: number = 1): boolean {
    let variables = Variables();
    let player = variables.player as Player;
    let store = variables.onlineStore as OnlineStore;
    let product = new Product(store.products[productIndex]);
    let total = product.price * count;
    if (total > player.cash) return false;
    store.bought = new Inventory(store.bought);
    product.transferTo(store.bought, count);
    player.cash = Math.round((player.cash - total) * 100) / 100;
    if (product.available > 0) {
      if (product.available <= count)
        variables.onlineStore.products[productIndex].soldOut = true;
      else variables.onlineStore.products[productIndex].available -= count;
    }
    return true;
  }
  destination(product: Product | Item): Inventory {
    switch ([...product.tags][0]) {
      case "basement":
        let basement = Variables().basement as Basement;
        basement.contents = new Inventory(basement.contents);
        return basement.contents;
      default:
        let player = Variables().player as Player;
        player.inventory = new Inventory(player.inventory);
        return player.inventory;
    }
  }
  isBought(itemName: string): boolean {
    return new Inventory(Variables().onlineStore.bought).has(itemName);
  }
  receiveBought(): void {
    let variables = Variables();
    let store = variables.onlineStore as OnlineStore;
    let player = variables.player as Player;
    let basement = variables.basement as Basement;
    for (let index = 0; index < store.bought.items.length; index++) {
      const item = store.bought.items[index];
      switch ([...item.tags][0]) {
        case "basement":
          basement.contents = new Inventory(basement.contents);
          basement.contents.add(item);
          break;
        default:
          player.inventory = new Inventory(player.inventory);
          player.inventory.add(item);
          break;
      }
    }
    store.bought = new Inventory(store.bought);
    store.bought.clear();
  }
  pendingOrder(): boolean {
    let store = Variables().onlineStore as OnlineStore;
    return store.bought.items.length > 0;
  }
  priceText(product: Product): string {
    return "¤" + product.price;
  }
  productText(product: Product): string {
    let text = product.name;
    if (product.packQuantity > 1) text += " x " + product.packQuantity;
    return text + ": ";
  }
}
