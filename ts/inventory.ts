interface Array<T> {
  firstOrDefault<T>(predicate: Function): T;
}
//Array extension to return the first item that makes the predicate return true or null
Array.prototype.firstOrDefault = function <T>(predicate: Function) {
  return this.reduce((accumulator: T, currentValue: T) => {
    if (!accumulator && predicate(currentValue)) accumulator = currentValue;
    return accumulator;
  }, null);
};
//A product does not represent a physical item but something that can be bought and transfer a corresponding item to an inventory.
class Product {
  name: string; //Product name displayed. If itemName is not specified it will also be the item's name.
  itemName?: string; //The item's name (once purchased)
  price: number;
  description: string;
  packQuantity?: number = 1; //How many items are transferred to the inventory for each product bought
  available?: number; //How many times this product can be purchased. This value will decrease after each purchase and set soldOut to true when it reaches zero.
  soldOut?: boolean = false; //If set to true it will not appear available for purchasing.
  tags: Set<string>; //Keywords related to the product. The first keyword indicates where the item go after receiving it. It will be used to filter the products in the future.
  constructor(init?: Product) {
    Object.assign(this, init);
  }
  transferTo?(inventory: Inventory, count: number = 1) {
    inventory.add({
      name: this.itemName ? this.itemName : this.name,
      description: this.description,
      count: count * this.packQuantity,
      tags: this.tags,
    });
  }
}
//Represents a physical item.
class Item {
  name: string;
  description: string;
  count?: number = 1;
  tags: Set<string>; //Keywords related to this item. It will be used to filter the items in a inventory in the future.
  constructor(init?: Item) {
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
    else this.items.push(new Item(item));
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
  //Moves an item from this inventory to another (including all quantity of that item)
  move(itemIndex: number, destination: Inventory): void {
    destination.add(this.items[itemIndex]);
    this.items.deleteAt(itemIndex);
  }
  //Moves an item from this inventory to another (including all quantity of that item)
  moveByName(itemName: string, destination: Inventory): void {
    let item = this.get(itemName);
    if (item === null) return;
    destination.add(item);
    this.items.delete(item);
  }
  //Remove all items in this inventory
  clear(): void {
    this.items = [];
  }
  constructor(init?: Partial<Inventory>) {
    Object.assign(this, init);
  }
}
//The only store available right now, if more are created maybe a parent abstract class should be created.
class OnlineStore {
  //Updating this class does not automatically updates the $onlineStore story variable unless a new product is added, the version number is used to know if the story variable object should be updated when loading an old save.
  version: number = 3;
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
    }),
    new Product({
      name: "Sleeping pills",
      description: "Sweet dreams are made of these.<<emoji 💤>>.",
      price: 12,
      tags: new Set(["player", "capture", "medicine"]),
      available: 20,
      soldOut: true, //Hidden product, for now
    }),
    new Product({
      name: "Lactation pills",
      description: "Got milk? Induces lactation (breasts reqiured)<<emoji 🥛>>.",
      price: 30,
      tags: new Set(["player", "consumable", "medicine"]),
    }),
    new Product({
      name: "Dildo",
      description: "Stimulating toy to play until complete satisfaction.",
      price: 20,
      tags: new Set(["player", "sex", "toy"]),
      available: 1,
    }),
    new Product({
      name: "Condom",
      description:
        "The condom or condom is a thin and flexible case, impermeable to blood",
      price: 8,
      tags: new Set(["player", "sex", "toy"]),
    }),
    new Product({
      name: "Magic sunglasses",
      description:
        "These hi-tec sunglasses detect subtle variations on people behavior and allows you to see more details about them.",
      price: 500,
      available: 1,
      tags: new Set(["player", "wearable", "eyes", "tech", "cheat"]),
    }),
    new Product({
      name: "Cooking apron",
      description:
        "Cute apron to give to a slave that you assigned as a cook. They will surely use it when cooking to protect their cute body, even if no other clothes are present<<emoji 👀>>",
      price: 20,
      available: 1,
      tags: new Set(["player", "wearable", "cooking", "clothes"]),
    }),
  ];
  bought: Inventory = new Inventory(); //Bought products are transferred to this inventory until delivered (where they are transferred to their destination)
  //Get a product from the store
  get(name: string): Product {
    let store: OnlineStore = Variables().onlineStore as OnlineStore;
    if (!store) store = this;
    return store.products.firstOrDefault(
      (p: Product) => p.name.toLowerCase() == name.toLowerCase()
    );
  }
  //Check if a product on the store can be bought with the current available player's money.
  canBuy(productIndex: number, count: number = 1): boolean {
    let variables = Variables();
    let player = variables.player as Player;
    let store = variables.onlineStore as OnlineStore;
    let product = store.products[productIndex];
    return player.cash >= product.price * count;
  }
  //Performs a purchase on a product
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
  //Gets the product or item final destination
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
  //Check if an item it's bought and has a pending delivery
  isBought(itemName: string): boolean {
    return new Inventory(Variables().onlineStore.bought).has(itemName);
  }
  //Transfer all bought products to the respective destinations.
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
  //Checks if there are items pending delivery
  pendingOrder(): boolean {
    let store = Variables().onlineStore as OnlineStore;
    return store.bought.items.length > 0;
  }
  //Builds a price string to be displayed
  priceText(product: Product): string {
    return "¤" + product.price;
  }
  //Builds a text to display as a product name
  productText(product: Product): string {
    let text = product.name;
    if (product.packQuantity > 1) text += " x " + product.packQuantity;
    return text + ": ";
  }
}
