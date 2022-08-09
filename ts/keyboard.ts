const keyToId: Record<string, string> = {
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
  "0": "zero",
  " ": "space",
  Escape: "esc",
};
let keyOptionNumber: number;
$(document).on(":passagestart", () => (keyOptionNumber = 1));
Macro.add("keyOption", {
  handler: function () {
    let $wrapper = $(document.createElement("span"));
    let emoji =
      this.args.length > 1 ? this.args[1] : "'&nbsp;&nbsp;&nbsp;&nbsp;'";
    let widget =
      this.args.length > 2 && this.args[2] == "btn" ? "button" : "link";
    $wrapper
      .wiki(
        `<<${widget} "<<emoji ${emoji}>>(${keyOptionNumber}) ${
          this.args[0].text
        }" "${this.args[0].link}">><</${widget}>>`
      )
      .attr("id", keyToId[keyOptionNumber] + "Act")
      .appendTo(this.output);
    keyOptionNumber = (keyOptionNumber + 1) % 10;
  },
});
Macro.add("keyAction", {
  tags: null,
  handler: function () {
    let $wrapper = $(document.createElement("span"));
    let emoji =
      this.args.length > 1 ? this.args[1] : "'&nbsp;&nbsp;&nbsp;&nbsp;'";
    let widget =
      this.args.length > 2 && this.args[2] == "btn" ? "button" : "link";
    $wrapper
      .wiki(
        `<<${widget} "<<emoji ${emoji}>>(${keyOptionNumber}) ${
          this.args[0]
        }">>${this.payload[0].contents}<</${widget}>>`
      )
      .attr("id", keyToId[keyOptionNumber] + "Act")
      .appendTo(this.output);
      keyOptionNumber = (keyOptionNumber + 1) % 10;
  },
});
$(document).on("keyup", (evt) => {
  if (
    evt.key != "Enter" &&
    evt.key != "Escape" &&
    evt.key != " " &&
    SugarCube.Dialog.isOpen()
  )
    return;
  let className = keyToId[evt.key] || evt.key.toLowerCase();
  if (className.length == 1) className = className + "Key";
  $(`#${className}Act a`).trigger("click");
  $(`#${className}Act button`).trigger("click");
});
