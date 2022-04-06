type Gender = "male" | "female";
interface Home {
  name: string;
  rent: number;
}
let Homes: Record<string, Home> = {
  smallUrban: { name: "small urban house", rent: 400 },
};
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
  Person: Person;
}
window.Now = new Now();
window.Homes = Homes;
window.Jobs = Jobs;
window.Player = new Player();
window.Person = new Person();
