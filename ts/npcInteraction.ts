interface NpcInteraction {
  playerRequeriments?: string[];
  npcRequeriments?: string[];
  inventoryRequeriments?: string[];
  locationRequeriments?: string[];
  settingsRequeriments?: string[];
  optionText: string;
  contents: string;
  npcStats?: string[];
  playerStats?: string[];
  next?: Record<string, NpcInteraction>;
  stopOption?: string | false;
  showNpcStats?: boolean;
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
      options = interaction.next;
    }
    let result =
      (interaction ? interaction.contents : collection.contents) + "\n";
    if (interaction && interaction.npcStats) {
      result += "@@color:yellow;";
      interaction.npcStats.forEach((change) => {
        result +=
          " " +
          (change.charAt(0).toUpperCase() + change.slice(1)).replace(
            /(\B[A-Z])/g,
            " $1"
          );
        let match = /(\w+)([+-]\d+)/.exec(change);
        let varPath = "variables().npc." + match[1];
        eval(`${varPath}=Math.min(100, Math.max(0, ${varPath + match[2]}))`);
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
          "SugarCube.State.variables." +
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
      if (option.playerRequeriments)
        option.playerRequeriments.forEach(
          (condition) => (canBeShown &&= checkCondition("player", condition))
        );
      if (!canBeShown) continue;
      if (option.npcRequeriments)
        option.npcRequeriments.forEach(
          (condition) => (canBeShown &&= checkCondition("npc", condition))
        );
      if (!canBeShown) continue;
      if (option.settingsRequeriments)
        option.settingsRequeriments.forEach(
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
    $npc.genPronoun nervously looks at you with $npc.possesive $npc.eyeColor eyes.`,
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
              "You take off all $npc.possesive clothes leaving $npc.name completely naked in front of you.\nYou admire $npc.possesive nice body 👀.",
            next: {
              penetrate: {
                playerRequeriments: ["gender=male"],
                optionText: "🍆 Penetrate $npc.pronoun.",
                contents: `You forcefully push your dick inside $npc.name and start to fuck $npc.pronoun.
                $npc.genPronoun starts crying and whimpering.`,
                npcStats: ["fear+50"],
                showNpcStats: true,
              },
              rubPussies: {
                playerRequeriments: ["gender=female"],
                npcRequeriments: ["gender=female"],
                optionText: "Trib pussies together.",
                contents: `You open her legs and you start rubbing your pussy against hers.\nShe doesn't seem to dislike it.`,
                npcStats: ["fear-5", "lewd+2"], //TODO add percentage
                //next: window.Interactions.slave.options.pushDown.next.strip.next,
              },
              //TODO
            },
          },
        },
      },
    },
  },
};
