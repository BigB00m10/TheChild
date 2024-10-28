type NpcStatus =
  | "citizen"
  | "slave"
  | "home slave"
  | "accomplice"
  | "pet"
  | "servant"
  | "lover";
type NpcEventType = "demand" | "ordinary";
type TitSize = "flat" | "budding" | "small" | "modest" | "large";
let titSizes: TitSize[] = ["flat", "budding", "small", "modest", "large"];
interface NpcValue {
  obedience: number;
  obedienceRatio: string;
  lust: number;
  lustRatio: string;
  pussy: number;
  pussyRatio: string;
  anus: number;
  anusRatio: string;
  mouth: number;
  mouthRatio: string;
  freedomWish?: number;
  virginType?: string;
  virginBonus?: number;
  total?: number;
}
abstract class LivingCharacter {
  name: string;
  sex: Sex;
  gender: Gender;
  uid: Uid;
  hasPussy: boolean;
  hasPenis: boolean;
  /**
   * Set to true when the player goes to sleep so the bed passage knows that the player just woke up and to know if energy should be reduced or restored.
   * On NPCs it's used to indicate that their eyes in the character image should stay closed.
   */
  sleeping: boolean;
  /**
   * Warning! On NPCs it needs to be updated using hasTits(). Which is done automatically when starting an interaction.
   */
  hasBoobs?: boolean;
  titSize: TitSize;
  /**
   * To save the previous breast size while on pregnancy growth.
   */
  previousTitSize?: TitSize;
  lactating: boolean;
  /**
   * Number of days passed while being pregnant or undefined if not pregnant.
   */
  pregnantDays?: number;
  /**
   * UID of the character which this character is pregnant from.
   */
  impregnator?: Uid;
  /**
   * Percentage chance of this character getting impregnated when receiving sperm internally.
   */
  impregnationChance: number;
  /**
   * Description of this character genitals
   */
  genitals: AllGenitals;
  inventory: Inventory;
  /**
   * Things that the character has equipped or is wearing.
   */
  equippedItems: Inventory;
  /**
   * General static function for common operations when giving birth with any character
   * @param mom The mom character
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   * @returns The born baby
   */
  static giveBirth(mom: LivingCharacter, variables?: any): Npc {
    if (!variables) variables = Variables();
    //Get child generation settings
    const gen = new PersonGeneration().load(variables.settings.childGeneration);
    gen.females.fromAge =
      gen.females.toAge =
      gen.males.fromAge =
      gen.males.toAge =
      gen.herms.fromAge =
      gen.herms.toAge =
        0;
    gen.hairColors = PersonGeneration.naturalHairColors;
    gen.hairStyles = PersonGeneration.naturalHairStyles;
    const baby = window.Person.generate(gen, false); //Generate a new NPC with these settings
    baby.dad = mom.impregnator;
    baby.mom = mom.uid;
    baby.uniqueness.name = "inherited";
    baby.uniqueness.appearingChance =
      baby.uniqueness.homeOtherNpc =
      baby.uniqueness.homePersons =
      baby.uniqueness.ageRange =
      baby.uniqueness.apply =
      mom.pregnantDays =
      mom.impregnator =
        undefined; //Stop pregnancy
    mom.lactating = true;
    baby.fear = 0;
    const player = <Player>variables.player;
    if (!player.home.family) player.home.family = [];
    player.home.family.push(baby);
    return baby;
  }
  /**
   * Get the pregnancy month based on the number of days pregnant and the settings
   * @param character The target character
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   * @returns The month number
   */
  static getPregnancyMonth(
    character: LivingCharacter,
    variables?: any
  ): number {
    if (!character.pregnantDays) return 0;
    if (!variables) variables = Variables();
    const pregnancyDays = variables.settings.pregnancyDays;
    return Math.ceil(
      character.pregnantDays /
        (pregnancyDays != undefined ? pregnancyDays / 9 : 30)
    );
  }
  /**
   * Obtain character (NPC or Player) and variables from available data.
   * @param character If it's a number, returns the Character with that UID. If it's null it returns currently selected NPC
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   * @returns A tuple with the fetched character and the SugarCube Variables
   */
  static obtain(
    character: LivingCharacter,
    variables?: any
  ): [LivingCharacter, any] {
    if (typeof character == "number" && character == 0) {
      if (!variables) variables = Variables();
      character = variables.player;
    }
    return Npc.obtain(<Npc>character, variables);
  }
  /**
   * Announce to the player that a baby has been born
   * @param baby The baby NPC object
   * @param laborNpc The NPC giving birth if any (do not specify if it's the player)
   */
  showBirthMessage(baby: Npc, laborNpc?: Npc): void {
    Temporary().baby = baby;
    const playerCarryBabySentence = `You're currently carrying the baby, ''@@color:yellow;go to the inventory to interact with ${
      (<Person>baby).pronoun
    }@@''`;
    const dad = window.Person.get(baby.dad);
    let ownSentence: string;
    if (laborNpc) ownSentence = laborNpc.name + "'s";
    else if (!dad || !baby.dad)
      ownSentence = "Your"; //!baby.dad == The dad is the player
    else ownSentence = "Yours";
    if (dad) ownSentence += " and " + dad.name;
    else if (!baby.dad) ownSentence += " and yours";
    $.wiki(`<<dialog 'baby was born'>>${ownSentence} baby ${
      (<Person>baby).title
    }<<emoji 👶>>have just been born at your home!!<<emoji ❤>><br>
    The baby is a ${window.Person.getLongDescription(<Person>baby)}.<br>
      ${
        laborNpc
          ? laborNpc.age < 2
            ? playerCarryBabySentence
            : `${laborNpc.name}  is currently carrying the baby, approach ${
                (<Person>laborNpc).pronoun
              } to interact with the baby`
          : playerCarryBabySentence
      }.<br>
      How do you want to name ${(<Person>baby).pronoun}?
      <label>Newborn name:<input type=text id=babyName /></label><<button OK>><<dialogclose>><</button>>
    <</dialog>>`);
    const $babyName = $("#babyName");
    $babyName
      .val(baby.name)
      .on("change", () => (Temporary().baby.name = <string>$babyName.val()));
  }
  /**
   * Set, update or remove the timed event that makes this NPC stop lactating
   * @param character The target character (if not specified the active NPC will be affected)
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   * @param holdsNpc Indicates if the target character is holding another NPC
   */
  lactationTimeout(
    character?: LivingCharacter,
    variables?: any,
    holdsNpc?: boolean
  ): void {
    [character, variables] = Npc.obtain(<Npc>character, variables);
    if (typeof character == "number")
      character = character
        ? window.Person.get(character, variables)
        : variables.player;
    if (!character.lactating) return;
    if (holdsNpc == undefined)
      holdsNpc = <boolean>(
        (<unknown>(
          (character.uid
            ? window.Person.getEquippedInventory(<Npc>character, variables)
            : window.Player.getEquippedInventory(variables)
          ).withDescription("npc").length
        ))
      );
    if (holdsNpc) window.Now.removeTimedEvent("stopLactation" + character.uid);
    else {
      if (character.uid)
        window.Now.addTimedEvent(
          24 * 5,
          `var lc=window.Person.get(${character.uid});lc.lactating=false;if(npc.previousTitSize){npc.titSize=npc.previousTitSize;delete npc.previousTitSize}`,
          "stopLactation" + character.uid
        );
      else
        window.Now.addTimedEvent(
          24 * 5,
          "Variables().player.lactating=false",
          "stopLactation0"
        );
    }
  }
  /**
   * Impregnates a character
   * @param target The character to impregnate
   * @param impregnatorUid The UID of the one that impregnated
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   */
  impregnate(target?: LivingCharacter, impregnatorUid?: Uid, variables?: any) {
    target = LivingCharacter.obtain(target, variables)[0];
    target.pregnantDays = 0;
    target.impregnator = impregnatorUid;
  }
}
abstract class Npc extends LivingCharacter {
  /**
   * What was the age of the NPC when it was introduced to the game (generated).
   */
  ageIntroduced: number;
  age: number;
  /**
   * Number of days passed while having the current age.
   */
  ageProgress: number = 0;
  stopAging?: boolean;
  producesSperm: boolean;
  lubricatedAss: boolean;
  lubricatedPussy: boolean;
  pussyTraining: number = 0;
  anusTraining: number = 0;
  mouthTraining: number = 0;
  penisVirgin: boolean = true;
  vaginaVirgin: boolean = true;
  analVirgin: boolean = true;
  /**
   * Due to a personal error only slaves with previous personal experience have this at false.
   */
  mouthVirgin: boolean = true;
  assSpermAmount: number = 0;
  pussySpermAmount: number = 0;
  bodySpermAmount: number = 0;
  faceSpermAmount: number = 0;
  children: Uid[] = [];
  mom: Uid = null;
  dad: Uid = null;
  aroused: boolean = false;
  hunger: number = 0;
  fear: number = 50;
  love: number = 0;
  obedience: number = 25;
  lust: number = 0;
  freedomWish: number = 75;
  status: NpcStatus = "citizen";
  /**
   * Name of the last event assigned to this NPC
   */
  event: string;
  /**
   * Type of the last event
   */
  eventType: NpcEventType;
  /**
   * This property is not used anymore, it was to identify a slave using the index in the slave array.
   * Changes in the array caused problems easily so it was replaced with the uid property
   */
  index: undefined;
  /**
   * achievements can be used to keep track of what the npc has experienced
   */
  achievements: string[] = [];
  /**
   * for long-lasting punishments
   */
  punishments: string[] = [];
  /**
   * Where this NPC is located in the house or in the world, try to match up with the scenery name.
   */
  location: string = "unknown";
  /**
   * pose (position) that this NPC is currently holding (for the character image). If not set "idle" is assumed.
   */
  pose: string;
  /**
   * URL to the pre-rendered NPC base image, the part which has less changes (without clothes)
   */
  baseImageCache: string;
  /**
   * URL to the pre-rendered NPC image without facial expression or any layer over it.
   */
  offscreenImageCache: string;
  /**
   * pose (position) for the available cache
   */
  imageCachePose: string;
  /**
   * @param npc The target NPC. If omitted this instance will be used instead
   * @returns The number of months elapsed since the last birthday
   */
  getMonthsSinceLastBirthDay(npc?: Npc): number {
    if (!npc) npc = this;
    return (
      (12 * npc.ageProgress) / (Variables().settings.agingIgDays || 365.25)
    );
  }
  /**
   * Checks if an NPC has breasts (bigger than flat)
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   */
  hasTits(npc?: Npc, variables?: any): boolean {
    npc = Npc.obtain(npc, variables)[0];
    return titSizes.indexOf(npc.titSize) > 0;
  }
  /**
   * Increase or decrease breast size on the indicated NPC
   * @param amount Positive number to increase the size level or negative to decrease it
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   */
  alterTitSize(amount: number, npc?: Npc, variables?: any): void {
    npc = Npc.obtain(npc, variables)[0];
    if (!npc.titSize) npc.titSize = "flat";
    npc.titSize =
      titSizes[
        (titSizes.indexOf(npc.titSize) + amount).clamp(0, titSizes.length - 1)
      ];
  }
  /**
   * Makes the necessary pubertal changes to the NPC according to their age
   * @param agedUp
   * @param npc The target NPC. No need to specify it if the method is already called from an NPC
   */
  adjustPubescence(agedUp: boolean = false, npc?: Npc): void {
    if (!npc) npc = this;
    const female = npc.sex == "female" || npc.sex == "herm";
    const male = npc.sex == "male" || npc.sex == "herm";
    if (agedUp) {
      if (npc.age == 13) {
        //Pubescent for the first time
        if (female) {
          window.Person.alterTitSize(1, npc);
          npc.impregnationChance = 80;
        }
        if (male) npc.producesSperm = true;
      } else if (female && (npc.age == 14 || npc.age == 15))
        window.Person.alterTitSize([0, 1].random(), npc);
    } else {
      const fertile = npc.age > 12;
      if (npc.titSize == undefined) {
        if (fertile && female)
          npc.titSize =
            npc.age > 14 ? <TitSize>["small", "modest"].random() : "budding";
        npc.lactating = false;
      }
      if (npc.producesSperm == undefined) {
        npc.producesSperm = fertile && male;
        npc.impregnationChance = fertile && female ? 80 : 0;
      }
      return;
    }
  }
  /**
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   * @returns the normal inventory object (non-equipped items) from the target NPC
   */
  getInventory(npc?: Npc, variables?: any): Inventory {
    [npc, variables] = Npc.obtain(npc, variables);
    return (npc.inventory = new Inventory(npc.inventory));
  }
  /**
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   * @returns the NPC inventory object for the currently equipped/wearing items
   */
  getEquippedInventory(npc?: Npc, variables?: any): Inventory {
    [npc, variables] = Npc.obtain(npc, variables);
    return (npc.equippedItems = new Inventory(npc.equippedItems));
  }
  /**
   * Checks if an item is in the equipped inventory
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   * @returns a boolean indicating if the NPC has the item equipped
   */
  wearing(itemName: string, npc?: Npc, variables?: any): boolean {
    return this.getEquippedInventory(npc, variables).has(itemName);
  }
  /**
   * Checks if the NPC has any items with the indicated incompatibility (type and value)
   * @param type The type of incompatibility (like tits or pregnancyTrimester)
   * @param value The value to check
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   */
  wearingIncompatible(
    type: string,
    value: any,
    npc?: Npc,
    variables?: any
  ): boolean {
    [npc, variables] = Npc.obtain(npc, variables);
    return this.getEquippedInventory(npc, variables).items.firstOrDefault(
      (item: Item) => {
        let incompatible = item.incompatible ? item.incompatible[type] : null;
        return incompatible ? incompatible.includes(value) : false;
      }
    );
  }
  /**
   * Check if a pregnant belly should be drawn
   * @param trimester the trimester to check (from 1 to 3)
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables The SugarCube Variables object where to take the needed data from (optional)
   */
  canDrawPregnant(trimester: 1 | 2 | 3, npc?: Npc, variables?: any): boolean {
    [npc, variables] = Npc.obtain(npc, variables);
    return (
      Math.floor(LivingCharacter.getPregnancyMonth(npc, variables) / 3) ==
        trimester &&
      !window.Person.wearingIncompatible(
        "pregnantTrimester",
        trimester,
        npc,
        variables
      )
    );
  }
  /**
   * Achievements are used for keeping track of things done or things in effect.
   * @param npc The target NPC. If not specified, the active NPC will be selected
   */
  hasAchievement(achievement: string, npc?: Npc): boolean {
    if (!npc) npc = Variables().npc;
    return npc.achievements.includes(achievement);
  }
  /**
   * Achievements are used for keeping track of things done or things in effect.
   * @param npc The target NPC. If not specified, the active NPC will be selected
   */
  hasAnyAchievement(achievements: string[], npc?: Npc) {
    if (!npc) npc = Variables().npc;
    return npc.achievements.includesAny(achievements);
  }
  /**
   * Achievements are used for keeping track of things done or things in effect.
   * @param npc The target NPC. If not specified, the active NPC will be selected
   */
  hasAllAchievements(achievements: string[], npc?: Npc) {
    if (!npc) npc = Variables().npc;
    return npc.achievements.includesAll(achievements);
  }
  /**
   * Adds an achievement to the NPC if they don't have it already.
   * Achievements are used for keeping track of things done or things in effect.
   * @param npc The target NPC. If not specified, the active NPC will be selected
   */
  setAchievement(achievement: string, npc?: Npc): void {
    if (!npc) npc = Variables().npc;
    if (!this.hasAchievement(achievement, npc))
      npc.achievements.push(achievement);
  }
  /**
   * Achievements are used for keeping track of things done or things in effect.
   * @param npc The target NPC. If not specified, the active NPC will be selected
   */
  removeAchievement(achievement: string, npc?: Npc): void {
    if (!npc) npc = Variables().npc;
    npc.achievements.delete(achievement);
  }
  /**
   * Gets the NPC's current disaggregated selling value.
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @returns an NpcValue object with multiple number parameters
   */
  getValue(npc?: Npc): NpcValue {
    if (!npc) npc = Variables().npc;
    const maxNonVirgin = 1500;
    const maxFwPenalty = -0.75; //Maximum freedom wish penalty 75%
    let calcValue = (stat: number, ratio: number) =>
      (maxNonVirgin * (stat * ratio)) / 100;
    let value: NpcValue = npc.hasPussy
      ? {
          obedience: calcValue(npc.obedience, (0.27 * npc.obedience) / 100),
          obedienceRatio: "(27%)",
          lust: calcValue(npc.lust, 0.25),
          lustRatio: "(25%)",
          pussy: calcValue(npc.pussyTraining, 0.19),
          pussyRatio: "(19%)",
          anus: calcValue(npc.anusTraining, 0.16),
          anusRatio: "(16%)",
          mouth: calcValue(npc.mouthTraining, 0.13),
          mouthRatio: "(13%)",
        }
      : {
          obedience: calcValue(npc.obedience, (0.3 * npc.obedience) / 100),
          obedienceRatio: "(30%)",
          lust: calcValue(npc.lust, 0.27),
          lustRatio: "(27%)",
          pussy: 0,
          pussyRatio: "(0%)",
          anus: calcValue(npc.anusTraining, 0.23),
          anusRatio: "(23%)",
          mouth: calcValue(npc.mouthTraining, 0.2),
          mouthRatio: "(20%)",
        };
    value.total =
      value.obedience + value.lust + value.pussy + value.anus + value.mouth;
    value.freedomWish = (value.total * maxFwPenalty * npc.freedomWish) / 100;
    if (npc.hasPussy) {
      if (npc.vaginaVirgin) value.virginType = "virgin " + npc.genitals.female;
    } else if (npc.analVirgin) value.virginType = "anal virginity";
    value.virginBonus = value.virginType ? Math.max(5, value.total * 0.2) : 0;
    value.total += value.freedomWish + value.virginBonus;
    return value;
  }
  /**
   * Changes the NPC social status and triggers the necessary actions or events
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param forceLocation (Optional) to force a location to move the NPC to. Instead of the default one where each status moves them to.
   */
  setStatus(status: NpcStatus, npc?: Npc, forceLocation?: string): void {
    npc = Npc.obtain(npc)[0];
    switch (status) {
      case "slave":
        npc.location = "basement";
        break;
      case "home slave":
        npc.location = "mainRoom";
        break;
    }
    if (forceLocation) npc.location = forceLocation;
    npc.status = status;
  }
  /**
   * Turns the NPC into a slave of the child trainer and moves it to the basement.
   */
  capture(npc: Npc): void {
    this.setStatus("slave", npc);
    Variables().slaves.push(npc);
  }
  /**
   * Updates the locations of all NPCs according to the provided date/time.
   */
  static updateLocations(currentDate: Date): void {
    const variables = Variables();
    if (!currentDate) currentDate = variables.now.date;
    //const sleepTime = window.Now.isBetween("10:00 PM", "7:00 AM", currentDate);
    const homeSpaces = variables.player.home.spaces.filter(
      (space: string) => space != "basement" && !space.startsWith("tort")
    );
    const baseSeed = currentDate.getTime() - 1649048400000; //Current date/time minus the start of the game
    window.Person.all(
      (npc) => npc.age > 0 || window.Person.getMonthsSinceLastBirthDay(npc) > 5,
      variables
    ).forEach((npc: Npc) => {
      const holder = window.Person.getHolder(npc, variables);
      switch (npc.status) {
        case "home slave":
        case "lover":
          if (!holder)
            npc.location = PseudoRandom.either(
              PseudoRandom.getSeed(baseSeed, npc.age, npc.name),
              homeSpaces
            );
          break;
        case "servant":
          if (variables.settings.cook.npc != npc.uid) break;
          for (const feedTimeString of variables.settings.cook.feedTimes) {
            const currentTimeStamp = currentDate.getTime();
            const feedTimeStamp = window.Now.dateFromTimeString(
              feedTimeString,
              currentDate
            ).getTime();
            if (
              currentTimeStamp >= feedTimeStamp - 60 * 60 * 1000 &&
              currentTimeStamp <= feedTimeStamp
            ) {
              currentDate = null;
              npc.location = "kitchen";
              if (holder) {
                if (holder.uid) throw Error("Servant held by another NPC");
                window.Player.getEquippedInventory(variables).removeNpc(npc);
                window.Player.lactationTimeout(variables.player, variables);
              }
              break;
            }
          }
          if (currentDate && !holder)
            npc.location = PseudoRandom.either(
              PseudoRandom.getSeed(baseSeed, npc.age, npc.name),
              homeSpaces.filter((space: string) => space != "kitchen")
            );
          break;
      }
    });
  }
  /**
   * @param filter (Optional) a function to filter the NPCs
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   * @returns an array with all NPCs present in the game
   */
  all(filter?: (npc: Npc) => boolean, variables?: any): Npc[] {
    if (!variables) variables = Variables();
    let all = variables.slaves;
    if (variables.player.home.family)
      all = all.concat(variables.player.home.family);
    if (filter) return all.filter(filter);
    return all;
  }
  /**
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   * @returns the first NPC that complies with the provided condition or null
   */
  firstOrNull(condition: (npc: Npc) => boolean, variables?: any): Npc {
    const candidates = this.all(condition, variables);
    return candidates.length ? candidates[0] : null;
  }
  /**
   * Get the NPC with the indicated unique ID
   */
  get(uid: Uid, variables?: any): Npc {
    return this.all(null, variables).firstOrDefault(
      (slave: Npc) => slave.uid == uid
    );
  }
  /**
   * Obtain NPC and variables from available data. If it's a number, returns the NPC with that UID. If it's null it returns currently selected NPC
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   */
  static obtain(npc?: Npc, variables?: any): [Npc, any] {
    if (!variables) variables = Variables();
    if (typeof npc == "number") npc = window.Person.get(npc, variables);
    else if (!npc) npc = variables.npc;
    return [npc, variables];
  }
  /**
   * Constructs a sentence indicating the stats requirements and optionally the current values in an NPC.
   * @param requirements An object with the names of the required stats and their required values
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param showCurrent If set to true the sentence will show the current values for each stats
   */
  getMinRequirementsSentence(
    requirements: Record<string, number>,
    npc?: Npc,
    showCurrent?: boolean
  ): string {
    if (!npc) npc = Variables().npc;
    let entries = [];
    for (let requirement in requirements)
      if (npc[requirement] < requirements[requirement])
        entries.push(
          requirement.beautifyStat() +
            " " +
            (showCurrent ? npc[requirement] + "/" : "") +
            requirements[requirement]
        );
    return entries.join(", ");
  }
  /**
   * @returns the NPCs that are wandering around at home (not locked on the basement)
   */
  getWandering(): Npc[] {
    const variables = Variables();
    return <Person[]>(
      window.Person.all(
        (npc: Npc) => npc.location == variables.scenery,
        variables
      )
    );
  }
  /**
   * Get the character that is holding the specified NPC
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   * @param npcList (Optional) The list of the NPCs to check as holders. If not specified, all NPCs are checked.
   */
  getHolder(npc?: Npc, variables?: any, npcList?: Npc[]): LivingCharacter {
    [npc, variables] = Npc.obtain(npc, variables);
    if (window.Player.getEquippedInventory().hasNpc(npc))
      return variables.player;
    if (!npcList) npcList = window.Person.all(null, variables);
    return npcList.firstOrDefault((candidate: Npc) =>
      window.Person.getEquippedInventory(candidate, variables).hasNpc(npc)
    );
  }
  /**
   * Check if the specified NPC is being held by anyone (NPC or player)
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   * @param npcList (Optional) The list of the NPCs to check as holders. If not specified, all NPCs are checked.
   */
  isBeingHeld(npc?: Npc, variables?: any, npcList?: Npc[]): boolean {
    return !!this.getHolder(npc, variables, npcList);
  }
  /**
   * Removes an NPC from the game and returns an array with the deleted NPC
   * If the NPC is referenced anywhere, a copy of it will be saved on $removedNpcs
   * @param npc The target NPC. If not specified, the active NPC will be selected
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   */
  delete(npc?: Npc, variables?: any): Npc[] {
    [npc, variables] = Npc.obtain(npc, variables);
    let holder = this.getHolder(npc, variables);
    if (holder) {
      if (holder.uid == 0)
        window.Player.getEquippedInventory(variables).removeNpc(npc);
      else this.getEquippedInventory(<Npc>holder, variables).removeNpc(npc);
    }
    if (
      npc.dad ||
      npc.mom ||
      npc.children.length ||
      variables.player.impregnator == npc.uid ||
      window.Person.firstOrNull((n) => n.impregnator == npc.uid)
    ) {
      if (!variables.removedNpcs) variables.removedNpcs = [];
      variables.removedNpcs.push(npc);
    }
    var index = (<Npc[]>variables.slaves).findIndex(
      (slave) => slave.uid == npc.uid
    );
    if (index > -1) return (<Npc[]>variables.slaves).deleteAt(index);
    if (!variables.player.home.family) return;
    index = (<Npc[]>variables.player.home.family).findIndex(
      (slave) => slave.uid == npc.uid
    );
    if (index > -1)
      return (<Npc[]>variables.player.home.family).deleteAt(index);
  }
  /**
   * Checks if this NPC should be released by the holder and does so in that case
   */
  manageHolder(npc: Npc, holder: LivingCharacter): void {
    if (holder && holder.uid != 0 && npc.age > 1 && !npc.ageProgress) {
      const holderNpc = <Npc>holder;
      window.Person.setStatus(
        holderNpc.status != "servant" ? holderNpc.status : "home slave",
        npc,
        holderNpc.location
      );
      if (npc.location != "basement")
        window.Person.setAchievement("beenOnHomeMain", npc);
      window.Person.getEquippedInventory(holderNpc, variables).removeNpc(npc);
      window.Person.lactationTimeout(holder, variables);
    }
  }
}
type AnimalSpecies = "dog" | "cat" | "rabbit" | "horse" | "pig" | "cow";
type RoughSize = "tiny" | "small" | "normal" | "big" | "very big";
class Animal extends Npc {
  species: AnimalSpecies;
  roughSize?: RoughSize;
  giveBirth(): Npc {
    throw new Error("Animal birthing not yet implemented.");
  }
}
const genderList: Gender[] = ["boy", "girl", "nb"];
class Person extends Npc {
  version: number = 3;
  title: string;
  pronoun: string;
  genPronoun: string;
  GenPronoun: string;
  possessive: string;
  Possessive: string;
  hairColor: string;
  hairLength: string;
  hairStyle: string;
  eyeColor: string;
  skin: string;
  haveClothes: boolean = true;
  uniqueness: PersonUniqueness;
  naturalHairColor?: string;
  constructor(init?: Partial<Person>) {
    super();
    Object.assign(this, init);
  }
  /**
   * Generates a random person.
   * @param applyUniqueness setting it to false will avoid that the uniqueness is applied to the Person stats
   * @returns a new Person based on the person generation configuration provided or the default one.
   */
  generate(gen?: PersonGeneration, applyUniqueness: boolean = true): Person {
    if (gen === undefined) gen = new PersonGeneration();
    let person = new Person();
    person.sex =
      Math.random() * 100 + 1 < gen.femalePercentage ? "female" : "male";
    person.sex =
      Math.random() * 100 + 1 < gen.hermPercentage ? "herm" : person.sex;
    person.gender =
      person.sex == "male"
        ? "boy"
        : person.sex == "female"
        ? "girl"
        : genderList.random();
    person.title =
      person.sex == "male" ? "boy" : person.sex == "female" ? "girl" : "child";
    person.pronoun =
      person.gender == "boy" ? "him" : person.gender == "girl" ? "her" : "them";
    person.GenPronoun =
      person.gender == "boy" ? "He" : person.gender == "girl" ? "She" : "They";
    person.genPronoun =
      person.gender == "boy" ? "he" : person.gender == "girl" ? "she" : "they";
    person.possessive =
      person.gender == "boy"
        ? "his"
        : person.gender == "girl"
        ? "her"
        : "their";
    person.Possessive =
      person.gender == "boy"
        ? "His"
        : person.gender == "girl"
        ? "Her"
        : "Their";
    person.hasPussy = person.sex == "female" || person.sex == "herm";
    person.hasPenis = person.sex == "male" || person.sex == "herm";
    let genGen: GenderGeneration =
      person.sex == "male"
        ? gen.males
        : person.sex == "female"
        ? gen.females
        : gen.herms;
    person.age =
      Math.floor(Math.random() * (genGen.toAge - genGen.fromAge)) +
      genGen.fromAge;
    person.ageIntroduced = person.age;
    person.adjustPubescence();
    if (person.age < 6)
      person.freedomWish -= ((6 - person.age) / 6) * person.freedomWish;
    person.genitals = {
      male: person.sex == "male" || person.sex == "herm" ? "dick" : null,
      female:
        person.sex == "female" || person.sex == "herm"
          ? person.age < 15
            ? "cunny"
            : "pussy"
          : null,
      all:
        person.sex == "male"
          ? "dick"
          : person.sex == "female"
          ? person.age < 15
            ? "cunny"
            : "pussy"
          : person.age < 15
          ? "dick and cunny"
          : "dick and pussy",
    };
    person.name = (person.gender != "boy" ? femaleNames : maleNames).random();
    person.skin = gen.skins.random();
    person.hairColor = gen.hairColors.random();
    person.hairLength =
      person.age == 0
        ? "short"
        : person.age == 2
        ? ["short", "medium"].random()
        : (person.gender == "boy"
            ? ["short", "short", "medium"]
            : ["short", "medium", "long"]
          ).random();
    const hairStyles = [...gen.hairStyles];
    if (person.gender == "boy")
      hairStyles.delete("pig tails", "twin tails", "ponytail", "shoulder");
    person.hairStyle = hairStyles.random();
    person.eyeColor = gen.eyeColors.random();
    person.uid = getUid();
    PersonUniqueness.applyRandom(person, applyUniqueness);
    window.Person.giveInitialClothes(person, variables);
    return person;
  }
  /**
   * Give and equip the initial clothes to the target person. Or store it in the indicated inventory.
   * @param person The target person. If not specified, the active NPC will be selected
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   * @param destination (Optional) The inventory where the clothes should be transferred to.
   */
  giveInitialClothes(
    person?: Person,
    variables?: any,
    destination?: Inventory
  ) {
    if (!destination)
      destination = window.Person.getEquippedInventory(person, variables);
    (person.gender == "girl"
      ? ["sundress", "gladiator sandals", "panties"]
      : ["t-shirt", "shorts", "briefs", "sandals"]
    ).forEach((n) => window.OnlineStore.getBase(n).transferTo(destination));
  }
  /**
   * @returns a description of a person personality based on their uniqueness
   */
  getPersonalityDescription(uniqueness: PersonUniqueness): string {
    return Object.keys(uniqueness)
      .filter((keyName) => typeof uniqueness[keyName] == "boolean")
      .join(", ");
  }
  /**
   * @param word the word taken from the name of home person in their uniqueness
   * @param person The target person. If not specified, the active NPC will be selected
   * @returns the expression used for the indicated person to refer to people on their original homes
   */
  getHomePersonName(word: string, person?: Person): string {
    if (!person) person = Variables().npc;
    if (word == "sibling") word = person.sex == "male" ? "bro" : "sis";
    if (person.age < 5) {
      switch (word) {
        case "uncle":
          return "uncle";
        case "dad":
          return "dada";
        case "mom":
          return "mama";
      }
      if (word.includes(" ")) {
        if (word.includes("girl")) return "a girl";
        if (word.includes("boy")) return "a boy";
      }
      return word;
    }
    if (person.age > 10) {
      switch (word) {
        case "bro":
          word = "brother";
          break;
        case "sis":
          word = "sister";
          break;
      }
      if (!word.includes(" ")) word = "my " + word;
    } else {
      switch (word) {
        case "dad":
          word = "daddy";
          break;
        case "mom":
          word = "mommy";
          break;
      }
    }
    return word;
  }
  /**
   * @param word the word taken from the name of home person in their uniqueness
   * @returns the sex a character in a person original home
   */
  getHomePersonSex(word: string): Sex {
    switch (word) {
      case "dad":
      case "bro":
      case "uncle":
      case "pa":
        return "male";
      case "mom":
      case "sis":
      case "aunt":
      case "ma":
        return "female";
    }
    return word.includes("boy") ? "male" : "female";
  }
  /**
   * Generates a very short description of the target person.
   * @param person The target person. If not specified, the active NPC will be selected
   * @param addTitle Add the person title (boy, girl, etc...)
   */
  getShortDescription(person?: Person, addTitle?: boolean): string {
    person = <Person>Npc.obtain(person)[0];
    const months = this.getMonthsSinceLastBirthDay(person);
    return (
      `${person.name} (${
        person.age < 1
          ? months < 1
            ? "newborn"
            : months + " m.o."
          : person.age + " y.o."
      } ${addTitle ? person.title + " " : ""}${person.hairColor} hair)` +
      (this.hasAchievement("playerNoticedPregnancy", person)
        ? "<<emoji 🤰>>"
        : "")
    );
  }
  /**
   * Generates a long description of the target person.
   * @param person The target person. If not specified, the active NPC will be selected
   */
  getLongDescription(person?: Person): string {
    let variables: any;
    [person, variables] = <[Person, any]>Npc.obtain(person, null);
    const months = this.getMonthsSinceLastBirthDay(person);
    let description = `${
      person.age < 1
        ? months < 1
          ? "newborn"
          : months + " month old"
        : person.age + " year old"
    } ${person.skin} ${person.title} with ${person.hairLength} ${
      person.hairStyle
    } ${person.hairColor} hair and ${person.eyeColor} eyes`;
    if (LivingCharacter.getPregnancyMonth(person, variables) > 5) {
      const playerNoticedPregnancy = this.hasAchievement(
        "playerNoticedPregnancy",
        person
      );
      description += `.\n@@color:deeppink;${
        (playerNoticedPregnancy ? "" : "''") + person.Possessive
      } belly visibly bulges suggesting a new life growing in ${
        person.pronoun
      }${playerNoticedPregnancy ? "" : "!!''"}@@<<emoji 🤰>>`;
      this.setAchievement("playerNoticedPregnancy", person);
    } else if (this.hasAchievement("playerNoticedPregnancy", person))
      description += `.\n@@color:deeppink;${person.GenPronoun}<<thirdPerson "'s" "'re">> pregnant@@<<emoji 🤰>>`;
    return description;
  }
  /**
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   * @returns a new 0 year old person as a child of the specified person and the impregnator of that person.
   */
  giveBirth(mom: Person, variables?: any): Npc {
    if (!variables) variables = Variables();
    const baby = <Person>LivingCharacter.giveBirth(mom, variables);
    const naturalHairColor = baby.hairColor;
    const dad = <Person>window.Person.get(baby.dad, variables);
    if (dad) {
      //Baby's dad is another NPC and that NPC exists.
      ["eyeColor", "hairColor", "skin"].forEach((trait) => {
        baby[trait] = [mom[trait], dad[trait]].random(); //Inherit one trait from mom or dad at 50% chance
      });
      ["curious", "diligent", "energetic", "naughty", "shy"].forEach(
        (trait) => {
          baby.uniqueness[trait] = [
            mom.uniqueness[trait], //Mom's trait
            dad.uniqueness[trait], //Daddy's trait
            baby.uniqueness[trait], //Random trait
          ].random(); //Chose one at 33% chance each
        }
      );
      dad.children.push(baby.uid);
    } else if (!baby.dad) {
      //Baby's dad is the player
      ["eyeColor", "hairColor", "skin"].forEach((trait) => {
        if (random(10) < 8) baby[trait] = mom[trait]; //70% chance of inherit each trait from mom
      });
      ["curious", "diligent", "energetic", "naughty", "shy"].forEach(
        (trait) => {
          //70% chance of inherit each trait from mom
          if (random(10) < 8) baby.uniqueness[trait] = mom.uniqueness[trait];
        }
      );
      baby.love = 75; //Big bonus in love for being blood related
    }
    if (
      !variables.settings.allowBornUnnaturalHairColor &&
      !PersonGeneration.naturalHairColors.includes(baby.hairColor)
    ) {
      if (!PersonGeneration.naturalHairColors.includes(mom.hairColor))
        mom.naturalHairColor = naturalHairColor;
      if (dad && !PersonGeneration.naturalHairColors.includes(dad.hairColor))
        dad.naturalHairColor = naturalHairColor;
      baby.hairColor = naturalHairColor;
    }
    baby.status = "home slave";
    mom.children.push(baby.uid);
    let holderInventory: Inventory;
    if (mom.age < 2) {
      //Make someone hold the baby (The mother if they're old enough or the player)
      holderInventory = window.Player.getEquippedInventory(variables);
      window.Person.lactationTimeout(variables.player, variables, true);
    } else holderInventory = this.getEquippedInventory(mom, variables);
    holderInventory.addNpc(baby, "holding", "child");
    window.Person.lactationTimeout(mom, variables);
    window.Person.removeAchievement("playerNoticedPregnancy", mom);
    return baby;
  }
  /**
   * Check if tits of the indicated size can be drawn
   * @param person The target person. If not specified, the active NPC will be selected
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   */
  canDrawTits(size: TitSize, person?: Person, variables?: any): boolean {
    [person, variables] = <[Person, any]>Npc.obtain(person, variables);
    return (
      person.titSize == size &&
      !window.Person.wearingIncompatible("tits", size, person, variables)
    );
  }
  previouslyWearingClothes: Item[];
  /**
   * Un-equip all clothes by moving them to the normal inventory and save the references to person.previouslyWearingClothes
   * @param person The target person. If not specified, the active NPC will be selected
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   */
  strip(person?: Person, variables?: any): void {
    [person, variables] = <[Person, any]>Person.obtain(person, variables);
    const wearing = this.getEquippedInventory(person, variables);
    const inventory = this.getInventory(person, variables);
    if (!person.previouslyWearingClothes) person.previouslyWearingClothes = [];
    person.previouslyWearingClothes.push(...wearing.withTag("clothes"));
    person.previouslyWearingClothes.forEach((item: Item) =>
      wearing.move(item, inventory)
    );
  }
  /**
   * Equip all clothes in person.previouslyWearingClothes by moving them to the normal inventory to the equipped one
   * @param person The target person. If not specified, the active NPC will be selected
   * @param variables (Optional) The SugarCube Variables object where to take the needed data from.
   */
  dressBack(person?: Person, variables?: any): void {
    [person, variables] = <[Person, any]>Person.obtain(person, variables);
    const wearing = this.getEquippedInventory(person, variables);
    const inventory = this.getInventory(person, variables);
    person.previouslyWearingClothes.forEach((item: Item) =>
      inventory.move(item, wearing)
    );
    delete person.previouslyWearingClothes;
  }
}
interface GenderGeneration {
  fromAge: number;
  toAge: number;
}
class PersonGeneration {
  females: GenderGeneration = {
    fromAge: 1,
    toAge: 15,
  };
  males: GenderGeneration = {
    fromAge: 1,
    toAge: 15,
  };
  herms: GenderGeneration = {
    fromAge: 1,
    toAge: 15,
  };
  femalePercentage: number = 50;
  hermPercentage: number = 0;
  static naturalHairStyles = ["curly", "wavy", "straight", "shoulder"];
  hairStyles = [
    ...PersonGeneration.naturalHairStyles,
    "emo bangs",
    "fauxhawkian",
    "front spikes",
    "wavy side part",
    "asymmetrical",
    "ponytail",
    "twin tails",
    "pig tails",
  ];
  eyeColors = ["green", "blue", "brown", "hazel"];
  static naturalHairColors = [
    "black",
    "dark brown",
    "brown",
    "light brown",
    "dirty blonde",
    "blonde",
    "red",
    "auburn",
  ];
  hairColors = [
    ...PersonGeneration.naturalHairColors,
    "midnight blue",
    "rainbow",
    "pale pink",
    "hot pink",
    "burgundy",
    "royal purple",
    "violet",
    "indigo",
    "blue",
  ];
  skins = ["tan", "brown", "black", "white", "pale", "olive"];
  load(definition: Object | string): PersonGeneration {
    if (typeof definition == "string") definition = JSON.parse(definition);
    Object.assign(this, definition);
    return this;
  }
}
const maleNames: string[] = [
  "Liam",
  "Noah",
  "William",
  "James",
  "Oliver",
  "Benjamin",
  "Elijah",
  "Lucas",
  "Mason",
  "Logan",
  "Alexander",
  "Ethan",
  "Jacob",
  "Michael",
  "Daniel",
  "Henry",
  "Jackson",
  "Sebastian",
  "Aiden",
  "Matthew",
  "Samuel",
  "David",
  "Joseph",
  "Carter",
  "Owen",
  "Wyatt",
  "John",
  "Jack",
  "Luke",
  "Jayden",
  "Dylan",
  "Grayson",
  "Levi",
  "Isaac",
  "Gabriel",
  "Julian",
  "Mateo",
  "Anthony",
  "Jaxon",
  "Lincoln",
  "Joshua",
  "Christopher",
  "Andrew",
  "Theodore",
  "Caleb",
  "Ryan",
  "Asher",
  "Nathan",
  "Thomas",
  "Leo",
  "Isaiah",
  "Charles",
  "Josiah",
  "Hudson",
  "Christian",
  "Hunter",
  "Connor",
  "Eli",
  "Ezra",
  "Aaron",
  "Landon",
  "Adrian",
  "Jonathan",
  "Nolan",
  "Jeremiah",
  "Easton",
  "Elias",
  "Colton",
  "Cameron",
  "Carson",
  "Robert",
  "Angel",
  "Maverick",
  "Nicholas",
  "Dominic",
  "Jaxson",
  "Greyson",
  "Adam",
  "Ian",
  "Austin",
  "Santiago",
  "Jordan",
  "Cooper",
  "Brayden",
  "Roman",
  "Evan",
  "Ezekiel",
  "Xavier",
  "Jose",
  "Jace",
  "Jameson",
  "Leonardo",
  "Bryson",
  "Axel",
  "Everett",
  "Parker",
  "Kayden",
  "Miles",
  "Sawyer",
  "Jason",
  "Declan",
  "Weston",
  "Micah",
  "Ayden",
  "Wesley",
  "Luca",
  "Vincent",
  "Damian",
  "Zachary",
  "Silas",
  "Gavin",
  "Chase",
  "Kai",
  "Emmett",
  "Harrison",
  "Nathaniel",
  "Kingston",
  "Cole",
  "Tyler",
  "Bennett",
  "Bentley",
  "Ryker",
  "Tristan",
  "Brandon",
  "Kevin",
  "Luis",
  "George",
  "Ashton",
  "Rowan",
  "Braxton",
  "Ryder",
  "Gael",
  "Ivan",
  "Diego",
  "Maxwell",
  "Max",
  "Carlos",
  "Kaiden",
  "Juan",
  "Maddox",
  "Justin",
  "Waylon",
  "Calvin",
  "Giovanni",
  "Jonah",
  "Abel",
  "Jayce",
  "Jesus",
  "Amir",
  "King",
  "Beau",
  "Camden",
  "Alex",
  "Jasper",
  "Malachi",
  "Brody",
  "Jude",
  "Blake",
  "Emmanuel",
  "Eric",
  "Brooks",
  "Elliot",
  "Antonio",
  "Abraham",
  "Timothy",
  "Finn",
  "Rhett",
  "Elliott",
  "Edward",
  "August",
  "Xander",
  "Alan",
  "Dean",
  "Lorenzo",
  "Bryce",
  "Karter",
  "Victor",
  "Milo",
  "Miguel",
  "Hayden",
  "Graham",
  "Grant",
  "Zion",
  "Tucker",
  "Jesse",
  "Zayden",
  "Joel",
  "Richard",
  "Patrick",
  "Emiliano",
  "Avery",
  "Nicolas",
  "Brantley",
  "Dawson",
  "Myles",
  "Matteo",
  "River",
  "Steven",
  "Thiago",
  "Zane",
];
const femaleNames: string[] = [
  "Emma",
  "Olivia",
  "Ava",
  "Isabella",
  "Sophia",
  "Charlotte",
  "Mia",
  "Amelia",
  "Harper",
  "Evelyn",
  "Abigail",
  "Emily",
  "Elizabeth",
  "Mila",
  "Ella",
  "Avery",
  "Sofia",
  "Camila",
  "Aria",
  "Scarlett",
  "Victoria",
  "Madison",
  "Luna",
  "Grace",
  "Chloe",
  "Penelope",
  "Layla",
  "Riley",
  "Zoey",
  "Nora",
  "Lily",
  "Eleanor",
  "Hannah",
  "Lillian",
  "Addison",
  "Aubrey",
  "Ellie",
  "Stella",
  "Natalie",
  "Zoe",
  "Leah",
  "Hazel",
  "Violet",
  "Aurora",
  "Savannah",
  "Audrey",
  "Brooklyn",
  "Bella",
  "Claire",
  "Skylar",
  "Lucy",
  "Paisley",
  "Everly",
  "Anna",
  "Caroline",
  "Nova",
  "Genesis",
  "Emilia",
  "Kennedy",
  "Samantha",
  "Maya",
  "Willow",
  "Kinsley",
  "Naomi",
  "Aaliyah",
  "Elena",
  "Sarah",
  "Ariana",
  "Allison",
  "Gabriella",
  "Alice",
  "Madelyn",
  "Cora",
  "Ruby",
  "Eva",
  "Serenity",
  "Autumn",
  "Adeline",
  "Hailey",
  "Gianna",
  "Valentina",
  "Isla",
  "Eliana",
  "Quinn",
  "Nevaeh",
  "Ivy",
  "Sadie",
  "Piper",
  "Lydia",
  "Alexa",
  "Josephine",
  "Emery",
  "Julia",
  "Delilah",
  "Arianna",
  "Vivian",
  "Kaylee",
  "Sophie",
  "Brielle",
  "Madeline",
  "Peyton",
  "Rylee",
  "Clara",
  "Hadley",
  "Melanie",
  "Mackenzie",
  "Reagan",
  "Adalynn",
  "Liliana",
  "Aubree",
  "Jade",
  "Katherine",
  "Isabelle",
  "Natalia",
  "Raelynn",
  "Maria",
  "Athena",
  "Ximena",
  "Arya",
  "Leilani",
  "Taylor",
  "Faith",
  "Rose",
  "Kylie",
  "Alexandra",
  "Mary",
  "Margaret",
  "Lyla",
  "Ashley",
  "Amaya",
  "Eliza",
  "Brianna",
  "Bailey",
  "Andrea",
  "Khloe",
  "Jasmine",
  "Melody",
  "Iris",
  "Isabel",
  "Norah",
  "Annabelle",
  "Valeria",
  "Emerson",
  "Adalyn",
  "Ryleigh",
  "Eden",
  "Emersyn",
  "Anastasia",
  "Kayla",
  "Alyssa",
  "Juliana",
  "Charlie",
  "Esther",
  "Ariel",
  "Cecilia",
  "Valerie",
  "Alina",
  "Molly",
  "Reese",
  "Aliyah",
  "Lilly",
  "Parker",
  "Finley",
  "Morgan",
  "Sydney",
  "Jordyn",
  "Eloise",
  "Trinity",
  "Daisy",
  "Kimberly",
  "Lauren",
  "Genevieve",
  "Sara",
  "Arabella",
  "Harmony",
  "Elise",
  "Remi",
  "Teagan",
  "Alexis",
  "London",
  "Sloane",
  "Laila",
  "Lucia",
  "Diana",
  "Juliette",
  "Sienna",
  "Elliana",
  "Londyn",
  "Ayla",
  "Callie",
  "Gracie",
  "Josie",
  "Amara",
  "Jocelyn",
  "Daniela",
  "Everleigh",
  "Mya",
  "Rachel",
  "Summer",
  "Alana",
];
type PersonGrowthStage =
  | "baby"
  | "toddler"
  | "junior"
  | "elementary"
  | "pubescent"
  | "postPubescent";
