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
}; //These are the keys that do not have the same text as the names of the key trigger classes.
let keyOptionNumber: number, keyOptionShiftKey: boolean;
$(document).on(
  ":passagestart",
  () => ((keyOptionNumber = 1), (keyOptionShiftKey = false))
);
//Adds an option that leads to a passage that can be selected by pressing a number. The number is assigned automatically.
//After the 0, the sequence will be shift + 1, shift + 2, ...
//Parameters:
//1. SugarCube link. Example: [[text|passageName]]
//2. (optional) emoji or emojis that will appear at the start if emojis are enabled in the settings.
//3. (optional) widget used. By default <<link>> is used but "btn" can be specified to show a button instead.
//Example: <<keyOption [[My text|myPassage]] 🎃 btn>>
Macro.add("keyOption", {
  handler: function () {
    const emoji =
      this.args.length > 1 ? this.args[1] : "'&nbsp;&nbsp;&nbsp;&nbsp;'";
    const widget =
      this.args.length > 2 && this.args[2] == "btn" ? "button" : "link";
    let idStart = keyToId[keyOptionNumber];
    if (keyOptionShiftKey) idStart = "shift" + idStart.toUpperFirst();
    Wiki(
      `<<${widget} "<<emoji ${emoji}>>(${
        keyOptionShiftKey ? "Shift + " : "" + keyOptionNumber
      }) ${this.args[0].text}" "${this.args[0].link}">><</${widget}>>`,
      this.output
    ).attr("id", idStart + "Act");
    keyOptionNumber = (keyOptionNumber + 1) % 10;
    if (keyOptionNumber == 1) keyOptionShiftKey = true;
  },
});
//Adds an option that executes a sugarcube markup when selected and can be selected by pressing a number. The number is assigned automatically.
//Parameters:
//1. Text to show in the option
//2. (optional) emoji or emojis that will appear at the start if emojis are enabled in the settings.
//3. (optional) widget used. By default <<link>> is used but "btn" can be specified to show a button instead.
//Body: The sugarcube markup to be executed when the option is selected.
//Example <<keyAction 'myText' 🎃 btn>><<run alert('action executed')>><</keyAction>>
Macro.add("keyAction", {
  tags: null,
  handler: function () {
    let emoji =
      this.args.length > 1 ? this.args[1] : "'&nbsp;&nbsp;&nbsp;&nbsp;'";
    let widget =
      this.args.length > 2 && this.args[2] == "btn" ? "button" : "link";
    Wiki(
      `<<${widget} "<<emoji ${emoji}>>(${keyOptionNumber}) ${this.args[0]}">>${this.payload[0].contents}<</${widget}>>`,
      this.output
    ).attr("id", keyToId[keyOptionNumber] + "Act");
    keyOptionNumber = (keyOptionNumber + 1) % 10;
  },
});
//Adds a text similar imitating a keyOption that cannot be selected. A non working key number is assigned automatically.
//Parameters:
//1. Text to show
//2. (optional) emoji or emojis that will appear at the start if emojis are enabled in the settings.
//Example: <<keyDisabled 'My text' 🎃>>
Macro.add("keyDisabled", {
  handler: function () {
    let emoji =
      this.args.length > 1 ? this.args[1] : "'&nbsp;&nbsp;&nbsp;&nbsp;'";
    Wiki(`<<emoji ${emoji}>>(${keyOptionNumber}) ${this.args[0]}`, this.output);
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
    //To avoid executing options while writing into a dialog, only enter, esc and space are triggered when a dialog is opened.
    return;
  let className = keyToId[evt.key] || evt.key.toLowerCase();
  if (evt.shiftKey && className != "shift")
    className = "shift" + className.toUpperFirst();
  if (className.length == 1) className = className + "Key";
  $(`#${className}Act a`).trigger("click");
  $(`#${className}Act button`).trigger("click");
});
