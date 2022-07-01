const keyOptionIds = [
  "oneAct",
  "twoAct",
  "threeAct",
  "fourAct",
  "fiveAct",
  "sixAct",
  "sevenAct",
  "eightAct",
  "nineAct",
  "zeroAct",
];
let keyOptionIndex = 0;
$(document).on(":passagestart", () => (keyOptionIndex = 0));
Macro.add("keyOption", {
  handler: function () {
    let $wrapper = $(document.createElement("span"));
    let emoji = this.args.length > 2 ? this.args[2] : "'    '";
    let widget =
      this.args.length > 3 && this.args[3] == "btn" ? "button" : "link";
    $wrapper
      .wiki(
        `<<${widget} "<<emoji ${emoji}>>(${(keyOptionIndex + 1) % 10}) ${
          this.args[0]
        }" "${this.args[1]}">><</${widget}>>`
      )
      .attr("id", keyOptionIds[keyOptionIndex])
      .appendTo(this.output);
    keyOptionIndex++;
  },
});
Macro.add("keyAction", {
  tags: null,
  handler: function () {
    let $wrapper = $(document.createElement("span"));
    let emoji = this.args.length > 1 ? this.args[1] : "'    '";
    let widget =
      this.args.length > 2 && this.args[2] == "btn" ? "button" : "link";
    $wrapper
      .wiki(
        `<<${widget} "<<emoji ${emoji}>>(${(keyOptionIndex + 1) % 10}) ${
          this.args[0]
        }">>${this.payload[0].contents}<</${widget}>>`
      )
      .attr("id", keyOptionIds[keyOptionIndex])
      .appendTo(this.output);
    keyOptionIndex++;
  },
});
