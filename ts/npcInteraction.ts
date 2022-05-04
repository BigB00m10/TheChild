interface NpcInteraction {
  npcRequeriments?: any;
  inventoryRequeriments?: string[];
  locationRequeriments?: string[];
  settingsRequeriments?: string[];
  optionText: string;
  contents: string;
  npcStats?: string[];
  playerStats?: string[];
  next?: Record<string, NpcInteraction>;
  stopOption?: string | false;
}
interface NpcInteractionCollection {
  options: Record<string, NpcInteraction>;
  contents: string;
  defaultStopOption?: string | false;
}
Macro.add("openNpcInteraction", {
  handler: function () {
    let variables = Variables();
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
    //TODO: execute interaction consequences
    for (const name in options) {
      let option = options[name];
      //TODO: check if this option can be shown (requeriments)
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
    console.info(result);
    $(document.createElement("span")).wiki(result).appendTo(this.output);
  },
});
window.Interactions = {
  slave: {
    defaultStopOption: "✋ Leave $slave.pronoun alone",
    contents: `You approach $slave.name.
    <<include slaveStats>>
    $slave.genPronoun nerviously looks at you with $slave.possesive $slave.eyeColor eyes.`,
    options: {
      pushDown: {
        optionText: "👇 Push $slave.pronoun down",
        contents: `You push $slave.name down placing your body over.
        <<if $slave.fear gt 25>>\
            $slave.genPronoun trembles in fear under your shadow.\
        <</if>>`,
      },
    },
  },
};
