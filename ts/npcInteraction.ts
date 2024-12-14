type NpcInteractionOptions = Record<string, NpcInteraction>;
type complexRequirement = {
  playerRequirements?: string[];
  npcRequirements?: string[];
  inventoryRequirements?: string[];
  locationRequirements?: string[];
  locationExclusions?: string[];
  settingsRequirements?: string[];
};
//Describes an option that once selected will display a passage and optionally affect the relationship between the player and an NPC
interface NpcInteraction {
  //If this function is specified it will be called in order to know if this interaction can be shown in a list of options
  canBeShown?: () => boolean;
  //A list of requirements that the player needs to comply in order to show this option
  playerRequirements?: string[];
  //A list of requirements that the npc needs to comply in order to show this option
  //Examples: lust>10, fear<=50, aroused, !analVirgin, love=100, status=servant
  npcRequirements?: string[];
  //A list of items that the player needs to have in order to show this option
  inventoryRequirements?: string[];
  //A list of items that the current location needs to comply (location name or items present in the location)
  locationRequirements?: string[];
  //A list of locations where this option can't be shown
  locationExclusions?: string[];
  //A list of requirements that the settings need to comply in order to show this option
  settingsRequirements?: string[];
  //A list of object containing the previous requirement variables, used when more than one combination of settings is acceptable.
  //Example: Allowing the lube option to show if anal is enabled and isn't lubricated, or if they have a pussy that is not lubricated.
  complexRequirements?: complexRequirement[];
  //The text in the option (before selecting the option).
  //if an emoji followed by a space is prepended it will be used as the emoji parameter in the keyOption or keyAction macro.
  //Sugarcube markup can be written on it.
  optionText: string | (() => string);
  //The contents that will be shown as a passage once the option is selected.
  //The scenery of the last location will be shown.
  //Sugarcube markup can be written on it and it will be processed first (before any npc stat change)
  contents: string;
  //A list of npc stat changes that will be executed after the option is selected and the contents processed.
  //The changes will also be presented to the player in the passage.
  //Optionally, a function to generate the list can be provided.
  //"fear-10" will subtract exactly 10 to the npc's fear
  //"lust+10%" will add a 10% of the current value
  //"love%+40" will add a 40% of what is needed to reach 40 in love (fairmath) but at least will add 1
  //"+aroused" will set $npc.aroused to true and "-aroused" will set it to false
  npcStats?: string[] | ((npc: Npc) => string[]);
  //A list of player stat changes that will be executed after the option is selected and the contents processed.
  playerStats?: string[];
  //The next options to show in the passage after this option is selected.
  //Optionally, a function returning the options can be provided instead.
  //But be careful, the engine can lose the path to the interaction to show if the function does not return the option that leads to the current interaction and produce an error.
  //If that happens use altOptions and baseRoute instead.
  //After all those options the stop option will be shown unless specified not to (see below)
  next?: NpcInteractionOptions | (() => NpcInteractionOptions);
  //The text to show in the option to end the interaction with the NPC.
  //Once selected the player will be redirected to the passage where the interaction started with the openNpcInteraction macro.
  //If not specified the defaultStopOption in the parent interaction collection will be used.
  //If it's set to false the stop option will not be shown.
  stopOption?: string | false;
  //If set to true the npc's stats will be added to the passage.
  //If not specified it will show stats only when there's stats changes in the interaction.
  showNpcStats?: boolean | undefined;
  //The amount of minutes that will pass after selecting this option. It's also shown after the option text.
  minutesCost?: number;
  //A function to alter the options specified in the next field above in case you need a special set of options when this specific interaction is shown.
  altOptions?: (
    npc: Npc,
    current: NpcInteractionOptions,
    extraNpcs?: Npc[]
  ) => NpcInteractionOptions;
  //If specified the function is used to alter the minutesCost field when the option is selected. But the option will still show the minutes stated in minutesCost,
  altMinutes?: (current: number) => number;
  //If specified changes the base route to the options on this interaction.
  //For instance: If the function returns "slave.pushDown" and the options are named option1 and option2 the options will lead to the interactions "slave.pushDown.option1" and "slave.pushDown.option2"
  baseRoute?: (npc: Npc, extraNpcs?: Npc[]) => string;
  //If specified, forces to show or not this interaction if there's no options available for the player to select other than a "back" option or the stop option.
  //If not specified options without sub-options are only hidden if hideEmptyOptions on the parent collection is set to true.
  showIfEmpty?: boolean;
  //If set to true this interaction will not open in a new passage and execute the Sugarcube markup in the contents field instead once this option is selected.
  action?: boolean;
  //If specified, overrides timeIncreaseNpcHunger from the parent collection.
  timeIncreaseNpcHunger?: boolean | undefined;
  //If the option is not available it will still show, unlinked and with the specified string between brackets and parsed as Sugarcube markup.
  //A condition on the npc for showing the option can be prepended using '=>' as a separator.
  //Update 0.1.11.6: If no condition is specified canBeShown will be used as a condition instead, if it exists.
  //Example: "hasPussy=>Love $npc.love/50, Hunger $npc.hunger/30" to show "[Love 10/50, Hunger 20/30]" if NPC has a pussy.
  showDisabled?: string;
}
interface NpcInteractionCollection {
  //The first set of options in the collection (see NpcInteraction.next)
  options: NpcInteractionOptions | (() => NpcInteractionOptions);
  //The contents of the first passage.
  contents: string;
  //Every interaction in this interaction tree will have an option to exit the interaction and return to the passage that opened the first interaction.
  //This field indicates the text on that option. If not specified the text "🔙 Return" will be used.
  //If it's set to false, the stop option will never show unless specified in a sub-interaction.
  defaultStopOption?: string | false;
  //If this option is set to true all the interactions in this collection with minutesCost specified will increase NPC hunger unless it's overridden by the same field in that interaction.
  timeIncreaseNpcHunger?: boolean;
  //Hide all options in the entire collection that do not have any options to show other than a "back" option or the stop option.
  //Can be overridden by the showIfEmpty field in a specific interaction.
  hideEmptyOptions?: boolean;
  //Sugarcube markup action to do right before stopping the interaction.
  beforeStop?: string;
}
//Utility for properties that can be both a value and a function. If it's a function it calls the function with the provided arguments (if any) and returns the result.
let callOrGetItself = (valueOrFunction: any, ...args: any[]) =>
  typeof valueOrFunction != "function"
    ? valueOrFunction
    : valueOrFunction(...args);
