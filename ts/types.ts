type Gender = "male" | "female";
type HoleViability = "virgin" | "tainted" | "tight" | "trained" | "loosened";
type timePeriod = "AM" | "PM";
interface Home {
  name: string;
  rent: number;
}
let Homes: Record<string, Home> = {
  smallUrban: { name: "small urban house", rent: 400 },
};
interface Job {
  name: string;
  pay: number;
}
let Jobs: Record<string, Job> = {
  garbageCollector: { name: "garbage collector", pay: 800 },
};
interface Npc {
  name: string;
  age: number;
  gender: Gender;
  pussy: HoleViability;
  anus: HoleViability;
  mouth: HoleViability;
  children: Array<Npc>;
  mom: Npc;
  dad: Npc;
}
interface Product {
  name: string;
  price: number;
  description: string;
}
class Now {
  day: number = 1;
  hour: number = 7;
  minute: number = 0;
  period: timePeriod = "AM";
  is(timeString: string) {
    let numberComponents = timeString.split(":");
    let now = (SugarCube.State.variables as any).now;
    return (
      now.period == "AM" &&
      parseInt(numberComponents[0]) == now.hour &&
      parseInt(numberComponents[1]) == now.minute
    );
  }
}
class Player {
  name: string = "David";
  gender: Gender = "male";
  cash: number = 100;
  house: Home = Homes.smallUrban;
  job: Job = Jobs.garbageCollector;
  sleeping: boolean = true;
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
