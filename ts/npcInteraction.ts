interface NpcInteraction {
  canBeShown?: () => boolean;
  playerRequirements?: string[];
  npcRequirements?: string[];
  inventoryRequirements?: string[];
  locationRequirements?: string[];
  settingsRequirements?: string[];
  optionText: string;
  contents: string;
  npcStats?: string[] | ((npc: Npc) => string[]);
  playerStats?: string[];
  next?:
    | Record<string, NpcInteraction>
    | (() => Record<string, NpcInteraction>);
  stopOption?: string | false;
  showNpcStats?: boolean;
  minutesCost?: number;
  altOptions?: (
    npc: Npc,
    current: Record<string, NpcInteraction>
  ) => Record<string, NpcInteraction>;
  altMinutes?: (current: number) => number;
  baseRoute?: (npc: Npc) => string;
  showIfEmpty?: boolean;
  action?: boolean;
  timeIncreaseNpcHunger?: boolean | undefined;
}
interface NpcInteractionCollection {
  options:
    | Record<string, NpcInteraction>
    | (() => Record<string, NpcInteraction>);
  contents: string;
  defaultStopOption?: string | false;
  timeIncreaseNpcHunger?: boolean;
  hideEmptyOptions?: boolean;
}
Macro.add("openNpcInteraction", {
  handler: function () {
    let variables = Variables();
    if (SugarCube.State.passage != "npcInteraction")
      variables.returnPassage = SugarCube.State.passage;
    variables.npcInteractionRoute = this.args[0];
    if (this.args[1]) variables.npc = Npc.get(this.args[1]);
    SugarCube.State.display("npcInteraction");
  },
});
const checkCanBeShown = (option: NpcInteraction) => {
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
  //TODO: also check room inventory for locationRequirements
  if (option.canBeShown) canBeShown = option.canBeShown();
  return canBeShown;
};
Macro.add("npcInteraction", {
  handler: function () {
    let vars = variables() as any;
    vars.npc = Npc.get(vars.npc.uid);
    const npc = vars.npc;
    const steps = vars.npcInteractionRoute.split(".");
    const collection = window.Interactions[steps[0]];
    let options =
      typeof collection.options != "function"
        ? collection.options
        : collection.options();
    let interaction: NpcInteraction;
    const getNext = (interaction: NpcInteraction) =>
      typeof interaction.next != "function"
        ? interaction.next
        : interaction.next();
    for (let stepIndex = 1; stepIndex < steps.length; stepIndex++) {
      interaction = options[steps[stepIndex]];
      if (interaction == undefined) {
        console.error(vars.npcInteractionRoute);
        console.error(options);
        console.error(steps[stepIndex]);
      }
      options = getNext(interaction);
    }
    $(document.createElement("span"))
      .wiki((interaction ? interaction.contents : collection.contents) + "\n")
      .appendTo(this.output);
    if (interaction && interaction.altOptions)
      options = interaction.altOptions(npc, options);
    let result = "";
    let npcHungerIncrease = 0;
    if (interaction && interaction.minutesCost) {
      const minutes = interaction.altMinutes
        ? interaction.altMinutes(interaction.minutesCost)
        : interaction.minutesCost;
      window.Now.addMinutes(minutes);
      if ((collection.timeIncreaseNpcHunger || interaction.timeIncreaseNpcHunger) && interaction.showNpcStats && interaction.timeIncreaseNpcHunger !== false)
        npcHungerIncrease = Math.max(1, Math.round((minutes / 8) * 0.46));
    }
    if (interaction && interaction.npcStats) {
      let npcStats =
        typeof interaction.npcStats != "function"
          ? interaction.npcStats
          : interaction.npcStats(npc);
      if (npcStats) {
        if (
          npcHungerIncrease &&
          !npcStats.firstOrDefault((s: string) => s.startsWith("hunger"))
        )
          npcStats.push("hunger+" + npcHungerIncrease);
        result += "@@color:yellow;";
        let first = true;
        npcStats.forEach((change) => {
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
    //TODO: player stat change
    if (interaction && interaction.showNpcStats)
      result += "<<include npcStats>>\n";
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
        if (!canBeShown) continue;
        if (collection.hideEmptyOptions && option.next && !option.showIfEmpty) {
          let next = getNext(option);
          if (option.altOptions) next = option.altOptions(npc, next);
          let empty = true;
          for (const nextName in next)
            if (checkCanBeShown(next[nextName])) {
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
        result += `\n<<keyOption [[${stopOptionText}|$returnPassage]] ${emoji}>>`;
      }
    }
    $(document.createElement("span")).wiki(result).appendTo(this.output);
  },
});
