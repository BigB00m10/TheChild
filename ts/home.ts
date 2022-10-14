let Homes: Record<string, Home> = {
  smallUrban: {
    name: "small urban house",
    rent: 400,
    spaces: [
      "basement",
      "mainRoom",
      "bed",
      "bathroom",
      "wc",
      "garden",
      "kitchen",
      "tort",
      "tortone",
      "tortwo",
      "torthree",
    ],
  },
};
interface NpcEvent {
  description: string;
  canBeShown?: (npc: Npc) => boolean;
}
abstract class HomeSpace {
  contents: Inventory = new Inventory();
  muffleBase: number = 25;
  securityBase: number = 25;
  npcEvents: NpcEvent[] = [];
  abstract passageName: string;
  getDemandingSlaves(): Person[] {
    const slaves = Variables().slaves as Person[];
    let candidates: Person[] = [];
    for (let slaveIndex = 0; slaveIndex < slaves.length; slaveIndex++) {
      const slave = slaves[slaveIndex];
      if (slave.location != this.passageName || slave.age < 1) continue;
      if (slave.hunger >= 25) {
        slave.need = "hunger";
        candidates.push(slave);
        continue;
      }
      if (
        slave.status != "slave" && //The status slave means locked in the basement
        slave.age > 1 &&
        slave.love > 49 &&
        !slaves.firstOrDefault((slave: Person) =>
          window.Person.hasAchievement("okSleepWithPlayer", slave)
        )
      ) {
        var seed = PseudoRandom.getSeed(slave.name, slave.age, turns());
        if (PseudoRandom.either(seed, [true, false])) {
          slave.need = "sleepWithPlayer";
          candidates.push(slave);
          continue;
        }
      }
    }
    return candidates.sort(() => PseudoRandom.getFloat(turns()) - 0.5);
  }
}
class Basement extends HomeSpace {
  muffleBase: number = 90;
  passageName: string = "basement";
  constructor() {
    super();
    window.OnlineStore.get("Mattress").transferTo(this.contents);
  }
  has(itemName: string, count: number = 1): boolean {
    return new Inventory(Variables().basement.contents).has(itemName, count);
  }
  availableBeds(): number {
    let variables = Variables();
    var contents = new Inventory(variables.basement.contents);
    var oldItem = contents.get("Matress");
    if (oldItem) oldItem.name = "Mattress";
    return contents.get("Mattress").count - variables.slaves.length;
  } //TODO: do not count slaves in player's bed
  getHungrySlaves(): Person[] {
    return Variables().slaves.filter((slave: Person) => slave.hunger > 25);
  }
  deleteSlave(slave: Person) {
    let slaves: Person[] = Variables().slaves;
    let index = slaves.indexOf(slave);
    if (index != -1) slaves.splice(index, 1);
  }
}
class MainRoom extends HomeSpace {
  passageName: string = "mainRoom";
}
class BedRoom extends HomeSpace {
  bedAssignedNpc: Uid[] = [];
  passageName: string = "bed";
}
class Bathroom extends HomeSpace {
  passageName: string = "bathroom";
}
class Wc extends HomeSpace {
  passageName: string = "wc";
}
class Kitchen extends HomeSpace {
  passageName: string = "kitchen";
}
class Garden extends HomeSpace {
  muffleBase: number = 0;
  passageName: string = "garden";
}
class TortureRoom extends HomeSpace {
  muffleBase: number = 90;
  passageName: string = "tort";
  cages: [];
}
