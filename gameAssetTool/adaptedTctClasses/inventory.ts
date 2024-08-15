interface Array<T> {
  /*
   *Array extension to return the first item that makes the predicate return true or null
   */
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
  use?: (characterUid?: Uid) => any; //Action executed when this item is used from an inventory (not through an interaction) by the player or another character indicated by the Uid
  removed?: (characterUid?: Uid) => void; //Event to fire when the item is removed through an interaction or the player pressing the inventory button.
  remove?: (characterUid?: Uid) => void; //Action executed when the remove button is pressed from a list of worn items (not through an interaction) by the player or another character indicated by the Uid
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
  extra?: any; //Extra item data
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
  //Returns the number of items left
  remove(item: Item, count: number = 1): number {
    if (!item) return;
    if (!count || count >= item.count) {
      this.items.delete(item);
      return 0;
    } else return (item.count -= count);
  }
  //Get the item with the specified name or starting with the specified word ignoring case.
  get(name: string): Item {
    name = name.toLowerCase();
    let found: Item = this.items.firstOrDefault(
      (i: Item) => i.name.toLowerCase() == name
    );
    if (!found)
      found = this.items.firstOrDefault((i: Item) =>
        i.name.toLowerCase().split(" ").includesAll(name.split(" "))
      );
    return found;
  }
  //Same as the remove action but selecting the item by name or starting with the specified word ignoring case.
  removeByName(name: string, count: number = 1): number {
    return this.remove(this.get(name), count);
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
  addNpc(npc: Npc, ...extraTags: string[]): void {
    let item = new Item({
      name: `NPC id ${npc.uid}`,
      description: "NPC",
      tags: new Set(["npc"]),
      extra: npc.uid,
    });
    for (let tag of extraTags) item.tags.add(tag);
    this.add(item);
    npc.location = "unknown";
  }
  //Get the items in this inventory that have the provided description case-insensitive or null
  withDescription(description: string): Item[] {
    description = description.toLowerCase();
    return this.items.filter(
      (item: Item) => item.description.toLowerCase() == description
    );
  }
  //Get the items in this inventory that do NOT have the provided description case-insensitive or null
  withoutDescription(description: string): Item[] {
    description = description.toLowerCase();
    return this.items.filter(
      (item: Item) => item.description.toLowerCase() != description
    );
  }
  //Gets the indicated NPC if present in this inventory or null
  getNpc(npc: Npc): Item {
    const uid = typeof npc == "number" ? npc : npc.uid;
    return this.withDescription("npc").firstOrDefault(
      (item: Item) => item.extra == uid
    );
  }
  //Checks if this inventory contains the indicated NPC
  hasNpc(npc: Npc): boolean {
    return this.getNpc(npc) != null;
  }
  //Remove the indicated NPC from this inventory if present
  removeNpc(npc: Npc): void {
    this.items.delete(this.getNpc(npc));
  }
}
