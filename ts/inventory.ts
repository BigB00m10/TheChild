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
  get(name: string): Product {
    return this.products.firstOrDefault((p: Product) => p.name == name);
  }
  buy(productIndex: number, count: number = 1) {
    let product = this.products[productIndex];
    if (product.tags[0] == "basement")
      product.transferTo(window.Basement.contents, count);
    else product.transferTo(window.Player.inventory, count);
    window.Player.cash -= product.price * count;
    if (product.avaliable > 0) {
      if (product.avaliable <= count) this.products.deleteAt(productIndex);
      else this.products[productIndex].avaliable -= count;
    }
  }
}
