type Gender = "male" | "female";
interface Home {
  name: string;
  rent: number;
}
let Homes: Record<string, Home> = {
  smallUrban: { name: "small urban house", rent: 400 },
};
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
    window.OnlineStore.get("Matress").transferTo(this.contents);
  }
}
