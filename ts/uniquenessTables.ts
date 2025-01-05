interface UniquenessCase {
  //When this case is used the specified stat modifiers are added to the interaction
  stats: any;
  //default option, when it doesn't match any other characteristic
  default: string;
  //When specified, this case will follow this condition instead of the global ones.
  condition?: string | ((p: Person, variables: any) => boolean);
  //The other properties are tied to the npc traits. They can be combined with "And" in camelcase. Example: curiousAndNaughty
  //The traits will be checked in the same order that they are coded.
  //That is, if shy is specified first and then energetic. Npc shyness will be checked first and then the npc energetic trait (the first one that is true)
  curious?: string;
  naughty?: string;
  energetic?: string;
  shy?: string;
  diligent?: string;
}
//This static class stores all data needed to get the right Sugarcube markup according to the NPC stats and traits.
//This is to make it easier to write and maintain reaction mechanics that need multiple checks.
//Otherwise that would need lots of nested <<if>> macros that would make it easy to fuck up, specially when changing things.
//To call one of the tables (array properties in this class) use the <<personUniqueness>> macro.
//Example: <<personUniqueness hug>> (See npcInteraction.ts)
class UniquenessTables {
  static howAreYou = [
    ["fear<20", "love60", "lust80"], //global conditions for each line without specified condition
    [
      //Start of the fist age array
      0, //The fist element in the array is the minimum age to take this array into account
      {
        //The next elements are uniqueness cases in objects (See UniquenessCase interface)
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
        $npc.GenPronoun <<thirdPerson "says" "say">> with a big smile as $npc.pronoun jumps on you.`, //say: is a shortcut to <<npcSay>> widget using the rest of the line as input
      },
      {
        //lust80 (adding condition:"lust80" field would also do the same)
        default:
          "$npc.name doesn't answer and stretches out $npc.possessive hands towards your $player.genitals.all while making toddler sounds.",
        shy: `say:...
        ($npc.GenPronoun <<thirdPerson "blushes" "blush">> while $npc.possessive eyes keep looking between your legs.)`,
        energetic: `say:<<npcAddressPlayer>>!!
        $npc.GenPronoun <<thirdPerson "says" "say">> smiling while rubbing $npc.possessive $npc.genitals.all.`,
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
        shy: `$npc.name blushes and smiles at you. $npc.GenPronoun <<thirdPerson "looks" "look">> happy<<emoji 🥰>>`,
        energetic: `say:I'm so happy with you <<npcAddressPlayer>>!<<emoji 😊>>
        $npc.GenPronoun <<thirdPerson "jumps" "jump">> at you and <<thirdPerson "gives" "give">> you a loving hug<<emoji 💗>>`,
      },
      {
        //lust80
        default: `say:I'm fine <<npcAddressPlayer>><<emoji 🤤>>
        ($npc.GenPronoun<<thirdPerson "'s" "'re">> shamelessly masturbating in front of you)`,
        shy: `say:I..um...want to <<if $npc.diligent || $npc.age gte 11>>have...sex...<<else>>do...that...<</if>><<emoji 😳>>
        $npc.GenPronoun <<thirdPerson "says" "say">> with a hand over $npc.possessive $npc.genitals.all. It seems that $npc.genPronoun can't bear the excitement and slowly <<thirdPerson "rubs" "rub">> it a little bit.`,
        energetic: `say:<<npcAddressPlayer>>!! Let's do naughty things!!
        $npc.GenPronoun <<thirdPerson "approaches" "approach">> you and gently <<thirdPerson "touches" "touch">> your $player.genitals.all<<emoji 😋>>`,
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
        $npc.GenPronoun <<thirdPerson "touches" "touch">> you gently while drooling a little bit<<emoji 🤤>>`,
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
        stats: ["love+5"],
      },
    ],
    [
      1,
      {
        //default
        default: `You open your arms to embrace $npc.name in a hug, $npc.GenPronoun <<thirdPerson "doesn't" "don't">> seem to care either way, simply allowing you to hug $npc.pronoun. $npc.GenPronoun <<thirdPerson "is" "are">> almost limp in your embrace, offering little reaction.`,
        stats: ["love+1"],
      },
      {
        //fear40
        default: `You open your arms to embrace $npc.name in a hug, $npc.genPronoun <<thirdPerson "takes" "take">> a fearful step back but <<thirdPerson "doesn't" "don't">> attempt to move away from you. You embrace $npc.pronoun in a hug. You can tell $npc.genPronoun <<thirdPerson "is" "are">> a bit uneasy.`,
        stats: ["fear-5"],
      },
      {
        //love40
        default: `You open your arms to embrace $npc.name in a hug, $npc.genPronoun <<thirdPerson "doesn't" "don't">> seem to mind. You can feel $npc.possessive warmth, and you even feel $npc.possessive arms gently returning the hug.`,
        stats: ["love+5", "fear-5"],
      },
      {
        //love60
        default: `You open your arms to embrace $npc.name in a hug, $npc.genPronoun <<thirdPerson "smiles" "smile">> at you and <<thirdPerson "throws" "throw">> $npc.possessive arms around you and <<thirdPerson "squeezes" "squeeze">> you tightly. You gently rock back and forth holding $npc.pronoun contentedly.`,
        naughty: `You open your arms to embrace $npc.name in a hug, $npc.genPronoun <<thirdPerson "smiles" "smile">> at you and <<thirdPerson "throws" "throw">> $npc.possessive arms around you and <<thirdPerson "squeezes" "squeeze">> you tightly. You feel $npc.possessive hand slide down your chest, and grope you before quickly returning to the hug. $npc.name's naughtiness makes you <<- $player.hasPenis?'hard':'wet'>>. 'Such a naughty little thing' you think as you smirk at $npc.pronoun.`,
        stats: ["love+20%", "fear-10", "freedomWish-10"],
      },
      {
        //love80
        default: `You open your arms to embrace $npc.name in a hug, $npc.genPronoun <<thirdPerson "doesn't" "don't">> give you time to fully open your arms before $npc.genPronoun <<thirdPerson "has" "have">> squirmed $npc.possessive way into your embrace, squeezing you as hard as $npc.genPronoun can. $npc.GenPronoun <<thirdPerson "hums" "hum">> happily as $npc.genPronoun <<thirdPerson "squeezes" "squeeze">> you.

        "I love you, <<npcAddressPlayer>>"! $npc.GenPronoun <<thirdPerson "says" "say">> as $npc.genPronoun <<thirdPerson "nuzzles" "nuzzle">> your chest.`,
        naughty: `You open your arms to embrace $npc.name in a hug, $npc.genPronoun <<thirdPerson "doesn't" "don't">> give you time to fully open your arms before $npc.genPronoun <<thirdPerson "has" "have">> squirmed $npc.possessive way into your embrace, squeezing you as hard as $npc.genPronoun can. $npc.GenPronoun <<thirdPerson "hums" "hum">> happily as $npc.genPronoun <<thirdPerson "squeezes" "squeeze">> you. $npc.GenPronoun <<thirdPerson "takes" "take">> hold of your arm and gently <<thirdPerson "pulls" "pull">> it down, guiding your hand down between $npc.possessive legs, the look on $npc.possessive face is lewd and excited. $npc.GenPronoun <<thirdPerson "is" "are">> oh so naughty.`,
        stats: ["love+20%", "fear-10", "freedomWish-20"],
      },
      {
        //fear60
        default: `You open your arms to embrace $npc.name in a hug, but $npc.genPronoun <<thirdPerson "pushes" "push">> against you trying to stop the embrace. You can feel $npc.pronoun trembling with fear within your arms.`,
        stats: ["fear-1"],
      },
      {
        //fear80
        default: `You open your arms to embrace $npc.name in a hug, but $npc.GenPronoun <<thirdPerson "is" "are">> so terrified of you $npc.genPronoun immediately <<thirdPerson "starts" "start">> crying and backing away, looking for an escape. You enclose $npc.pronoun in your embrace anyway, trying to make $npc.pronoun feel loved. $npc.GenPronoun <<thirdPerson "squirms" "squirm">> and <<thirdPerson "yells" "yell">> in a desperate attempt to escape your hold, pushing and pressing every which way trying to escape; tears run down $npc.possessive face as $npc.genPronoun <<thirdPerson "cries" "cry">>.`,
        stats: ["freedomWish+10"],
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
    ],
    [
      5, //From 5 years old onwards do this:
      {
        default: "Say:I don't know...<<emoji 🙁>>",
        //If the person is naughty and shy use the same as in 2 year old.
        naughtyAndShy: "=age2",
        naughty: "Say:Yeah! I like naughty stuff!!<<emoji 😃>>",
      },
    ],
    [
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
        naughtyAndShy:
          "$npc.name looks a you between your legs, blushes and then nods<<emoji 😳>>",
        curiousAndShy: "=naughtyAndShy",
        shy: "$npc.name blushes and nods<<emoji 😳>>",
        curious:
          "$npc.name looks at you between your legs and then nods<<emoji 🥺>>",
        naughty: "=curious",
      },
    ],
    [
      5,
      {
        default: "say:Yes <<npcAddressPlayer>><<emoji 🙂>>",
        naughtyAndShy: `say: S-Sure <<npcAddressPlayer>>
        $npc.GenPronoun <<thirdPerson "looks" "look">> pretty excited at the idea.`,
        curiousAndShy: "=naughtyAndShy",
        shy: "say:Y-Yes <<npcAddressPlayer>><<emoji 😳>>",
        curious:
          '$npc.name takes a peek between your legs and says: "Yes <<npcAddressPlayer>>!"<<emoji 😃>>',
        naughty: "=curious",
      },
    ],
  ];
  static sleepPersonNaked = [
    [],
    [
      2,
      {
        default:
          "$npc.name looks a little surprised but nods in agreement<<emoji 🥺>>",
        naughtyAndShy:
          "$npc.name blushes like crazy sneakily putting a hand between $npc.possessive legs and then nods<<emoji 😳>>",
        shy: "$npc.name blushes like crazy and then nods<<emoji 😳>>",
        naughty: `$npc.name nods while gently stroking between $npc.possessive legs in front of you<<emoji 🥺>>
        It seems that this got $npc.pronoun excited.`,
      },
    ],
    [
      5,
      {
        default: "say:Oh... Okay... If that's what you want...",
        shy: "say:Na-Naked?!...O-Okay, if that's what you want...<<emoji 😳>>",
        naughty: "say:Yay!! Let's be naughty in bed!!<<emoji 😛>>",
      },
    ],
  ];
  static noticedBeingLookedLewdly = [
    ["lust80"],
    [
      5,
      {
        shy: `$npc.name takes a peek behind and notices your pervy gaze. $npc.GenPronoun <<thirdPerson "stops" "stop">> what $npc.genPronoun<<thirdPerson "'s" "'re">> doing while looking down and blushing heavily.`,
        naughty:
          "$npc.name notices you and suddenly spreads $npc.possessive legs without stopping $npc.possessive cooking making it easier for you to admire $npc.possessive privates.",
        default: `$npc.name noticed you looking but $npc.genPronoun <<thirdPerson "doesn't" "don't">> seem to mind your gaze and $npc.genPronoun <<thirdPerson "continues" "continue">> with what $npc.genPronoun<<thirdPerson "'s" "'re">> doing.`,
      },
      {
        default: "=naughty",
      },
    ],
  ];
  static receivedCookingApron = [
    ["fear40"],
    [
      5,
      {
        default: `say:Wow! Thank you sou much <<npcAddressPlayer>>!!<<emoji 🤗>>
        $npc.name is so happy that $npc.genPronoun <<thirdPerson "gives" "give">> you a hug.`,
        shy: `say:Ah!!... T-Thank you
        $npc.GenPronoun timidly <<thirdPerson "looks" "look">> at you while covering $npc.possessive reddened face.`,
        energetic: `say:Wooow!!! It's so cute!<<emoji 😃>>Thanks a lot <<npcAddressPlayer>>!!
        $npc.GenPronoun happily <<thirdPerson "jumps" "jump">> at you giving you a tight hug.`,
      },
      {
        default: `say:Ah!!... T-Thank you<<emoji 🥺>>
        $npc.name carefully takes the apron from you, a little scared.`,
      },
    ],
  ];
  static surpriseNeckKiss = [
    ["love40"],
    [
      5,
      {
        shy: "say:Eh?! W-wha?<<emoji 😳>>",
        default:
          "$npc.name let's you do your thing obediently without reacting.",
      },
      {
        default: `say:Kyaa!!<<emoji 😆>>
        $npc.GenPronoun <<thirdPerson "looks" "look">> back to smile at you<<emoji 😏>>`,
        shy: `say:Kyaa!!<<emoji 😆>>T-that tickles
        $npc.GenPronoun <<thirdPerson "says" "say">> while blushing, as $npc.genPronoun <<thirdPerson "continues" "continue">> with the cooking`,
      },
    ],
  ];
  static assGrabbed = [
    ["love40", "love60", "fear40", "fear60"],
    [
      5,
      {
        shy: `$npc.name jumps in surprise.
        <<npcSay "P-please be careful!">>`,
        naughty: `say:Tee-hee, <<npcAddressPlayer>> is grabbing my ass!!<<emoji ❤>>`,
        default: `$npc.name looks at you, not sure what to expect.`,
      },
      {
        //love40
        default: `$npc.name smiles at you while you grope $npc.pronoun.`,
        shy: "=default",
        naughty: "=default",
      },
      {
        //love60
        default: `$npc.name blushes and looks at you with a tender look.`,
        shy: "=default",
        naughty: "=default",
      },
      {
        //fear40
        default: `$npc.name jumps in surprise and looks at you looking a little worried.`,
      },
      {
        //fear60
        default: `$npc.name jumps in surprise and starts trembling.`,
      },
    ],
  ];
  static spreadPrivates = [
    [],
    [
      5,
      {
        default: "say:Ah! it's kinda chilly",
        naughty: "say:Are we gonna do lewd things?",
        shy: "say:Ah!... T-thats embarrassing <<npcAddressPlayer>>!!<<emoji 😳>>",
      },
    ],
  ];
  static pregnancyTest = [
    ["obedience<=20", "obedience30"],
    [
      0, //Up to 4yo case group
      {
        default:
          "You make $npc.name's pee in a clean glass and dip the device in it",
      },
    ],
    [
      5, //From 5yo to 7yo case group
      {
        //Default case when other cases do not apply
        default: `You ask $npc.name to<<emoji 💦>>pee in the device.\n$npc.GenPronoun <<thirdPerson seems seem>> confused about it but $npc.genPronoun <<thirdPerson obeys obey>>.`,
      },
      {
        //When obedience is 20 or less
        default:
          "<<set _refused=1>>You ask $npc.name to<<emoji 💦>>pee in the device but $npc.genPronoun<<emoji ⛔>><<thirdPerson refuses refuse>> to do so.\nWhat do you want to do?",
      },
      { default: "=default" }, //When obedience is 30 or more use the default case
    ],
    [
      8, //From 8yo to 10yo case group
      {
        //Default case when other cases do not apply
        default:
          "<<set _refused=1>>You ask $npc.name to<<emoji 💦>>pee in the device but $npc.genPronoun<<emoji ⛔>><<thirdPerson refuses refuse>> to do so.\nWhat do you want to do?",
        diligentAndShy:
          "You ask $npc.name to<<emoji 💦>>pee in the device.\n$npc.GenPronoun<<emoji 😳>><<thirdPerson blushes blush>> in front of you and <<thirdPerson obeys obey>> immediately.",
        diligent:
          "You ask $npc.name to<<emoji 💦>>pee in the device.\n$npc.GenPronoun <<thirdPerson looks look>> a little concerned and <<thirdPerson obeys obey>> immediately.",
      },
      {
        //When obedience is 20 or less
        default: "=default", //Everything according to the default case
      },
      {
        //When obedience is 30 or more
        default:
          "You ask $npc.name to<<emoji 💦>>pee in the device.\n$npc.genPronoun <<thirdPerson looks look>> a little confused but <<thirdPerson obeys obey>>.",
        shy: "You ask $npc.name to<<emoji 💦>>pee in the device.\n$npc.genPronoun <<thirdPerson looks look>> a little embarrassed but <<thirdPerson obeys obey>>.",
      },
    ],
    [
      11, //From 11yo onwards case group
      {
        //Default case when other cases do not apply
        default: "=age8 1 diligent", //Use the diligent code on the first case of the 8yo group
        shy: "=age8 1 diligentAndShy", //Use the diligentAndShy code on the first case of the 8yo group
      },
    ],
  ];
  static twoNpcSexTop = [
    [],
    [
      3, //From 3yo to 4yo
      {
        default: `$top.name stays still, looking at you with a confused face.
        Looks like $top.genPronoun do<<thirdPerson es ''>>n't know what sex is yet. So you decide to teach $top.pronoun.`,
      },
      {
        condition: (p: Person, v: any) =>
          window.Person.hasPenetrationExperience(p, v),
        naughty:
          "$top.name immediately looks very excited when hearing that and quickly approaches $bottom.name with the intent to follow your instructions.",
      },
    ],
    [
      5, //From 5yo to 7yo
      {
        //Default case
        default: `$top looks confused. <<npcSay 'What is "sechs"?' $top>>
        <<playerSay "I'll teach you">>`,
      },
      {
        //With experience in penetration
        condition: (p: Person, v: any) =>
          window.Person.hasPenetrationExperience(p, v),
        default: `<<if $top.lust gte 50 || $top.uniqueness.naughty>>\
          $top.name nods excited and quickly approaches $bottom.name with the intent to follow your instructions.
        <<elseif $top.obedience gte 60 || ($top.uniqueness.diligent && !$top.uniqueness.shy)>>\
          $top.name nods and obediently approaches $bottom.name with the intent to follow your instructions.
        <<elseif>><<set _unwilling = true>>\
          $top.name glances at $bottom.name. Looks like $top.genPronoun <<thirdPerson understands understand>> what you're asking $top.pronoun, but $top.genPronoun'<<thirdPerson s re>> hesitant about it.
        <</if>>`,
      },
    ],
    [
      8, //From 8yo
      {
        default: "=age5", //Same as in 5-7yo
        diligent: "", //TODO: leaned about sex without personal experience
      },
      {
        condition: (p: Person, v: any) =>
          window.Person.hasPenetrationExperience(p, v),
        default: "", //TODO
      },
    ],
  ];
}
