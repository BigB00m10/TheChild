class Player extends LivingCharacter {
  gameVersion: string = "0.1.14.2_BETA";
  //Zero UID identifies the player.
  uid: Uid = 0;
  //The name of the hole where the player can be fucked by default (not sure if this will be used)
  sexHole: string;
  home: Home = Homes.smallUrban;
  job: Job = Jobs.garbageCollector;
  cash: number = 100;
  energy: number = 100;
  //Unused, not sure if it will ever be used.
  lust: number;
  //Set to true when the player goes to sleep so the bed passage knows that the player just woke up and to know if energy should be reduced or restored
  sleeping: boolean;
  //Just a flag to check if the player has worked already to avoid evading responsibilities.
  workedToday: boolean = false;
  //Holds the items that the player has available to use.
  inventory: Inventory = new Inventory();
  constructor(definition?: Partial<Player>) {
    super();
    Object.assign(this, definition);
  }
  //Gets the player inventory object from the Sugarcube variables.
  getInventory(variables?: any): Inventory {
    if (!variables) variables = Variables();
    return (variables.player.inventory = new Inventory(
      variables.player.inventory
    ));
  }
  //Gets the player inventory object for the currently equipped/wearing items from the Sugarcube variables.
  getEquippedInventory(variables?: any): Inventory {
    if (!variables) variables = Variables();
    return (variables.player.equippedItems = new Inventory(
      variables.player.equippedItems
    ));
  }
  //Checks if the player wears or has the specified item (by name) equipped
  wearing(itemName: string, variables?: any): boolean {
    return this.getEquippedInventory(variables).has(itemName);
  }
  //Checks if the player has an item in their inventory.
  has(itemName: string, count: number = 1) {
    return this.getInventory().has(itemName, count);
  }
  removeItem(itemName: string) {
    return this.getInventory().removeByName(itemName);
  }
  manageEnergy(hoursPassed: number) {
    let player = Variables().player as Player;
    let multiplier =
      player.sleeping || Variables().settings.infiniteEnergy ? 1 : -0.46;
    let increment = Math.round((hoursPassed / 8) * 100 * multiplier);
    if (increment == 0) increment = multiplier < 0 ? -1 : 1;
    player.energy = (player.energy + increment).clamp(0, 100);
  }
  setGender(gender: Gender) {
    let player = Variables().player as Player;
    player.gender = gender;
  }
  //Use this to change the player's sex.
  setSex(sex: Sex, player?: Player) {
    if (!player) player = Variables().player as Player;
    player.sex = sex;
    switch (sex) {
      case "male":
        player.genitals = {
          male: "dick",
          female: null,
          all: "dick",
        };
        player.hasPenis = true;
        player.hasPussy = false;
        player.hasBoobs = false;
        player.sexHole = "ass";
        player.impregnationChance = 0;
        break;
      case "female":
        player.genitals = {
          male: null,
          female: "pussy",
          all: "pussy",
        };
        player.hasPenis = false;
        player.hasPussy = true;
        player.hasBoobs = true;
        player.sexHole = "pussy";
        player.impregnationChance = 80;
        break;
      case "herm":
        player.genitals = {
          male: "dick",
          female: "pussy",
          all: "dick and pussy",
        };
        player.hasPenis = true;
        player.hasPussy = true;
        player.hasBoobs = true;
        player.sexHole = "pussy";
        player.impregnationChance = 80;
        break;
    }
  }
  setAchievement(achievement: string): void {
    (Variables().achievements as string[]).pushUnique(achievement);
  }
  //Achievements are used to keep track of what things are already done before.
  hasAchievement(achievement: string): boolean {
    return (Variables().achievements as string[]).includes(achievement);
  }
  removeAchievement(achievement: string): void {
    (Variables().achievements as string[]).delete(achievement);
  }
  //Get how the specified NPC calls the player (how is the player addressed)
  getAddressing(npc: Npc) {
    let variables = Variables();
    let $player: Player = variables.player;
    if (npc.status == "citizen")
      return $player.gender != "boy" ? "lady" : "mister";
    let $addressing = variables.settings.addressing;
    if (npc.mom == this.uid || npc.dad == this.uid)
      return $addressing && $addressing.offspring
        ? $addressing.offspring
        : $player.gender != "boy"
        ? "mommy"
        : "daddy";
    let result = $player.name;
    if (!$addressing) return result;
    if ($addressing.slave) result = $addressing.slave;
    if (npc.status == "slave") return result;
    var specific = $addressing[npc.status];
    return specific ? specific : result;
  }
  //Bind a HTML DOM element with a property. So that when the element value is changed the property changes too and the other way around.
  //Parameters:
  //id: ID of the HTML element that will be bind to the variable
  //parentVariable: The parent variable or source property that contains the target property
  //propertyName: The name of the target property in the parent variable
  //onChanged: (optional, default:null) Extra function to execute when the element value is changed. If this function returns a value, that value will be used instead of the element's value.
  //displayId: (optional) Only for range elements. It will apply the range value to the input with the specified id. So the player can see its current value.
  bindSettingDom(
    id: string,
    parentVariable: object,
    propertyName: string,
    onChanged: (element: HTMLElement) => any,
    displayId: string
  ): void {
    let $element = $("#" + id);
    switch ($element.attr("type")) {
      case "checkbox":
        $element
          .on("change", function () {
            if (onChanged) parentVariable[propertyName] = onChanged(this);
            if (!onChanged || parentVariable[propertyName] === undefined)
              parentVariable[propertyName] = (<HTMLInputElement>this).checked;
          })
          .prop("checked", parentVariable[propertyName]);
        break;
      case "range":
        $element
          .on("input", function () {
            if (onChanged) parentVariable[propertyName] = onChanged(this);
            if (!onChanged || parentVariable[propertyName] === undefined)
              parentVariable[propertyName] = parseInt(
                (<HTMLInputElement>this).value
              );
            if (displayId) $("#" + displayId).val(parentVariable[propertyName]);
          })
          .val(parentVariable[propertyName] || 0);
        break;
      case "number":
        $element
          .on("change", function () {
            if (onChanged) parentVariable[propertyName] = onChanged(this);
            if (!onChanged || parentVariable[propertyName] === undefined)
              parentVariable[propertyName] = $(this).val();
          })
          .val(parentVariable[propertyName] || 0);
        break;
    }
  }
  //Bind a pair of HTML DOM elements indicating a range with their respective properties of a variable. So that when the element value is changed the property changes too and the other way around.
  //Parameters:
  //elementIdBase: Used to get the id of the HTML elements. "From" and "To" will be appended to get the two element's IDs
  //parentVariable: The variable that contains the from and to properties to bind.
  //propertyBaseName: Used to get the name of the properties. The first letter will be uppercase'd, and "from" and "to" will be prepended to get the two property names.
  bindRangeSettingsDom(
    elementIdBase: string,
    parentVariable: object,
    propertyBaseName: string
  ): void {
    let $from = $("#" + elementIdBase + "From");
    let $to = $("#" + elementIdBase + "To");
    $from
      .on("change", function () {
        let toValue = parseInt(<string>$to.val());
        let $this = $(this);
        let value = Math.min(toValue, parseInt(<string>$this.val()));
        $this.val(value);
        parentVariable["from" + propertyBaseName.toUpperFirst()] = value;
      })
      .val(parentVariable["from" + propertyBaseName.toUpperFirst()]);
    $to
      .on("change", function () {
        let fromValue = parseInt(<string>$from.val());
        let $this = $(this);
        let value = Math.max(fromValue, parseInt(<string>$this.val()));
        $this.val(value);
        parentVariable["to" + propertyBaseName.toUpperFirst()] = value;
      })
      .val(parentVariable["to" + propertyBaseName.toUpperFirst()]);
  }
  giveBirth(): Npc {
    const variables = Variables();
    const npc = <Person>super.giveBirth(variables);
    npc.love = 80; //Big bonus in love for being blood related
    if (this.impregnator) {
      //The one that impregnated is another NPC
      const impregnator = <Person>(
        window.Person.get(this.impregnator, variables)
      );
      ["eyeColor", "hairColor", "skin"].forEach((trait) => {
        if (random(10) < 8) npc[trait] = impregnator[trait]; //70% chance of inherit each trait from dad
      });
      ["curious", "diligent", "energetic", "naughty", "shy"].forEach(
        (trait) => {
          //70% chance of inherit each trait from dad
          if (random(10) < 8)
            npc.uniqueness[trait] = impregnator.uniqueness[trait];
        }
      );
    }
    this.getEquippedInventory(variables).add(
      new Item({
        name: npc.getShortDescription(npc, true),
        description: "Child being hold",
        tags: new Set(["holding", "child"]),
        extra: npc,
      }) //Make the player hold the newborn for now
    );
    return npc;
  }
  //Checks if the player is home inside
  isHome(variables?: any): boolean {
    if (!variables) variables = Variables();
    return (
      variables.scenery == "mainRoom" ||
      variables.player.home.spaces.includes(variables.scenery)
    );
  }
}