//Redirects to the npcInteraction passage showing an interaction with a NPC.
//Usage: <<openNpcInteraction <interactionRoute>[ npcUid]>>
//interactionRoute is the name of the interaction collection (that must be added to window.Interactions array) followed by the name of the selected options
//npcUid is the target npc's UID and it's optional. If not specified the existing Npc in the $npc story variable will be used.
//Example: <<keyAction directPiston>><<openNpcInteraction 'slave.pushDown.strip.pushDickAnus.ram.fast' $slaves[0].uid>><</keyAction>>
Macro.add("openNpcInteraction", {
  handler() {
    const variables = Variables();
    if (SugarCube.State.passage != "npcInteraction")
      variables.returnPassage = SugarCube.State.passage;
    variables.npcInteractionRoute = this.args[0];
    if (this.args[1]) variables.npc = Npc.obtain(this.args[1], variables)[0];
    variables.extraNpcs = [];
    for (let npcIndex = 2; npcIndex < this.args.length; npcIndex++)
      variables.extraNpcs.push(Npc.obtain(this.args[npcIndex], variables));
    SugarCube.Engine.play("npcInteraction");
  },
});
const checkCondition = (objectName: string, condition: string): boolean => {
  let neg = "";
  if (condition[0] == "!") {
    neg = "!";
    condition = condition.slice(1);
  }
  return eval(
    neg +
      "variables()." +
      objectName +
      "." +
      condition
        .replace(/(\w[!=]=?=?)((?!true)(?!false)[^\d=].+)/, "$1'$2'")
        .replace(/([^><!=])=([^=])/, "$1==$2")
  );
};
const checkCanBeShown = (option: NpcInteraction) => {
  let temp = Temporary();
  temp.checkedGenericCanBeShown = false;
  let canBeShown = true;
  if (option.playerRequirements)
    option.playerRequirements.forEach(
      (condition) => (canBeShown &&= checkCondition("player", condition))
    );
  if (!canBeShown) return false;
  if (option.npcRequirements)
    option.npcRequirements.forEach(
      (condition) => (canBeShown &&= checkCondition("npc", condition))
    );
  if (!canBeShown) return false;
  if (option.settingsRequirements)
    option.settingsRequirements.forEach(
      (condition) => (canBeShown &&= checkCondition("settings", condition))
    );
  if (!canBeShown) return false;
  if (option.inventoryRequirements)
    option.inventoryRequirements.forEach(
      (itemName) => (canBeShown &&= window.Player.has(itemName))
    );
  if (!canBeShown) return false;
  if (option.locationRequirements)
    canBeShown = option.locationRequirements.includes(Variables().scenery);
  if (!canBeShown) return false;
  if (option.locationExclusions)
    option.locationExclusions.forEach(
      (location) => (canBeShown &&= location != Variables().scenery)
    );
  if (!canBeShown) return false;
  //TODO: also check room inventory for locationRequirements
  //ComplexRequirements should be used on a parent choice, to disable it when the conditions for none of its children are met.
  if (option.complexRequirements) {
    let complexCanBeShown = false;
    option.complexRequirements.forEach((combination) => {
      canBeShown = true;
      if (combination.playerRequirements)
        combination.playerRequirements.forEach(
          (condition) => (canBeShown &&= checkCondition("player", condition))
        );
      if (combination.npcRequirements)
        combination.npcRequirements.forEach(
          (condition) => (canBeShown &&= checkCondition("npc", condition))
        );
      if (combination.settingsRequirements)
        combination.settingsRequirements.forEach(
          (condition) => (canBeShown &&= checkCondition("settings", condition))
        );
      if (combination.inventoryRequirements)
        combination.inventoryRequirements.forEach(
          (itemName) => (canBeShown &&= window.Player.has(itemName))
        );
      if (combination.locationRequirements)
        canBeShown = option.locationRequirements.includes(Variables().scenery);
      if (option.locationExclusions)
        option.locationExclusions.forEach(
          (location) => (canBeShown &&= location != Variables().scenery)
        );
      if (canBeShown) complexCanBeShown = true;
    });
    canBeShown = complexCanBeShown;
  }
  if (!canBeShown) return false;
  if (option.canBeShown) {
    temp.checkedGenericCanBeShown = true;
    canBeShown = option.canBeShown();
  }
  return canBeShown;
};
Macro.add("npcInteractionLayout", {
  tags: [],
  handler() {
    let imageDiv = document.createElement("div"),
      contents = document.createElement("div");
    $(contents).wiki(this.payload[0].contents);
    let wrapper = document.createElement("div");
    wrapper.id = "npcInteraction";
    wrapper.append(imageDiv, contents);
    this.output.append(wrapper);
    if (this.args[0]) {
      $(imageDiv).wiki(`<<personImage ${this.args[0]}>>`);
      let toggle = 1;
      imageDiv.onclick = () => {
        const anim = $("#characterImageAnim")[0];
        if ((toggle ^= 1)) {
          anim.style.height = null;
          wrapper.classList.remove("big");
          return;
        }
        anim.style.height = window.innerHeight - 7 + "px";
        wrapper.classList.add("big");
      };
    }
  },
});
function processStats(
  result: string,
  showStats: boolean,
  hungerIncrease: number,
  npc: Npc,
  npcStats: string[],
  showNpcName: boolean
): [string, boolean, number] {
  if (npcStats && npcStats.length) {
    if (showStats === undefined) showStats = true;
    if (
      hungerIncrease &&
      !npcStats.firstOrDefault((s: string) => s.startsWith("hunger"))
    )
      npcStats.push("hunger+" + hungerIncrease);
    if (showNpcName) result += npc.name + ":";
    result += "@@color:yellow;";
    let first = true;
    const npcGetterJs = `window.Person.get(${npc.uid})`;
    npcStats.forEach((change) => {
      switch (change) {
        case "+aroused":
          window.Now.addTimedEvent(
            0.5, //Schedule this NPC to lose its arousal in half an hour from now.
            `var p=${npcGetterJs};if(p)p.aroused = false`,
            npc.uid + "arousalEnd"
          );
          break;
        case "-aroused":
          window.Now.removeTimedEvent(npc.uid + "arousalEnd");
          break;
      }
      if (first) first = false;
      else result += ", ";
      let varName: string;
      let varPath: string;
      let value: number | string;
      switch (change[0]) {
        case "+":
        case "-":
          varName = change.slice(1);
          varPath = npcGetterJs + "." + varName;
          result += change[0] + varName.beautifyStat();
          value = change[0] != "-" ? "true" : "false";
          break;
        default:
          let match = /(\w+)(%?)([+-])(\d+)(%?)/.exec(change);
          if (!match) match = /(\w+)(=)(\w+)/.exec(change);
          varName = match[1];
          varPath = npcGetterJs + "." + varName;
          value = eval(varPath) as number;
          if (match[2] == "%") {
            try {
              //Fairmath
              let max = parseInt(match[4]);
              let fraction = (max + 1 - value) * (max / 100);
              let term =
                fraction * 100 == max
                  ? "0"
                  : Math.max(0, Math.round(fraction)).toString();
              result += varName.beautifyStat() + match[3] + term;
              value = eval(value.toString() + match[3] + term) as number;
            } catch (err) {
              console.error(err);
              console.info(varPath);
            }
          } else if (match[2] == "=") {
            try {
              value = eval(match[3]);
            } catch {
              value = "'" + match[3] + "'";
            }
          } else {
            result += change.beautifyStat();
            value = (
              match[5] != "%"
                ? eval(value + match[3] + match[4])
                : eval(
                    `Math.max(1, value)${match[3]}${
                      (value * parseFloat(match[4])) / 100
                    }`
                  )
            ) as number;
          }
          if (typeof value == "number") value = Math.ceil(value).clamp(0, 100);
          break;
      }
      eval(`${varPath} = ${value}`);
    });
    result += "@@\n";
  }
  return [result, showStats, hungerIncrease];
}
let beforeStopInteractionMarkup = null;
let beforeStopInteraction:CallableFunction = null;
$(document).on(":passagestart", () => {
  const variables = Variables();
  if (variables.npc && State.passage != "npcInteraction") {
    if (beforeStopInteraction) beforeStopInteraction();
    if (beforeStopInteractionMarkup) $.wiki(beforeStopInteractionMarkup);
    variables.npc.pose = "idle";
    window.OnlineStore.getBase("condom").removed(variables.npc.uid);
    if (variables.extraNpcs)
      variables.extraNpcs.forEach((npc: Npc) => {
        npc.pose = "idle";
        window.OnlineStore.getBase("condom").removed(npc.uid);
      });
    delete variables.extraNpcs;
    delete variables.npc;
    delete variables.npcInteractionRoute;
  }
});
//Outputs the current interaction indicated by the route $npcInteractionRoute and directed to the Npc in $npc
//Not recommended to use it directly unless you know exactly what are you doing, use openNpcInteraction macro instead.
Macro.add("npcInteraction", {
  handler() {
    const variables = Variables();
    const temporary = Temporary();
    const steps: string[] = variables.npcInteractionRoute.split(".");
    const collection = window.Interactions[steps[0]];
    beforeStopInteractionMarkup = collection.beforeStop;
    let options = callOrGetItself(collection.options);
    let interaction: NpcInteraction;
    for (let stepIndex = 1; stepIndex < steps.length; stepIndex++) {
      interaction = options[steps[stepIndex]];
      if (interaction == undefined) {
        console.error(variables.npcInteractionRoute);
        console.error(options);
        console.error(steps[stepIndex]);
      }
      options = callOrGetItself(interaction.next);
    }
    variables.npc = window.Person.get(variables.npc.uid);
    const npc: Npc = variables.npc;
    npc.hasBoobs = window.Person.hasTits(npc, variables);
    if (variables.extraNpcs)
      for (let npcIndex = 0; npcIndex < variables.extraNpcs; npcIndex++) {
        let current = variables.extraNpcs[npcIndex];
        current = variables.extraNpcs[npcIndex] = window.Person.get(
          current.uid
        );
        current.hasBoobs = window.Person.hasTits(current, variables);
      }
    if (interaction && interaction.altOptions)
      options = interaction.altOptions(npc, options, variables.extraNpcs);
    let npcHungerIncrease = 0;
    if (interaction && (interaction.minutesCost || interaction.altMinutes)) {
      const minutes = interaction.altMinutes
        ? interaction.altMinutes(interaction.minutesCost)
        : interaction.minutesCost;
      window.Now.addMinutes(minutes);
      if (
        (collection.timeIncreaseNpcHunger ||
          interaction.timeIncreaseNpcHunger) &&
        interaction.showNpcStats &&
        interaction.timeIncreaseNpcHunger !== false
      )
        npcHungerIncrease = Math.max(1, Math.round((minutes / 8) * 0.46));
    }
    let showNpcStats = interaction ? interaction.showNpcStats : undefined;
    const npcs = [npc];
    if (variables.extraNpcs) npcs.push(...variables.extraNpcs);
    let npcStats = callOrGetItself(interaction ? interaction.npcStats : null);
    const extraNpcStats = callOrGetItself(temporary.npcStatModifiers);
    if (!npcStats || typeof npcStats[0] == "string") {
      if (extraNpcStats) {
        if (!npcStats) npcStats = [];
        npcStats.push(...extraNpcStats);
      }
      if (!npcStats || typeof npcStats[0] == "string") npcStats = [npcStats];
    } else if (extraNpcStats)
      for (let statIndex = 0; statIndex < extraNpcStats.length; statIndex++)
        npcStats[statIndex].push(...extraNpcStats[statIndex]);
    let result =
      $(document.createElement("span"))
        .wiki(interaction ? interaction.contents : collection.contents)
        .html() + "\n";
    for (let npcIndex = 0; npcIndex < npcs.length; npcIndex++)
      [result, showNpcStats, npcHungerIncrease] = processStats(
        result,
        showNpcStats,
        npcHungerIncrease,
        npcs[npcIndex],
        npcStats[npcIndex % (npcStats?.length || 1)],
        npcs.length > 1
      );
    if (interaction && showNpcStats) result += "<<npcStats>>\n";
    let baseRoute =
      interaction && interaction.baseRoute
        ? interaction.baseRoute(npc)
        : variables.npcInteractionRoute;
    if (variables.player.energy <= 0)
      result += `@@color:red;You REALLY need to sleep@@<br>
      <<keyAction Sleep 😴>><<sleep>><</keyAction>>`;
    else {
      for (const name in options) {
        let option = options[name];
        let canBeShown = checkCanBeShown(option);
        if (!canBeShown) {
          if (option.showDisabled && !temporary.checkedGenericCanBeShown) {
            let disabledText = option.showDisabled;
            if (disabledText.includes("=>")) {
              let components = disabledText.split("=>");
              if (!checkCondition("npc", components[0])) continue;
              disabledText = components[1];
            } else if (option.canBeShown && !option.canBeShown()) continue;
            let optionText = option.optionText
              .replace(/'/g, "\\'")
              .replace(/"/g, "&quot;");
            let emoji = "";
            if (/^\p{Extended_Pictographic}/u.test(optionText)) {
              emoji = optionText.split(" ")[0];
              optionText = optionText.slice(emoji.length + 1);
            }
            result += `\n<<keyDisabled '${optionText}' ${emoji}>> [${disabledText}]`;
          }
          continue;
        }
        if (
          option.showIfEmpty === false ||
          (collection.hideEmptyOptions && option.next && !option.showIfEmpty)
        ) {
          let next = callOrGetItself(option.next);
          if (option.altOptions) next = option.altOptions(npc, next);
          let empty = true;
          for (const nextName in next)
            if (nextName != "back" && checkCanBeShown(next[nextName])) {
              empty = false;
              break;
            }
          if (empty) continue;
        }
        let optionText = callOrGetItself(option.optionText)
          .replace(/'/g, "\\'")
          .replace(/"/g, "&quot;");
        let emoji = "";
        if (/^\p{Extended_Pictographic}/u.test(optionText)) {
          emoji = optionText.split(" ")[0];
          optionText = optionText.slice(emoji.length + 1);
        }
        let action = option.action
          ? option.contents
          : `<<openNpcInteraction ${baseRoute}.${name}>>`;
        result += `\n<<keyAction '${optionText}' ${emoji}>>${action}<</keyAction>>`;
        if (option.minutesCost) result += `: ${option.minutesCost}min`;
      }
      let stopOptionText: string;
      if (interaction)
        stopOptionText =
          interaction.stopOption === false ? null : interaction.stopOption;
      if (!stopOptionText && stopOptionText !== null) {
        stopOptionText =
          collection.defaultStopOption === false
            ? null
            : collection.defaultStopOption;
      }
      if (stopOptionText !== null) {
        stopOptionText = !stopOptionText
          ? "🔙 Return"
          : stopOptionText.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        let emoji = "";
        if (/^\p{Extended_Pictographic}/u.test(stopOptionText)) {
          emoji = stopOptionText.split(" ")[0];
          stopOptionText = stopOptionText.slice(emoji.length + 1);
        }
        result += `\n<<keyAction '${stopOptionText}' ${emoji}>><<goto $returnPassage>><</keyAction>>`;
      }
    }
    $(this.output).wiki(
      `<<npcInteractionLayout '$npc'>>${result}<</npcInteractionLayout>>`
    );
  },
});
//Outputs a text based on the current person uniqueness in $npc or passed as the first parameter
//Uses the tables in the UniquenessTables class.
Macro.add("personUniqueness", {
  handler() {
    let person: Person = this.args[1] || Variables().npc;
    const table: any[][] = UniquenessTables[this.args[0]];
    let defaultCase: UniquenessCase;
    const checkCondition = (condition: string) => {
      if (!condition) return false;
      var match = condition.match(/^([a-z]+)([^\d]*)(\d+)$/);
      return eval(person[match[1]] + (match[2] || ">=") + match[3]);
    };
    const processAgeRow = (cases: Array<UniquenessCase>) => {
      defaultCase = cases.firstOrDefault(
        (uniquenessCase: UniquenessCase) => !uniquenessCase.condition
      );
      let conditionIndex = table[0].length;
      for (let caseIndex = cases.length - 1; caseIndex >= 0; caseIndex--) {
        const uniquenessCase = cases[caseIndex];
        if (!uniquenessCase.condition) {
          if (uniquenessCase == defaultCase) continue;
          if (checkCondition(table[0][--conditionIndex])) {
            setOutput(uniquenessCase);
            return;
          }
        } else if (checkCondition(uniquenessCase.condition)) {
          setOutput(uniquenessCase);
          return;
        }
      }
      setOutput(defaultCase);
    };
    const setOutput = (
      uniquenessCase: UniquenessCase,
      specificField?: string
    ) => {
      let output: string;
      if (!specificField)
        for (let fieldName in uniquenessCase) {
          switch (fieldName) {
            case "condition":
            case "default":
            case "stats":
              continue;
            default:
              let okOutput = true;
              if (fieldName.includes("And"))
                fieldName
                  .split("And")
                  .forEach(
                    (c) => (okOutput &&= person.uniqueness[c.toLowerCase()])
                  );
              else okOutput = person.uniqueness[fieldName];
              if (okOutput) output = uniquenessCase[fieldName];
              else continue;
              break;
          }
          break;
        }
      else output = uniquenessCase[specificField];
      if (!output) output = uniquenessCase.default;
      if (output == "=default") {
        setOutput(defaultCase);
        return;
      } else if (output.startsWith("=age")) {
        const ageParams = output.slice(4).split(" ");
        const ageGroup = table.firstOrDefault<any[]>(
          (row: any[]) => row[0] == ageParams[0]
        );
        if (ageParams.length == 1) {
          processAgeRow(ageGroup.slice(1));
          return;
        }
        output = ageGroup[ageParams[1]][ageParams[2]];
      } else if (output[0] == "=") {
        let fieldName = output.substring(1);
        output = uniquenessCase[fieldName];
        if (!output) {
          setOutput(defaultCase, fieldName);
          return;
        }
      }
      if (uniquenessCase.stats)
        Temporary().npcStatModifiers = uniquenessCase.stats;
      output = output.replace(/^say:(.+)/i, `''${person.name}'': "$1"`);
      Wiki(output, this.output);
    };
    for (let ageIndex = table.length - 1; ageIndex > 0; ageIndex--) {
      if (table[ageIndex][0] > person.age) continue;
      processAgeRow(table[ageIndex].slice(1));
      return;
    }
  },
});
//To use in an interaction to indicate NPC ejaculating
Macro.add("npcCum", {
  handler() {
    const variables = Variables();
    const $npc: Npc = variables.npc;
    const lustDecCum = variables.settings.lustDecCum;
    if (window.Person.wearing("condom", $npc))
      window.OnlineStore.getBase("condom").removed($npc.uid);
    if (!lustDecCum && $npc.hasPussy) return;
    const temporary = Temporary();
    if (!temporary.npcStatModifiers) temporary.npcStatModifiers = [];
    const _npcStatModifiers = temporary.npcStatModifiers;
    if (lustDecCum) _npcStatModifiers.push("lust-" + lustDecCum); //decrease as much lust as said in the settings
    if (!$npc.hasPussy) _npcStatModifiers.push("-aroused");
  },
});
//To use anywhere to indicate the player ejaculating
Macro.add("playerCum", {
  handler() {
    const variables = Variables();
    if (window.Player.wearing("condom", variables))
      window.OnlineStore.getBase("condom").removed();
    (<Player>variables.player).lust -= 60;
    window.Player.manageEnergy(3); //Remove 3 hours of energy
  },
});
//To use in an interaction to indicate NPC is stimulated.
Macro.add("npcStimulated", {
  handler() {
    const $npc: Npc = Variables().npc;
    if (!$npc.aroused) {
      if (!Temporary().npcStatModifiers) Temporary().npcStatModifiers = [];
      Temporary().npcStatModifiers.push("+aroused");
    } else window.Now.assertTimedEvent($npc.uid + "arousalEnd", 0.5);
  },
});
//To indicate that there has been an internal cumshot from the first indicated character to the second and make the second pregnant if applicable.
Macro.add("checkImpregnation", {
  handler() {
    const variables = Variables();
    if (variables.settings.pregnancyOption == "disabled") return;
    const impregnator: LivingCharacter = this.args[0];
    const target: LivingCharacter = this.args[1];
    if (
      target.pregnantDays != undefined || //Already pregnant
      !target.impregnationChance || //Cannot get pregnant
      (impregnator.uid && !(<Npc>impregnator).producesSperm) ||
      (impregnator.uid
        ? window.Person.wearing("condom", <Npc>impregnator)
        : window.Player.wearing("condom"))
    )
      return;
    if (
      target.impregnationChance > 98 ||
      PseudoRandom.getInt(
        PseudoRandom.getSeed(target.name, target.uid, turns())
      ) < target.impregnationChance
    )
      window.Person.impregnate(target, impregnator.uid, variables);
    Wiki(
      `<br><br>@@color:yellow;${
        target.uid ? target.name : "You"
      } might have been impregnated@@`,
      this.output
    );
  },
});
