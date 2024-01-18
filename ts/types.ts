//Biological characteristics
type Sex = "male" | "female" | "herm";
//Social characteristics
type Gender = "boy" | "girl" | "nb";
type Genitals = "cunny" | "pussy" | "penis" | "dick";
type AllGenitals = {
  male: Genitals;
  female: Genitals;
  all: string;
};
interface Home {
  name: string;
  rent: number;
  //Spaces that this house have using the names of the main passages on that space
  spaces: string[];
  family?: Npc[];
}
//Returns the SugarCube variables object in Typescript format (variables saved in history).
function Variables(): any {
  return variables() as any;
}
//Returns the SugarCube temporary object in Typescript format (variables saved in memory that will vanish on the next passage).
function Temporary(): any {
  return temporary() as any;
}
function Wiki(
  markup: string,
  output: HTMLElement | DocumentFragment
): JQuery<HTMLSpanElement> {
  return $(document.createElement("span")).wiki(markup).appendTo(output);
}
/* Snippet to hook an event to an object. Might be useful someday.
interface ILiteEvent<T> {
  on(handler: { (data?: T): void }): void;
  off(handler: { (data?: T): void }): void;
}
class LiteEvent<T> implements ILiteEvent<T> {
  private handlers: { (data?: T): void }[] = [];

  public on(handler: { (data?: T): void }): void {
    this.handlers.push(handler);
  }

  public off(handler: { (data?: T): void }): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  public trigger(data?: T) {
    this.handlers.slice(0).forEach((h) => h(data));
  }
}*/
interface String {
  /**
   * Split camelcase words and upper the first letter.
   */
  beautifyStat(): string;
}
//Split camelcase words and upper the first letter.
String.prototype.beautifyStat = function () {
  return this.toUpperFirst().replace(/(\B[A-Z])/g, " $1");
};
interface Array<T> {
  getSentence(): string;
}
//Constructs a sentence from an array of strings ["1","2","3"] becomes "1, 2 and 3"
Array.prototype.getSentence = function () {
  if (!this.length) return "";
  if (this.length == 1) return this[0];
  let clone = this.slice();
  let last = clone.pop();
  return clone.join(", ") + " and " + last;
};
//Useful class to make a less random generator than the one in Math or in Sugarcube.
//Two identical results appearing together is way les likely with this class if a correlative seed is provided.
class PseudoRandom {
  //Generates a seed from other objects. Player/npc stats, traits and name can be used, recommended to include something incremental like turns() or the current time.
  static getSeed(...components: any[]): number {
    let seed = 0;
    for (const index in components) {
      const component = components[index];
      switch (typeof component) {
        case "boolean":
        case "number":
          seed += component as number;
          break;
        case "string":
          for (let charIndex = 0; charIndex < component.length; charIndex++)
            seed = (seed << 5) - seed + component.charCodeAt(charIndex);
          break;
        case "object":
          if (component.getTime) seed += component.getTime() / 60000;
          break;
      }
    }
    return Math.abs(seed);
  }
  //Get a pseudorandom integer using the provided seed
  static getInt(seed: number): number {
    //27 is a coprime of 100 and 10-1 is divisible by 27's factors (3)
    return (27 * seed + 10) % 100;
  }
  //Get a pseudorandom floating comma number using the provided seed
  static getFloat(seed: number): number {
    return this.getInt(seed) / 100;
  }
  //Get a random integer number from a range of integer numbers using the provided seed
  static getFromRange(seed: number, start: number, end: number): number {
    return start + Math.floor(this.getFloat(seed) * (end - start));
  }
  //Get a random item from the provided array using the provided seed.
  static either<T>(seed: number, options: Array<T>): T {
    return options[this.getFromRange(seed, 0, options.length)];
  }
}
type Uid = number;
//Gets a unique identification number to identify objects, items, individuals or even places that can be generated.
//Since all other properties of an object has the possibility to be changed (even name) this can be used to save in an npc the Uid of their mother for instance.
//The zero Uid is reserved to identify the player.
function getUid(variables?: any): Uid {
  if (!variables) variables = Variables();
  variables.lastUid = variables.lastUid ? variables.lastUid + 1 : 1;
  return variables.lastUid;
}
Macro.add("unlessEmergency", {
  tags: [],
  handler() {
    const variables = Variables();
    if (variables.player.energy < 1)
      return Wiki(
        "@@color:red;You REALLY need to sleep@@<br><<keyAction 'Go to sleep' 😴>><<sleep>><</keyAction>>",
        this.output
      );
    if (
      variables.player.job &&
      !window.Now.isWeekend(variables.now.date) &&
      !variables.player.workedToday &&
      window.Now.isEqualOrLaterThan(
        variables.player.job.enterTime,
        variables.now.date
      )
    )
      return Wiki(
        "@@color:red;You need to go to work@@<br><<workOption>>",
        this.output
      );
    if (
      variables.onlineStore.purchaseTime &&
      window.Player.isHome(variables) &&
      window.Now.isEqualOrLaterThan("7:00 AM")
    ) {
      const yesterday = new Date(variables.now.date);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59);
      if (variables.onlineStore.purchaseTime.getTime() < yesterday.getTime())
        return Wiki(
          "<br>Someone is knocking at the front door!!<br>Who might that be?<br><br><<keyOption [[Go check|receivePacket]] 🚪>>",
          this.output
        );
    }
    const pregnancyDays = variables.settings.pregnancyDays
      ? variables.settings.pregnancyDays
      : 9 * 30;
    let baby: Npc;
    let laborNpc = window.Person.firstOrNull(
      (npc: Npc) => npc.pregnantDays && npc.pregnantDays > pregnancyDays
    );
    if (laborNpc) {
      //Right now all NPCs are persons so it's assumed the NPC is a person.
      baby = window.Person.giveBirth(<Person>laborNpc, variables);
    } else if (
      variables.player.pregnantDays &&
      variables.player.pregnantDays >= pregnancyDays
    ) {
      baby = window.Player.giveBirth(variables);
    }
    if (baby) window.Person.showBirthMessage(baby, laborNpc);
    Wiki(this.payload[0].contents, this.output);
  },
});
interface CookSettingsCase {
  npc: Uid;
  feedEnabled: boolean;
  feedAtHunger: number;
}
interface CookSettings extends CookSettingsCase {
  feedTimes: string[];
  lastFeedings: number[];
  exceptions: CookSettingsCase[];
}
