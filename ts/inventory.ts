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
  use?: (characterUid?: Uid) => void; //Action executed when this item is used from an inventory (not through an interaction) by the player or another character indicated by the Uid
  constructor(init?: Product) {
    Object.assign(this, init);
  }
  //Create an item from this product and add it to the provided inventory. The product availability is not altered by this method.
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
  //Adds the specified item to the inventory optionally overriding the quantity of the number of items to be added
  add(item: Item, quantity: number = 0): void {
    const existing: Item = this.items.firstOrDefault(
      (i: Item) => i.name == item.name
    );
    if (existing)
      existing.count = (existing.count || 1) + (quantity || item.count || 1);
    // Add to existing item, taking into account that not all items have a count
    else {
      const destItem = new Item(item);
      if (quantity) destItem.count = quantity;
      this.items.push(destItem);
    }
  }
  //Removes one item from the inventory, the count indicated, or all of them if the specified count is zero.
  remove(item: Item, count: number = 1): void {
    if (!item) return;
    if (!count || count >= item.count) this.items.delete(item);
    else item.count -= count;
  }
  //Get the item with the specified name or starting with the specified word ignoring case.
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
  //Same as the remove action but selecting the item by name or starting with the specified word ignoring case.
  removeByName(name: string, count: number = 1): void {
    this.remove(this.get(name), count);
  }
  //Check if the inventory contains at least the specified count of items selected by name or, if count not specified, at least one.
  has(itemName: string, count: number = 0): boolean {
    let item: Item = this.get(itemName);
    if (item === null) return false;
    if (!count) return true;
    return item.count >= count;
  }
  //Check if the inventory has at least one item of all of the specified by name.
  hasAll(itemNames: string[]): boolean {
    return itemNames.countWith((n) => this.has(n)) == itemNames.length;
  }
  //Moves an item from this inventory to another (including all quantity of that item)
  move(item: Item, destination: Inventory): void;
  move(itemIndex: number, destination: Inventory): void;
  move(itemOrIndex: number | Item, destination: Inventory): void {
    const item =
      typeof itemOrIndex == "number" ? this.items[itemOrIndex] : itemOrIndex;
    destination.add(item);
    this.items.delete(item);
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
  version: number = 4;
  products: Product[] = [
    new Product({
      name: "Chloroform",
      itemName: "chloroform doses",
      description:
        "Helps getting a good sleep, and in your life in general. Can be used on others.",
      price: 33,
      tags: new Set(["player", "consumable", "capture"]),
      packQuantity: 10,
    }), //Chloroform
    new Product({
      name: "Mattress",
      description:
        "Adds an additional bed to your basement so another slave can move in.",
      price: 70,
      tags: new Set(["basement", "home", "furniture"]),
    }), //Mattress
    new Product({
      name: "Lube",
      description:
        "Slippery lotion. Can be used for easier screwing, among other things<<emoji 😏>>",
      price: 15,
      tags: new Set(["player", "sex", "unsellable"]),
      available: 1,
    }), //Lube
    new Product({
      name: "Candy",
      description: "Most people like these. Kids, especially<<emoji 🤭>>.",
      price: 5,
      tags: new Set(["player", "lure", "bribery", "capture", "food"]),
    }), //Candy
    new Product({
      name: "Sleeping pills",
      description: "Sweet dreams are made of these.<<emoji 💤>>.",
      price: 12,
      tags: new Set(["player", "capture", "medicine"]),
      available: 20,
      soldOut: true, //Hidden product, for now
    }), //Sleeping pills
    new Product({
      name: "Lactation pills",
      description:
        "Got milk? Induces lactation (breasts required)<<emoji 🥛>>.",
      price: 30,
      tags: new Set(["player", "consumable", "medicine"]),
    }), //Lactation pills
    new Product({
      name: "Dildo",
      description: "Stimulating toy to play until complete satisfaction.",
      price: 20,
      tags: new Set(["player", "sex", "toy"]),
      available: 1,
    }), //Dildo
    new Product({
      name: "Condom",
      description:
        "High quality male condom that adapts to any penis size and avoids pregnancy. Players with penis can use it by using it through the inventory before penetration. Also, the option to put it on others, having an erected penis, appear during sex interactions.",
      price: 8,
      tags: new Set(["player", "sex", "consumable", "fertility"]),
      use(characterUid) {
        if (characterUid) return; //Can only be used by the player right now.
        const variables = Variables();
        const inventory = window.Player.getInventory(variables);
        const item = inventory.get(this.name);
        if (!variables.player.hasPenis) {
          if (
            passage() == "npcInteraction" &&
            variables.npc.hasPenis &&
            variables.npc.aroused &&
            !window.Person.hasAchievement("activeContraception")
          ) {
            window.Person.setAchievement("activeContraception");
            inventory.remove(item, 1);
            return $.wiki(
              "<<dialog 'Succeed'>>You peel out one condom and slowly wrap $npc.name's $npc.genitals.male with it.<</dialog>>"
            );
          }
          return $.wiki(
            "<<dialog 'Non applicable'>>There's no erected naked penis near you to put on the condom right now.<</dialog>>"
          );
        }
        if (window.Player.hasAchievement("activeContraception"))
          return $.wiki(
            "<<dialog 'Non applicable'>>You are already wearing a condom!<</dialog>>"
          );
        window.Player.setAchievement("activeContraception");
        inventory.remove(item);
        window.Player.getWearingInventory(variables).add(item, 1);
        $.wiki(
          "<<dialog 'Succeed'>>You peel out one condom and wrap your cock in it.<br>It will stay until you cum or you take it out from the inventory window. But it cannot be reused.<</dialog>>"
        );
      },
    }), //Condom
    new Product({
      name: "Magic sunglasses",
      description:
        "These hi-tec sunglasses detect subtle variations on people behavior and allows you to see more details about them.",
      price: 500,
      available: 1,
      tags: new Set([
        "player",
        "wearable",
        "eyes",
        "tech",
        "cheat",
        "unsellable",
      ]),
    }), //Magic sunglasses
    new Product({
      name: "Cooking apron",
      description:
        "Cute apron to give to a slave that you assigned as a cook. They will surely use it when cooking to protect their cute body, even if no other clothes are present<<emoji 👀>>",
      price: 20,
      available: 1,
      tags: new Set(["player", "wearable", "cooking", "clothes", "unsellable"]),
    }), //Cooking apron
    new Product({
      name: "Rope",
      description: "A strong sturdy rope",
      price: 20,
      tags: new Set(["player", "sex", "toy"]),
    }), //Rope
    new Product({
      name: "The Art of Shibari",
      description: "Learn the art of tying and suspending submissives",
      price: 50,
      available: 1,
      tags: new Set(["player", "book", "skill", "unsellable"]),
    }), //The Art of Shibari
    new Product({
      name: "Aging stop pill",
      description: "Miraculous pill that freezes the age of any NPC forever",
      price: 100,
      tags: new Set(["player", "consumable", "medicine"]),
    }), //Aging stop pill
    new Product({
      name: "Female fertility pill",
      description: `Advanced tech pill that permanently increases the chance of getting pregnant by 20%
      This pill will work on any living character, including yourself.`,
      price: 30,
      tags: new Set(["player", "consumable", "medicine", "fertility"]),
    }), //Female fertility pill
    new Product({
      name: "Male fertility pill",
      description: `Advanced tech pill that gives the ability to produce sperm permanently.
      This pill will work on any living character with male genitals.`,
      price: 30,
      tags: new Set(["player", "consumable", "medicine", "fertility"]),
    }), //Male fertility pill
  ];
  bought: Inventory = new Inventory(); //Bought products are transferred to this inventory until delivered (where they are transferred to their destination)
  //Get a product from the store, optionally provide the sugarcube variables object to save computing power.
  get(name: string, variables?: any): Product {
    if (!variables) variables = Variables();
    let store: OnlineStore = variables.onlineStore as OnlineStore;
    if (!store) store = this;
    const index = store.products.findIndex(
      (p: Product) => p.name.toLowerCase() == name.toLowerCase()
    );
    if (index == -1) return null;
    return (store.products[index] = new Product(store.products[index]));
  }
  getInventoryLine(item: Item, characterUid: Uid = 0): string {
    const index = this.products.findIndex(
      (p: Product) =>
        (p.itemName ? p.itemName : p.name).toLowerCase() ==
        item.name.toLowerCase()
    );
    let result = (item.count ? item.count + " " : "") + item.name;
    if (index == -1 || !this.products[index].use) return result;
    return (
      result +
      ` <<button "use">><<run OnlineStore.products[${index}].use(${characterUid})>><</button>>`
    );
  }
  //Check if a product on the store can be bought with the current available player's money.
  canBuy(name: string, count: number = 1): boolean {
    let variables = Variables();
    return variables.player.cash >= this.get(name, variables).price * count;
  }
  //Performs a purchase on a product
  buy(name: string, count: number = 1): boolean {
    let variables = Variables();
    let player = variables.player as Player;
    let store = variables.onlineStore as OnlineStore;
    let product = this.get(name, variables);
    let total = product.price * count;
    if (total > player.cash) return false;
    store.bought = new Inventory(store.bought);
    product.transferTo(store.bought, count);
    player.cash = Math.round((player.cash - total) * 100) / 100;
    if (product.available > 0) {
      if (product.available <= count) product.soldOut = true;
      else product.available -= count;
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
