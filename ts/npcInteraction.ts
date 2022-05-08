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
    let result =
      (interaction ? interaction.contents : collection.contents) + "\n";
    if (interaction && interaction.minutesCost)
      window.Now.addMinutes(interaction.minutesCost);
    if (interaction && interaction.npcStats) {
      result += "@@color:yellow;";
      interaction.npcStats.forEach((change) => {
        result +=
          " " +
          (change.charAt(0).toUpperCase() + change.slice(1)).replace(
            /(\B[A-Z])/g,
            " $1"
          );
        let match = /(\w+)([+-])(\d+)(%?)/.exec(change);
        let varPath = "variables().npc." + match[1];
        let value: number = eval(varPath);
        value =
          match[4] != "%"
            ? eval(value + match[2] + match[3])
            : eval(
                `Math.max(1, value)${match[2]}${
                  (value * parseFloat(match[3])) / 100
                }`
              );
        value = Math.min(100, Math.max(0, Math.ceil(value)));
        eval(`${varPath} = ${value}`);
        var slaveIndex = (variables() as any).npc.index;
        if (slaveIndex != undefined)
          //TODO: might not be the best way to determine if it's a slave
          (variables() as any).slaves[slaveIndex][match[1]] = eval(varPath);
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
    if (stopOptionText !== null) {
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
window.Interactions = {
  slave: {
    defaultStopOption: "✋ Leave $npc.pronoun alone",
    contents: `You approach $npc.name.
    <<include npcStats>>
    $npc.genPronoun nervously looks at you with $npc.possessive $npc.eyeColor eyes.`,
    options: {
      pushDown: {
        optionText: "👇 Push $npc.pronoun down",
        contents: `You push $npc.name down placing your body over.
        <<if $npc.fear gt 25>>\
            $npc.genPronoun trembles in fear under your shadow.\
        <</if>>`,
        next: {
          strip: {
            optionText: "👌 Strip $npc.pronoun naked",
            contents:
              "You take off all $npc.possessive clothes leaving $npc.name completely naked in front of you.\nYou admire $npc.possessive nice body 👀.",
            next: {
              penetrate: {
                playerRequirements: ["gender=male"],
                optionText: "🍆 Penetrate $npc.pronoun.",
                contents: `You forcefully push your dick inside $npc.name and start to fuck $npc.pronoun.
                $npc.genPronoun starts crying and whimpering.`,
                npcStats: ["fear+50"],
                showNpcStats: true,
                minutesCost: 30,
              },
              rubPussies: {
                playerRequirements: ["gender=female"],
                npcRequirements: ["gender=female"],
                optionText: "Trib pussies together.",
                contents: `You open her legs and you start rubbing your pussy against hers.\nShe doesn't seem to dislike it.`,
                npcStats: ["fear-5", "lust+10%"],
                next: () =>
                  window.Interactions.slave.options.pushDown.next["strip"].next,
                showNpcStats: true,
                minutesCost: 20,
              },
              rubToSlaveFace: {
                optionText:
                  "Rub your <<- $player.gender!=\\'male\\'?\\'pussy\\':\\'dick\\'>> on $npc.name\\'s face",
                contents: `You grab $npc.name head and press it between your legs and start rubbing.
                <<- $npc.pronoun[0].toUpperCase() + $npc.pronoun.slice(1)>> nose and lips feel really good on your <<- $player.gender!='male'?'pussy':'dick'>>.
                $npc.genPronoun looks at you with <<- $player.gender!='male'?$npc.possessive+' now wet':'some precum on '+$npc.possessive>> face. 🥺`,
                next: () =>
                  window.Interactions.slave.options.pushDown.next["strip"].next,
                minutesCost: 10,
              },
            },
          },
        },
      },
    },
  },
};