interface PersonGrowthStageRange {
  from: number;
  to: number;
}
const GrowthStageAge: Record<PersonGrowthStage, PersonGrowthStageRange> = {
  baby: {
    from: 0,
    to: 0,
  },
  toddler: {
    from: 1,
    to: 4,
  },
  junior: {
    from: 5,
    to: 7,
  },
  elementary: {
    from: 8,
    to: 11,
  },
  pubescent: {
    from: 12,
    to: 15,
  },
  postPubescent: {
    from: 16,
    to: 25,
  },
};
class PersonUniqueness {
  name: string; //Personality name or personality role in home
  curious?: boolean; //Likes to learn new things, gives attention to others, high empathy
  naughty?: boolean; //Not easily disgusted, interested in feeling good mutually, open to every kink like incest or bestiality
  energetic?: boolean; //Optimistic, brave, takes initiative, wants to get attention, can become sadist
  shy?: boolean; //Not very talkative, tendency to blush, secretive, can become masochist
  diligent?: boolean; //Knowledgeable, does not hesitate, strict, does what it needs to be done
  homePersons?: PersonUniqueness[]; //Personalities of other persons at home (family, guardians, roommates, etc...)
  homeOtherNpc?: Npc[]; //Other NPCs in this person home that are not persons (pets basically)
  apply?: (person: Person) => void = () => {}; //Function to modify the person that this uniqueness is applied, if necessary (remove virginity, change stat, etc...)
  appearingChance?: number = 50; //Mathematical weight, the higher the default value is the rarer will be for the lower values
  ageRange?: PersonGrowthStageRange;
  constructor(prototype: PersonUniqueness) {
    Object.assign(this, prototype);
  }
  //Add a random preset personality to the indicated person. If the apply parameter is set to false the apply function (see above) will not be called (useful when adding a personality to an existing person without altering the current stats)
  static applyRandom(person: Person, apply = true): PersonUniqueness {
    let randomNumber = PseudoRandom.getFromRange(
      PseudoRandom.getSeed(person.age, person.name),
      0,
      personUniquenessPresets.reduce(
        (acc, preset) => acc + preset.appearingChance,
        0
      )
    );
    for (const preset of personUniquenessPresets) {
      if (randomNumber < preset.appearingChance) {
        person.uniqueness = new PersonUniqueness(preset);
        if (apply) preset.apply(person);
        console.log(preset);
        return;
      }
      randomNumber -= preset.appearingChance;
    }
  }
}
const personUniquenessPresets: PersonUniqueness[] = [
  new PersonUniqueness({
    name: "bottom",
    curious: true,
    shy: true,
    homePersons: [
      {
        name: "mom",
        curious: true,
      },
      {
        name: "dad",
        diligent: true,
      },
    ],
  }),
  new PersonUniqueness({
    name: "jumpy",
    curious: true,
    naughty: true,
    energetic: true,
    homePersons: [
      {
        name: "mom",
        curious: true,
        diligent: true,
      },
      {
        name: "dad",
        shy: true,
      },
      {
        name: "sis",
        shy: true,
      },
    ],
  }),
  new PersonUniqueness({
    name: "experiencedShy",
    shy: true,
    homePersons: [
      {
        name: "dad",
        shy: true,
        curious: true,
        naughty: true,
      },
      {
        name: "mom",
        curious: true,
        diligent: true,
      },
      {
        name: "bro",
        naughty: true,
        energetic: true,
      },
    ],
    apply(kid) {
      kid.mouthVirgin = false;
      kid.mouthTraining = Math.min(100, kid.age * 9);
      if (!kid.hasPussy || kid.age < 6) {
        kid.analVirgin = false;
        kid.anusTraining = 60;
      } else {
        kid.vaginaVirgin = false;
        kid.pussyTraining = 60;
      }
    },
    appearingChance: 13,
  }),
  new PersonUniqueness({
    name: "Carrabina",
    curious: true,
    naughty: true,
    shy: true,
    diligent: true,
    homePersons: [
      {
        name: "mom",
        curious: true,
      },
      {
        name: "dad",
        diligent: true,
        energetic: true,
      },
      {
        name: "bro",
        naughty: true,
        curious: true,
        energetic: true,
      },
    ],
    apply(kid) {
      if (kid.age > 4) {
        kid.lust = 40;
        if (kid.age > 7) {
          kid.mouthVirgin = false;
          kid.mouthTraining = Math.min(100, (kid.age - 7) * 34);
          kid.lust = 60;
          if (kid.age > 8) {
            kid.analVirgin = false;
            kid.anusTraining = Math.min(80, (kid.age - 8) * 60);
          }
        }
      }
    },
    appearingChance: 11,
  }),
  new PersonUniqueness({
    name: "experiencedOrphan",
    naughty: true,
    energetic: true,
    diligent: true,
    homePersons: [
      {
        name: "uncle",
        curious: true,
        naughty: true,
      },
      {
        name: "sibling",
        naughty: true,
        energetic: true,
      },
      {
        name: "uncle's girlfriend",
        curious: true,
        naughty: true,
      },
    ],
    homeOtherNpc: [
      {
        name: "Poppy",
        species: "rabbit",
        status: "pet",
      } as Animal,
    ],
    apply(kid) {
      if (kid.hasPussy) kid.vaginaVirgin = false;
      if (kid.hasPenis) kid.penisVirgin = false;
      if (kid.hasPussy) kid.pussyTraining = Math.min(100, kid.age * (100 / 5));
      if (kid.age > 4) kid.lust = 60;
      kid.mouthVirgin = false;
      kid.mouthTraining = 100;
      kid.anusTraining = 10;
    },
    appearingChance: 12,
  }),
  new PersonUniqueness({
    name: "top",
    curious: true,
    energetic: true,
    homePersons: [
      {
        name: "mom",
        shy: true,
      },
      {
        name: "dad",
        shy: true,
      },
      {
        name: "sis",
        curious: true,
        energetic: true,
      },
    ],
    appearingChance: 75,
  }),
  new PersonUniqueness({
    name: "spyX",
    energetic: true,
    homePersons: [
      {
        name: "pa",
        diligent: true,
      },
      {
        name: "ma",
        curious: true,
        energetic: true,
      },
    ],
    homeOtherNpc: [
      {
        name: "Bond",
        species: "dog",
        roughSize: "big",
      } as Animal,
    ],
    appearingChance: 15,
  }),
  new PersonUniqueness({
    name: "strictParents",
    energetic: true,
    diligent: true,
    curious: true,
    homePersons: [
      {
        name: "mom",
        diligent: true,
      },
      {
        name: "dad",
        diligent: true,
      },
    ],
  }),
];
