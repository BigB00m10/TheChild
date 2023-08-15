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
  optionText: string;
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
    current: NpcInteractionOptions
  ) => NpcInteractionOptions;
  //If specified the function is used to alter the minutesCost field when the option is selected. But the option will still show the minutes stated in minutesCost,
  altMinutes?: (current: number) => number;
  //If specified changes the base route to the options on this interaction.
  //For instance: If the function returns "slave.pushDown" and the options are named option1 and option2 the options will lead to the interactions "slave.pushDown.option1" and "slave.pushDown.option2"
  baseRoute?: (npc: Npc) => string;
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
  handler: function () {
    let variables = Variables();
    if (SugarCube.State.passage != "npcInteraction")
      variables.returnPassage = SugarCube.State.passage;
    variables.npcInteractionRoute = this.args[0];
    if (this.args[1]) variables.npc = window.Person.get(this.args[1]);
    (<any>SugarCube.State).display("npcInteraction");
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
  if (option.canBeShown) canBeShown = option.canBeShown();
  return canBeShown;
};
//Outputs the current interaction indicated by the route $npcInteractionRoute and directed to the Npc in $npc
//Not recommended to use it directly unless you know exactly what are you doing, use openNpcInteraction macro instead.
Macro.add("npcInteraction", {
  handler: function () {
    let vars = variables() as any;
    vars.npc = window.Person.get(vars.npc.uid);
    const npc: Npc = vars.npc;
    const steps: string[] = vars.npcInteractionRoute.split(".");
    const collection = window.Interactions[steps[0]];
    let options = callOrGetItself(collection.options);
    let interaction: NpcInteraction;
    for (let stepIndex = 1; stepIndex < steps.length; stepIndex++) {
      interaction = options[steps[stepIndex]];
      if (interaction == undefined) {
        console.error(vars.npcInteractionRoute);
        console.error(options);
        console.error(steps[stepIndex]);
      }
      options = callOrGetItself(interaction.next);
    }
    Wiki(
      (interaction ? interaction.contents : collection.contents) + "\n",
      this.output
    );
    if (interaction && interaction.altOptions)
      options = interaction.altOptions(npc, options);
    let result = "";
    let npcHungerIncrease = 0;
    if (interaction && interaction.minutesCost) {
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
    const extraNpcStats = Temporary().npcStatModifiers;
    if ((interaction && interaction.npcStats) || extraNpcStats) {
      const npcStats = [];
      if (interaction && interaction.npcStats) {
        const stats = callOrGetItself(interaction.npcStats, npc);
        if (stats) npcStats.push(...stats);
      }
      if (extraNpcStats) {
        const stats = callOrGetItself(extraNpcStats, npc);
        if (stats) npcStats.push(...stats);
      }
      if (npcStats.length) {
        if (showNpcStats === undefined) showNpcStats = true;
        if (
          npcHungerIncrease &&
          !npcStats.firstOrDefault((s: string) => s.startsWith("hunger"))
        )
          npcStats.push("hunger+" + npcHungerIncrease);
        result += "@@color:yellow;";
        let first = true;
        npcStats.forEach((change) => {
          switch (change) {
            case "+aroused":
              window.Now.addTimedEvent(
                0.5, //Schedule this NPC to lose its arousal in half an hour from now.
                `var p=window.Person.get(${npc.uid});if(p)p.aroused = false`,
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
              varPath = "variables().npc." + varName;
              result += change[0] + varName.beautifyStat();
              value = change[0] != "-" ? "true" : "false";
              break;
            default:
              let match = /(\w+)(%?)([+-])(\d+)(%?)/.exec(change);
              varName = match[1];
              varPath = "variables().npc." + varName;
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
              value = Math.ceil(value).clamp(0, 100);
              break;
          }
          eval(`${varPath} = ${value}`);
        });
        result += "@@\n";
      }
    }
    if (interaction && showNpcStats) result += "<<npcStats>>\n";
    let baseRoute =
      interaction && interaction.baseRoute
        ? interaction.baseRoute(npc)
        : vars.npcInteractionRoute;
    if (vars.player.energy <= 0)
      result += `@@color:red;You REALLY need to sleep@@<br>
      <<keyAction Sleep 😴>><<sleep>><</keyAction>>`;
    else {
      for (const name in options) {
        let option = options[name];
        let canBeShown = checkCanBeShown(option);
        if (!canBeShown) {
          if (option.showDisabled) {
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
        let optionText = option.optionText
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
        if (collection.beforeStop)
          result += `\n<<keyAction '${stopOptionText}' ${emoji}>>${collection.beforeStop}<<goto $returnPassage>><</keyAction>>`;
        else
          result += `\n<<keyOption [[${stopOptionText}|$returnPassage]] ${emoji}>>`;
      }
    }
    Wiki(result, this.output);
  },
});
//Outputs a text based on the current person uniqueness in $npc or passed as the first parameter
//Uses the tables in the UniquenessTables class.
Macro.add("personUniqueness", {
  handler: function () {
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
        processAgeRow(
          table
            .firstOrDefault<any[]>((row: any[]) => row[0] == output.slice(4))
            .slice(1)
        );
        return;
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
  handler: function () {
    const $npc: Npc = Variables().npc;
    const lustDecCum = Variables().settings.lustDecCum;
    if (!lustDecCum && $npc.hasPussy) return;
    if (!Temporary().npcStatModifiers) Temporary().npcStatModifiers = [];
    const _npcStatModifiers = Temporary().npcStatModifiers;
    if (lustDecCum) _npcStatModifiers.push("lust-" + lustDecCum); //decrease as much lust as said in the settings
    if (!$npc.hasPussy) _npcStatModifiers.push("-aroused");
  },
});
//To use in an interaction to indicate NPC is stimulated.
Macro.add("npcStimulated", {
  handler: () => {
    const $npc: Npc = Variables().npc;
    if (!$npc.aroused) {
      if (!Temporary().npcStatModifiers) Temporary().npcStatModifiers = [];
      Temporary().npcStatModifiers.push("+aroused");
    } else window.Now.assertTimedEvent($npc.uid + "arousalEnd", 0.5);
  },
});
//To indicate that there has been an internal cumshot from the first indicated character to the second and make the second pregnant if applicable.
Macro.add("checkImpregnation", {
  handler: function () {
    if (Variables().settings.pregnancyOption == "disabled") return;
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
    ) {
      //Target got impregnated
      target.pregnantDays = 0;
      target.impregnator = impregnator.uid;
    }
    Wiki(
      `<br><br>@@color:yellow;${
        target.uid ? target.name : "You"
      } might have been impregnated@@`,
      this.output
    );
  },
});
