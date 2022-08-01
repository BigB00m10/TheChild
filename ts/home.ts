let Homes: Record<string, Home> = {
  smallUrban: {
    name: "small urban house",
    rent: 400,
    spaces: ["basement", "mainRoom", "bed"],
  },
};
interface NpcEvent {
  description: string;
  canBeShown?: (npc: Npc) => boolean;
}
abstract class HomeSpace {
  contents?: Inventory;
  muffleBase: number;
  securityBase?: number;
  npcEvents?: NpcEvent[];
  static getDemandingSlavesFromLocation(location: string): Person[] {
    const slaves = Variables().slaves as Person[];
    let candidates: Person[] = [];
    for (let slaveIndex = 0; slaveIndex < slaves.length; slaveIndex++) {
      const slave = slaves[slaveIndex];
      if (slave.location != location || slave.age < 1) continue;
      if (slave.hunger >= 25) {
        slave.index = slaveIndex;
        slave.need = "hunger";
        candidates.push(slave);
      }
    }
    return candidates.sort(() => PseudoRandom.getFloat(turns()) - 0.5);
  }
  getDemandingSlaves(): Person[] {
    return null;
  }
}
class Basement implements HomeSpace {
  contents: Inventory = new Inventory();
  muffleBase: number = 90;
  securityBase: number = 25;
  constructor() {
    window.OnlineStore.get("Mattress").transferTo(this.contents);
  }
  npcEvents?: NpcEvent[];
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
  getDemandingSlaves(): Person[] {
    return HomeSpace.getDemandingSlavesFromLocation("basement");
  }
  getHungrySlaves(): Person[] {
    return Variables().slaves.filter((slave: Person) => slave.hunger > 25);
  }
}
class MainRoom implements HomeSpace {
  contents: Inventory;
  npcEvents?: NpcEvent[];
  muffleBase: number = 25;
  securityBase: number = 25;
  getDemandingSlaves(): Person[] {
    return HomeSpace.getDemandingSlavesFromLocation("mainRoom");
  }
}
class BedRoom implements HomeSpace {
  contents: Inventory;
  securityBase?: number;
  npcEvents?: NpcEvent[];
  muffleBase: number = 25;
  bedAssignedNpc: Uid[] = [];
  getDemandingSlaves(): Person[] {
    return HomeSpace.getDemandingSlavesFromLocation("bed");
  }
}
