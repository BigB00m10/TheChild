let Homes: Record<string, Home> = {
  smallUrban: {
    name: "small urban house",
    rent: 400, //Unused right now, will be the amount to pay each month
    spaces: [
      "basement",
      "tortRafters",
      "mainRoom",
      "bed",
      "bathroom",
      "wc",
      "garden",
      "kitchen",
    ], //The spaces are where the wandering slaves will move into excluding the basement and everything starting with "tort"
  },
};
//Planned to be events involving NPC that can happen when the player enters the same scenery (found slave sleeping, playing with the computer, taking a piss, etc...)
//In the eyes of the player it should appear in the same way as the demands.
interface NpcEvent {
  description: string;
  canBeShown?: (npc: Npc) => boolean;
}
abstract class HomeSpace {
  contents: Inventory = new Inventory();
  //The higher the muffle the lower the chance of neighbors/passerby hearing loud noises from this room (planned)
  //This indicates the base value, items could be bought to increase this value.
  muffleBase: number = 25;
  //How secure is this space (The higher is, the harder is for slaves to escape this space, or the house if it has an exit)
  securityBase: number = 25;
  npcEvents: NpcEvent[] = [];
  //The main passage associated with this room
  abstract passageName: string;
  getContents(variables?: any): Inventory {
    if (!variables) variables = Variables();
    return (variables[this.passageName].contents = new Inventory(
      variables[this.passageName].contents
    ));
  }
  has(itemName: string, count: number = 1): boolean {
    return this.getContents().has(itemName, count);
  }
  getEventSlaves(): Person[] {
    const variables = Variables();
    const slaves = <Person[]>(
      window.Person.all((npc) => npc.status != "citizen")
    );
    let candidates: Person[] = [];
    for (let slaveIndex = 0; slaveIndex < slaves.length; slaveIndex++) {
      const slave = slaves[slaveIndex];
      if (slave.location != this.passageName || slave.age < 1) continue;
      if (
        this.passageName == "kitchen" &&
        variables.settings.cook &&
        slave.uid == variables.settings.cook.npc
      ) {
        slave.eventType = "ordinary";
        slave.event = "cook";
        candidates.push(slave);
        continue;
      }
      if (slave.hunger >= 25) {
        slave.eventType = "demand";
        slave.event = "hunger";
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
          slave.eventType = "demand";
          slave.event = "sleepWithPlayer";
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
  availableBeds(): number {
    let variables = Variables();
    var contents = this.getContents(variables);
    var oldItem = contents.get("Matress");
    if (oldItem) oldItem.name = "Mattress";
    return (
      contents.get("Mattress").count -
      window.Person.all((p) => p.status != "citizen").length
    );
  } //TODO: do not count slaves in player's bed
  getHungrySlaves(): Person[] {
    return <Person[]>(
      window.Person.all(
        (npc: Npc) =>
          npc.status == "slave" && npc.location == "basement" && npc.hunger > 25
      )
    );
  }
  getSlaves(): Person[] {
    return <Person[]>(
      window.Person.all(
        (npc: Npc) => npc.status == "slave" && npc.location == "basement"
      )
    );
  }
  deleteSlave(slave: Person) {
    let slaves: Person[] = Variables().slaves;
    let index = slaves.indexOf(slave);
    if (index != -1) slaves.splice(index, 1);
  }
}
class TortRafters extends HomeSpace {
  muffleBase: number = 90;
  passageName: string = "tortRafters";
  getSlaves(): Person[] {
    return <Person[]>(
      window.Person.all(
        (npc: Npc) => npc.status == "slave" && npc.location == "tortRafters"
      )
    );
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
//class TortureRoom extends HomeSpace {
//  muffleBase: number = 90;
//  passageName: string = "tort";
//  cages: [];
//}
