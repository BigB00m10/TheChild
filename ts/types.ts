type Gender = "male" | "female";
type HoleViability = "virgin" | "tainted" | "tight" | "trained" | "loosened";
interface Home {
  name: string;
  rent: number;
}
let Homes: Record<string, Home> = {
  smallUrban: { name: "small urban house", rent: 400 },
};
interface Npc {
  name: string;
  age: number;
  gender: Gender;
  pussy: HoleViability;
  anus: HoleViability;
  mouth: HoleViability;
  children: Array<Npc>;
  mom: Npc | Player;
  dad: Npc | Player;
}
class Product {
  name: string;
  price: number;
  description: string;
  packQuantity: number = 1;
}
class Player {
  name: string = "David";
  gender: Gender = "male";
  cash: number = 100;
  house: Home = Homes.smallUrban;
  job: Job = Jobs.garbageCollector;
  sleeping: boolean = true;
  workedToday: boolean = false;
}
interface Window {
  Now: Now;
  Homes: Record<string, Home>;
  Jobs: Record<string, Job>;
  Player: Player;
}
window.Now = new Now();
window.Homes = Homes;
window.Jobs = Jobs;
window.Player = new Player();
