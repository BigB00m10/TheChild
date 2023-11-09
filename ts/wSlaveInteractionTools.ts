//Returns the options after stripping the slave
let afterStrip = () =>
  window.Interactions.slave.options["pushDown"].next.strip.next;
//Returns the options that are after putting penis in the mouth
let afterPenToMouth = () =>
  (
    window.Interactions.slave.options["takeHead"].next.penToMouth
      .next as CallableFunction
  )();
//returns the different options when cumming outside
let cumOutsideOptions: NpcInteractionOptions = {
  cumBody: {
    optionText: "💦 Cum on $npc.possessive body.",
    contents: `Right when you're about to cum you pull your dick out from $npc.pronoun and shoot all your hot sperm all over $npc.possessive body.
    <<set $npc.bodySpermAmount++>>\
    Your sperm drips around $npc.name's body, impregnating $npc.possessive skin.<<playerCum>>`,
    next: () => afterStrip(),
  },
  cumFace: {
    optionText: "🌚 Cum on $npc.possessive face.",
    contents: `You take out your penis and quickly point it towards $npc.possessive face.
    <<set $npc.faceSpermAmount++>>
    $npc.name closes $npc.possessive eyes when the first cumshot lands on $npc.possessive face.
    You splatter a full load on $npc.pronoun while you hold $npc.name's chin.<<playerCum>>`,
    next: () => afterStrip(),
  },
};
//Returns the first member in the interaction route that points to the interaction collection.
let baseInteractionRoute = () => Variables().npcInteractionRoute.split(".")[0];
let baseInteractionOptions = () =>
  <NpcInteractionOptions>window.Interactions[baseInteractionRoute()].options;
let goBackToBeginningOption: NpcInteraction = {
  optionText: "🔙 Go back",
  action: true,
  contents: '<<openNpcInteraction $npcInteractionRoute.split(".")[0]>>',
};
//Returns the different talk options
let talkOptions = () =>
  window.Interactions[baseInteractionRoute()].options["talk"]
    .next as NpcInteractionOptions;