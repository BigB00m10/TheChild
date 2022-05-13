interface NpcInteraction {
  playerRequirements?: string[];
  npcRequirements?: string[];
  inventoryRequirements?: string[];
  locationRequirements?: string[];
  settingsRequirements?: string[];
  optionText: string;
  contents: string;
  npcStats?: string[];
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
}
interface NpcInteractionCollection {
  options: Record<string, NpcInteraction>;
  contents: string;
  defaultStopOption?: string | false;
}
Macro.add("openNpcInteraction", {
  handler: function () {
    let variables = Variables();
    if (SugarCube.State.passage != "npcInteraction")
      variables.returnPassage = SugarCube.State.passage;
    variables.npcInteractionRoute = this.args[0];
    SugarCube.State.display("npcInteraction");
  },
});
Macro.add("npcInteraction", {
  handler: function () {
    let npc = (variables() as any).npc;
    let steps = this.args[0].split(".");
    let collection = window.Interactions[steps[0]];
    let options = collection.options;
    let interaction: NpcInteraction;
    for (let stepIndex = 1; stepIndex < steps.length; stepIndex++) {
      interaction = options[steps[stepIndex]];
      options =
        typeof interaction.next != "function"
          ? interaction.next
          : interaction.next();
    }
    if (interaction && interaction.altOptions)
      options = interaction.altOptions(npc, options);
    let result =
      (interaction ? interaction.contents : collection.contents) + "\n";
    if (interaction && interaction.minutesCost)
      window.Now.addMinutes(interaction.minutesCost);
    if (interaction && interaction.npcStats) {
      result += "@@color:yellow;";
      interaction.npcStats.forEach((change) => {
        let varName: string;
        let varPath: string;
        let value: number | string;
        switch (change[0]) {
          case "+":
          case "-":
            varName = change.slice(1);
            varPath = "variables().npc." + varName;
            result += " " + change[0] + varName.toUpperFirst().replace(/(\B[A-Z])/g, " $1");
            value = change[0] != "-" ? "true" : "false";
            break;
          default:
            result += " " + change.toUpperFirst().replace(/(\B[A-Z])/g, " $1");
            let match = /(\w+)([+-])(\d+)(%?)/.exec(change);
            varName = match[1];
            varPath = "variables().npc." + varName;
            value = eval(varPath) as number;
            value = (
              match[4] != "%"
                ? eval(value + match[2] + match[3])
                : eval(
                    `Math.max(1, value)${match[2]}${
                      (value * parseFloat(match[3])) / 100
                    }`
                  )
            ) as number;
            value = Math.min(100, Math.max(0, Math.ceil(value)));
            break;
        }
        eval(`${varPath} = ${value}`);
        var slaveIndex = npc.index;
        if (slaveIndex != undefined)
          //TODO: might not be the best way to determine if it's a slave
          (variables() as any).slaves[slaveIndex][varName] = eval(varPath);
      });
      result += "@@\n";
    }
    //TODO: player stat change
    if (interaction && interaction.showNpcStats)
      result += "<<include npcStats>>\n";
    let checkCondition = (objectName: string, condition: string): boolean => {
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
    for (const name in options) {
      let option = options[name];
      let canBeShown = true;
      if (option.playerRequirements)
        option.playerRequirements.forEach(
          (condition) => (canBeShown &&= checkCondition("player", condition))
        );
      if (!canBeShown) continue;
      if (option.npcRequirements)
        option.npcRequirements.forEach(
          (condition) => (canBeShown &&= checkCondition("npc", condition))
        );
      if (!canBeShown) continue;
      if (option.settingsRequirements)
        option.settingsRequirements.forEach(
          (condition) => (canBeShown &&= checkCondition("settings", condition))
        );
      //TODO: check inventory and location required objects
      if (!canBeShown) continue;
      let optionText = option.optionText;
      let emoji = "";
      if (/^\p{Extended_Pictographic}/u.test(optionText)) {
        emoji = optionText.split(" ")[0];
        optionText = optionText.slice(emoji.length + 1);
      }
      result += `\n<<keyAction '${optionText}' ${emoji}>><<openNpcInteraction ${this.args[0]}.${name}>><</keyAction>>`;
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
      if (!stopOptionText) stopOptionText = "🔙 Return";
      let emoji = "";
      if (/^\p{Extended_Pictographic}/u.test(stopOptionText)) {
        emoji = stopOptionText.split(" ")[0];
        stopOptionText = stopOptionText.slice(emoji.length + 1);
      }
      result += `\n<<keyOption '${stopOptionText}' $returnPassage ${emoji}>>`;
    }
    $(document.createElement("span")).wiki(result).appendTo(this.output);
  },
});
