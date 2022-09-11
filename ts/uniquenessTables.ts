class UniquenessTables {
  static howAreYou = [
    ["fear<20", "lust60", "love80"], //conditions on each line
    [
      0,
      {
        //normal case (else)
        shy: "$npc.name does not say anything and tries to avoid eye contact.",
        else: "$npc.name looks at you without saying anything.",
      },
      {
        //fear<20
        shy: "=normal", //same as shy in normal case
        else: "$npc.name looks at you with a mild smile<<emoji 馃檪>>",
      },
      {
        //love60
        shy: "$npc.name ",
        energetic: `say:<<npcAddressPlayer>>!! $npc.GenPronoun says with a big smile as $npc.pronoun jumps on you.`,
        else: "$npc.name smiles at you and blushes a little<<emoji 馃槉>>",
      },
      {
        //lust60
        shy: "say:...\n($npc.GenPronoun blushes while $npc.possessive eyes keep looking between your legs.)",
        energetic: `say:<<npcAddressPlayer>>!! $npc.GenPronoun says smiling while rubbing $npc.possessive $npc.genitals.`,
        else: "$npc.name stretches out $npc.possessive hands towards your $player.genitals",
      },
    ],
    [
      5, //From 5 yo onwards
      { shy: "=age0", energetic: "" },
      { shy: "", energetic: "" }, //lust60
      { shy: "", energetic: "" },
    ],
    [
      11,
      { energetic: "" },
      { shy: "", energetic: "" }, //lust60
      { shy: "", energetic: "" },
    ],
  ];
}