class NpcInteraction {
  npcRequeriments: any;
  inventoryRequeriments: string[];
  locationRequeriments: string[];
  settingsRequeriments: string[];
  optionText: string;
  contents: string;
  npcStats: string[];
  playerStats: string[];
  next: Map<string, NpcInteraction>;
  stopOption: string | boolean;
}
abstract class NpcInteractionCollection {
  interactions: Map<string, NpcInteraction>;
  contents: string;
  defaultStopOption: string = null;
}
Macro.add("openNpcInteraction", {
  handler: function () {
    let variables = Variables();
    variables.returnPassage = SugarCube.State.peek(1).title;
    variables.npcInteractionRoute = this.args[0];
    SugarCube.State.display("npcInteraction");
  },
});
Macro.add("npcInteraction", {
  handler: function () {
    let steps = this.args[0].split(".");
    let collection = window.Interactions[steps[0]];
    let interactions = collection.interactions;
    let interaction: NpcInteraction;
    for (let stepIndex = 1; stepIndex < steps.length; stepIndex++) {
      interaction = interactions[steps[stepIndex]];
      interactions = interaction.next;
    }
    let result = interaction
      ? interaction.contents
      : collection.contents + "\n";
    //TODO: execute interaction consequences
    for (let [name, interaction] of interactions) {
      let optionText = interaction.optionText;
      let emoji = "";
      if (/\p{Extended_Pictographic}/u.test(interaction.optionText)) {
        emoji = interaction.optionText.split(" ")[0];
        optionText = optionText.slice(emoji.length + 1);
      }
      result += `\n<<keyAction ${interaction.optionText} ${emoji}>><<openNpcInteraction ${this.args[0]}.${name}>><</keyAction>>`;
    }
    if (interaction.stopOption !== false) {
      let optionText = interaction.stopOption
        ? (interaction.stopOption as string)
        : collection.defaultStopOption;
      if (!optionText) optionText = "🔙 Return";
      let emoji = "";
      if (/\p{Extended_Pictographic}/u.test(interaction.optionText)) {
        emoji = interaction.optionText.split(" ")[0];
        optionText = optionText.slice(emoji.length + 1);
      }
      result += `\n<<keyOption '${optionText}' $returnPassage ${emoji}>>`;
    }
    $(document.createElement('span')).wiki(result);
  },
});
