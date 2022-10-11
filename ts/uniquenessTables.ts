interface UniquenessCase {
  default: string;
  condition?: string;
  curious?: string;
  naughty?: string;
  energetic?: string;
  shy?: string;
  diligent?: string;
}
class UniquenessTables {
  static howAreYou = [
    ["fear<20", "love60", "lust80"], //global conditions for each line without specified condition
    [
      0,
      {
        //first object without specified condition is default output
        default: "$npc.name looks at you without saying anything.", //default option, when it doesn't match any other characteristic
        shy: "$npc.name does not say anything and tries to avoid eye contact.", //output on shy characteristic
      },
      {
        //fear<20 condition
        default: "$npc.name looks at you with a mild smile<<emoji 🙂>>",
        shy: "=default", //same as shy in default condition (not default characteristic)
      },
      {
        //love60
        default: "$npc.name smiles at you and blushes a little<<emoji 😊>>",
        shy: "$npc.name is blushes a lot while showing a mild smile<<emoji 🙂>>",
        energetic: `say:<<npcAddressPlayer>>!!
        $npc.GenPronoun says with a big smile as $npc.pronoun jumps on you.`, //say: is a shortcut to <<npcSay>> widget using the rest of the line as input
      },
      {
        //lust80 (adding condition:"lust80" field would also do the same)
        default:
          "$npc.name doesn't answer and stretches out $npc.possessive hands towards your $player.genitals.all while making toddler sounds.",
        shy: `say:...
        ($npc.GenPronoun blushes while $npc.possessive eyes keep looking between your legs.)`,
        energetic: `say:<<npcAddressPlayer>>!!
        $npc.GenPronoun says smiling while rubbing $npc.possessive $npc.genitals.all.`,
      },
    ],
    [
      5, //From 5 yo onwards
      {
        default: "=age0", //use the same as age0 for all personalities
      },
      {
        //fear<20
        default: "say:Fine...",
        shy: "=age0",
        energetic:
          "say:<<if $npc.freedomWish gte 40>>I wanna go home!<<emoji 😢>><<else>>I'm good!!<</if>>",
      },
      {
        //love60
        default: "say:I'm good <<npcAddressPlayer>><<emoji 😚>>",
        shy: "$npc.name blushes and smiles at you. $npc.GenPronoun looks happy<<emoji 🥰>>",
        energetic: `say:I'm so happy with you <<npcAddressPlayer>>!<<emoji 😊>>
        $npc.GenPronoun jumps at you and gives you a loving hug<<emoji 💗>>`,
      },
      {
        //lust80
        default: `say:I'm fine <<npcAddressPlayer>><<emoji 🤤>>
        ($npc.GenPronoun's shamelessly masturbating in front of you)`,
        shy: `say:I..um...want to <<if $npc.diligent || $npc.age gte 11>>have...sex...<<else>>do...that...<</if>><<emoji 😳>>
        $npc.GenPronoun says with a hand over his $npc.genitals.all. It seems that he can't bear the excitement and slowly rubs it a little bit.`,
        energetic: `say:<<npcAddressPlayer>>!! Let's do naughty things!!
        $npc.GenPronoun approaches you and gently touches your $player.genitals.all<<emoji 😋>>`,
      },
    ],
    [
      11,
      {
        default: "say:Ok, I guess...",
        shy: "=age0",
      },
      {
        //fear<20
        default: "say:I'm fine <<npcAddressPlayer>><<emoji 🙂>>",
        shy: `say:...
        (blushes and looks down)`,
        energetic:
          "say:<<if $npc.freedomWish gte 40>>I miss my home<<emoji 😑>><<else>>I'm good!!<</if>>",
      },
      {
        default: "=age5",
      },
      {
        default: "say:I'm horny...Can we have sex? <<emoji 😛>>",
        shy: "=age5",
        energetic: `$npc.name comes closer to you and says "I'm ready anytime<<emoji 😛>>".
        $npc.GenPronoun touches you gently while drooling a little bit<<emoji 🤤>>`,
      },
    ],
  ];
  static hug = [
    ["fear40", "love40", "love60", "love80", "fear60", "fear80"],
    [
      0,
      {
        default: `You grab $npc.name on your arms and give $npc.pronoun a tight loving hug<<emoji 🥰>>
          The baby feels pretty warm on your body.`,
      },
    ],
    [
      1,
      {
        //default
        default: `You can feel $npc.possessive body warmth but $npc.genPronoun doesn't react much to it.`,
      },
      {
        //fear40
        default: "", //TODO add different reactions for when the player hugs a slave
      },
      {
        //love60
        default: "",
      },
      {
        //love80
        default: "",
      },
      {
        //fear60
        default: "",
      },
      {
        //fear80
        default: "",
      },
    ],
  ];
  static likedPreviousNaughty = [
    [],
    [
      2,
      {
        //If none of the below personalities matches the person this will appear:
        default: "$npc.name shrugs and doesn't say anything.",
        //If the person is naughty and shy this will appear:
        naughtyAndShy: "$npc.name blushes and nods.",
        naughty: "$npc.name smiles and nods.<<emoji 🙂>>",
      },
      5, //From 5 years old onwards do this:
      {
        default: "Say:I don't know...<<emoji 🙁>>",
        //If the person is naughty and shy use the same as in 2 year old.
        naughtyAndShy: "=age2",
        naughty: "Say:Yeah! I like naughty stuff!!<<emoji 😃>>",
      },
      8, //From 8 years old onwards do this:
      {
        default: "=age5",
        diligent: "Say:I just did what I was told to...<<emoji 🥺>>",
      },
    ],
  ];
  static sleepPlayerNaked = [
    [],
    [
      2,
      {
        default: "$npc.name nods<<emoji 🥺>>",
        curious:
          "$npc.name looks at you between your legs and then nods<<emoji 🥺>>",
        naughty: "=curious",
        shy: "$npc.name blushes and nods<<emoji 😳>>",
        naughtyAndShy:
          "$npc.name looks a you between your legs, blushes and then nods<<emoji 😳>>",
        curiousAndShy: "=naughtyAndShy",
      },
    ],
    [
      5,
      {
        default: "npcSay:Yes <<npcAddressPlayer>><<emoji 🙂>>",
        curious:
          '$npc takes a peek between your legs and says: "Yes <<npcAddressPlayer>>!"<<emoji 😃>>',
        naughty: "=curious",
        shy: "npcSay:Y-Yes <<npcAddressPlayer>><<emoji 😳>>",
        naughtyAndShy: `npcSay: S-Sure <<npcAddressPlayer>>
        $npc.GenPronoun looks pretty excited to the idea.`,
        curiousAndShy: "=naughtyAndShy",
      },
    ],
  ];
  static sleepPersonNaked = [
    [],
    [
      2,
      {
        default: "$npc.name looks a little surprised but nods in agreement<<emoji 🥺>>",
        naughty: `$npc.name nods while gently stroking between $npc.possessive legs in front of you<<emoji 🥺>>
        It seems that this got $npc.pronoun excited.`,
        shy: "$npc.name blushes like crazy and then nods<<emoji 😳>>",
        naughtyAndShy:
          "$npc.name blushes like crazy sneakily putting a hand between $npc.possessive legs and then nods<<emoji 😳>>",
      },
    ],
    [
      5,
      {
        default: "npcSay:Oh... Okay... If that's what you want...",
        naughty: "npcSay:Yay!!Let's be naughty in bed!!<<emoji 😛>>",
        shy: "npcSay:Na-Naked?!...O-Okay, if that's what you want...<<emoji 😳>>",
      }
    ]
  ]
}
