let afterStrip = () =>
  window.Interactions.slave.options["pushDown"].next.strip.next;
let afterPenToMouth = () =>
  (window.Interactions.slave.options["penToMouth"].next as CallableFunction)();
let cumOutsideOptions: NpcInteractionOptions = {
  cumBody: {
    optionText: "💦 Cum on $npc.possessive body.",
    contents: `Right when you're about to cum you pull out your dick from $npc.pronoun and shoot all your hot sperm all over $npc.possessive body.
    <<set 
      Player.manageEnergy(1);
      $npc.bodySpermAmount++;
      $player.lust = 0;
    >>\
    Your sperm drips around $npc.name's body, impregnating $npc.possessive skin.`,
    next: () => afterStrip(),
  },
  cumFace: {
    optionText: "🌚 Cum on $npc.possessive face.",
    contents: `You take out your penis and quickly point it towards $npc.possessive face.
    <<set
      Player.manageEnergy(1);
      $npc.faceSpermAmount++;
      $player.lust = 0;
    >>
    $npc.name closes $npc.possessive eyes when the first cumshot lands on $npc.possessive face.
    You splatter a ful load on $npc.pronoun while you hold $npc.name's chin.`,
    next: () => afterStrip(),
  },
};
let baseInteractionRoute = () => Variables().npcInteractionRoute.split(".")[0];
let talkOptions = () =>
  window.Interactions[baseInteractionRoute()].options["talk"]
    .next as NpcInteractionOptions;
window.Interactions["slave"] = {
  defaultStopOption: "✋ Leave $npc.pronoun alone",
  contents: "<<include slaveApproach>>",
  options: {
    talk: {
      optionText: "👄 Talk to $npc.pronoun",
      contents: `<<if $npc.fear gte 40>>\
        <<emoji 😨>>$npc.name is trembling at your presence and is too scared to talk!\
      <<else>>\
        ''What do you want to ask $npc.name?''\
      <</if>>`,
      altOptions(npc, current) {
        if (npc.fear >= 40) {
          Variables().npcInteractionRoute = baseInteractionRoute();
          return window.Interactions[Variables().npcInteractionRoute]
            .options as NpcInteractionOptions;
        }
        return current;
      },
      next: {
        howAreYou: {
          canBeShown: () => !window.Person.hasAchievement("howAreYou"),
          optionText: '👄 "How are you today, $npc.name?"',
          contents: `<<run Person.setAchievement("howAreYou")>>\
          <<if $npc.uniqueness.shy && $npc.love lt 40>>\
            <<npcSay ...>><<if $npc.love gte 10 || $npc.lust gte 60>>\
            $npc.name blushes but $npc.genPronoun doesn't say anything.<</if>>\
          <<elseif $npc.uniqueness.energetic>>\
            ''$npc.name'':\
            <<if $npc.lust gte 80>>\
              <<if $npc.age lt 5>>\
              <<elseif $npc.age lt 11>>\
              <<else>>\
              <</if>>\
            <<else>>\
            <</if>>\
          <<else>>\
          <</if>>`,
          npcStats: ["love+1%"],
          showNpcStats: true,
          next: talkOptions,
        },
        back: {
          optionText: "🔙 Go back",
          action: true,
          contents: '<<openNpcInteraction $npcInteractionRoute.split(".")[0]>>',
        },
      },
    },
    pushDown: {
      optionText: "👇 Push $npc.pronoun down",
      contents: `You push $npc.name down, placing your body over $npc.pronoun.
        <<if $npc.fear gt 25>>\
          $npc.GenPronoun trembles in fear under your shadow.
        <<elseif $npc.love gt 50>>\
          $npc.GenPronoun leaves <<- $npc.pronoun>>self completely open as $npc.genPronoun smiles at you<<emoji ♥>>.
        <</if>>`,
      altOptions(npc: Npc, current: NpcInteractionOptions) {
        if ((npc as Person).haveClothes) return current;
        return afterStrip(); //If slave has no clothes we can skip stripping.
      },
      baseRoute: (npc) =>
        (npc as Person).haveClothes ? "slave.pushDown" : "slave.pushDown.strip",
      next: {
        strip: {
          optionText: "👌 Strip $npc.pronoun naked.",
          contents: `You take all off $npc.possessive clothes leaving $npc.name completely naked in front of you.
              <<if $npc.aroused>>\
                You notice that \
                <<if $npc.gender != 'male'>>\
                  @@color:deeppink;her $npc.genitals is wet@@\
                <<else>>\
                  @@color:deeppink;he has an erection@@\
                <</if>>\
                !! <<emoji 👀>>
              <<else>>\
                You admire $npc.possessive nice body. <<emoji 👀>>
              <</if>>\
              <<if $npc.love gt 50>>$npc.GenPronoun offers no resistance<<emoji ♥>> and lets you have your way.<</if>>`,
          next: {
            fingerAss: {
              settingsRequirements: ["anal"],
              optionText: "👉 Finger-train $npc.possessive ass.",
              minutesCost: 10,
              contents: `<<if $npc.anusTraining lt 20>>\
                Using some of your own spit as lubricant, you gently rub your finger in $npc.name's ass.
                The finger barely goes inside. <<emoji 😖>>
                <<elseif $npc.anusTraining lt 40>>\
                You gently push your finger inside $npc.name's ass.
                Still feels pretty tight. <<emoji 😖>>
                <<else>>\
                Your finger easily slides inside.
                You can easily fuck $npc.possessive asshole with your finger. <<emoji 😛>>\
                <</if>>`,
              npcStats: ["anusTraining%+40", "lust+1%"],
              showNpcStats: true,
              next: afterStrip,
            },
            fingerPussy: {
              npcRequirements: ["hasPussy", "aroused"],
              optionText: "👉 Finger-train $npc.possessive $npc.genitals.",
              minutesCost: 10,
              contents: `<<if $npc.pussyTraining lt 20>>\
                  You gently rub your finger in $npc.name's $npc.genitals hole.
                  You can feel your finger getting wet <<emoji 💧>>.
                <<elseif $npc.pussyTraining lt 40>>\
                  You manage to push your finger inside $npc.name.
                  You can feel $npc.possessive $npc.genitals tightening around your finger. <<emoji 😛>>
                <<else>>\
                  After just a little bit of meddling, your finger slides right in!
                  You rub $npc.name's insides making $npc.pronoun body react to it. <<emoji 😇>>
                  <<if $npc.lust gte 60>>\

                    $npc.GenPronoun is breathing hard. Looks like $npc.name is really enjoying this.\
                  <</if>>\
                <</if>>`,
              npcStats: ["pussyTraining%+40", "lust+10%", "+aroused"],
              showNpcStats: true,
              next: {
                cum: {
                  optionText: "💦 Make $npc.pronoun cum",
                  contents: `You vigorously rub inside $npc.name's vagina while you rub $npc.possessive clitoris at the same time making $npc.pronoun arc her body with the pleasure.
                  It doesn't take long until $npc.pronoun cums making your hand wet all over.`,
                  npcStats: [
                    "lust+5%",
                    "love+5",
                    "freedomWish-10",
                    "hunger+10",
                  ],
                  showNpcStats: true,
                  next: afterStrip,
                },
                else: {
                  optionText: "↩ Do something else",
                  contents: "What do you want to do next?",
                  next: afterStrip,
                },
              },
              altOptions(npc, current) {
                if (npc.pussyTraining >= 40 && npc.lust >= 60) return current;
                Variables().npcInteractionRoute = "slave.pushDown.strip";
                return afterStrip();
              },
            },
            pushDickVag: {
              playerRequirements: ["gender=male"],
              npcRequirements: ["hasPussy"],
              optionText:
                "🍆 Push your dick into $npc.possessive $npc.genitals",
              contents: `You push your dick against $npc.possessive $npc.genitals
                <<if $npc.age gt 3 && ($npc.lust lt 30 || $npc.fear gte 40)>>\
                  $npc.GenPronoun panics <<emoji 😨>> as $npc.genPronoun sees your dick pressing against $npc.pronoun private place.
                <</if>>\
                <<if $npc.aroused>>\
                  You can feel the moist on the tip of your dick.
                <</if>>\

                How do you want to proceed?`,
              next: {
                carefully: {
                  optionText: "🍬 Carefully press it in.",
                  minutesCost: 2,
                  contents: `<<if $npc.pussyTraining lt 20>>\
                      You press your dick in $npc.name's $npc.genitals squishing $npc.pronoun puffy labia on the sides. But it doesn't seem that is gonna go any further than this.
                    <<elseif $npc.pussyTraining lt 40>>\
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        <<set _cockEntered to true>>\
                        You barely manage to enter your cock's head inside $npc.name's $npc.genitals and it feels really tight! <<emoji 😣>>
                      <<else>>\
                        You try to enter $npc.pronoun but $npc.possessive $npc.genitals is too dry and it hurts $npc.pronoun a little. <<emoji 😫>>
                      <</if>>\
                    <<elseif $npc.pussyTraining lt 60>>\
                      <<set _cockEntered to true>>\
                      You slowly enter $npc.possessive $npc.genitals as it gets stretched.
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        $npc.GenPronoun looks a little troubled<<emoji 😣>>, but it looks like $npc.genPronoun can take it.
                      <<else>>\
                        Your cock hurts $npc.possessive dry vagina. A tear runs down $npc.possessive face. <<emoji 😢>>
                      <</if>>\
                    <<elseif $npc.pussyTraining lt 80>>\
                      <<set _cockEntered to true>>\
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        Your cock easily slides inside $npc.pronoun. $npc.GenPronoun doesn't seem to hate it.
                      <<else>>\
                        $npc.GenPronoun squints $npc.possessive eyes as you penetrate $npc.pronoun. <<emoji 😣>>
                        $npc.Possessive dry pussy hurts a little.
                      <</if>>\
                    <<else>>\
                      <<set _cockEntered to true>>\
                      Your cock slides right in as $npc.genPronoun lets out a quiet ~~"Ah!"~~.
                    <</if>>\
                    <<if _cockEntered>>\
                      <<checkNpcVirgin genital>>\
                    <</if>>`,
                  npcStats: (npc) => {
                    let stats = [];
                    if (npc.pussyTraining < 20) {
                      stats.push("fear-5");
                      return stats;
                    }
                    let wet = npc.aroused || npc.lubricatedPussy;
                    if (!wet && npc.pussyTraining < 80) {
                      if (npc.pussyTraining < 40) stats.push("fear+5");
                      else if (npc.pussyTraining < 60) stats.push("fear+10");
                      else stats.push("fear+5");
                    }
                    if (
                      (wet || npc.pussyTraining >= 40) &&
                      npc.pussyTraining < 75
                    )
                      stats.push("pussyTraining+5");
                    if (wet && npc.pussyTraining >= 60) stats.push("fear-5");
                    if (npc.pussyTraining >= 80) {
                      stats.push("+aroused");
                      stats.push("freedomWish-10");
                      stats.push("lust+5%");
                    }
                    return stats;
                  },
                  showNpcStats: true,
                  next: () => afterStrip().pushDickVag.next,
                  altOptions: (npc, current) => {
                    if (Temporary().cockEntered) {
                      Variables().npcInteractionRoute =
                        "slave.pushDown.strip.pushDickVag.ram";
                      return current.ram.next as NpcInteractionOptions;
                    }
                    return current;
                  },
                },
                ram: {
                  optionText: "🍆 Just ram it in.",
                  contents: `<<if $npc.pussyTraining lt 80>>\
                      Your dick pierces $npc.name's insides as you forcefully penetrate $npc.pronoun.
                      $npc.GenPronoun starts crying and whimpering.
                    <<else>>\
                      You slam the whole thing inside filling up $npc.possessive vagina.
                      $npc.GenPronoun looks surprised<<emoji 😲>> with $npc.possessive $npc.eyeColor eyes wide open.
                    <</if>><<checkNpcVirgin genital>>`,
                  npcStats: (npc) => {
                    let stats =
                      npc.pussyTraining < 80
                        ? ["fear+50", "freedomWish+25"]
                        : ["fear+5", "lust+2%"];
                    if (npc.pussyTraining < 50) stats.push("pussyTraining%+60");
                    else if (npc.pussyTraining < 60)
                      stats.push("pussyTraining%+70");
                    else if (npc.pussyTraining < 70)
                      stats.push("pussyTraining%+80");
                    else if (npc.pussyTraining < 80)
                      stats.push("pussyTraining%+90");
                    return stats;
                  },
                  showNpcStats: true,
                  next: {
                    slow: {
                      optionText: "🦥 Fuck $npc.pronoun slowly.",
                      contents: `You try your best in slowly going in and out of $npc.name's $npc.age year old $npc.genitals.
                        <<if $npc.pussyTraining lt 20>>\
                          $npc.GenPronoun keeps crying<<if $npc.age gt 0>> and pushing you while saying "Stop! It hurts!!"<</if>>. <<emoji 😢>>
                        <<elseif $npc.pussyTraining lt 40>>\
                          $npc.name seems to have a hard time taking your dick while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                        <<elseif $npc.lust lt 30>>\
                          $npc.GenPronoun seems to be able to take you in and, after a while, even starts to feel good for $npc.pronoun.\
                          <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you make love to her. <<emoji ♥>><</if>>
                        <<else>>\
                          $npc.name is visibly enjoying your cock. You can hear $npc.pronoun loudly moaning:
                          "Ah!...Ah!...<<if $npc.age gt 4>> Yes... Please don't stop!!<</if>>\
                          <<if $npc.age gt 3 && $npc.love gte 50>>I love you <<npcAddressPlayer>><<emoji ♥>><</if>>".\
                        <</if>>`,
                      minutesCost: 30,
                      npcStats: (npc) => {
                        if (npc.pussyTraining < 20)
                          return [
                            "fear+20",
                            "freedomWish+5",
                            "pussyTraining%+40",
                          ];
                        if (npc.pussyTraining < 40)
                          return ["fear+5", "pussyTraining%+50"];
                        let stats = [
                          "pussyTraining%+60",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().pushDickVag.next.ram.next,
                    },
                    fast: {
                      optionText: "⏩ Fast piston.",
                      contents: `You trust your dick into $npc.name's $npc.genitals. Making $npc.genPronoun bounce with a fast pelvic piston movement.
                      <<run Player.manageEnergy(3)>>\
                      <<if $npc.pussyTraining lt 40>>\
                        $npc.GenPronoun <<if $npc.age gt 0>>pushes you while crying<<else>>cries<</if>> desperately. <<emoji 😭>>
                      <<elseif $npc.pussyTraining lt 60>>\
                        $npc.name seems to have a hard time taking your thrusts while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                      <<elseif $npc.lust lt 60>>\
                        $npc.GenPronoun seems to be able to withstand your piston and, after a while, even starts to feel good for $npc.pronoun.\
                        <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you screw $npc.pronoun.<<emoji ♥>><</if>>
                      <<else>>\
                        $npc.name keeps turning $npc.possessive head from side to side due to the immense pleasure $npc.genPronoun's experiencing.
                        "Ah!, Ah!, Ah!<<if $npc.age gt 3 && $npc.love gte 50>>, <<npcAddressPlayer>>!...<<emoji 💕>><</if>>"<<emoji 😫>>\
                      <</if>>`,
                      minutesCost: 10,
                      npcStats: (npc) => {
                        if (npc.pussyTraining < 40)
                          return [
                            "fear+40",
                            "freedomWish+10",
                            "pussyTraining%+60",
                            "hunger+5",
                          ];
                        if (npc.pussyTraining < 60)
                          return ["fear+5", "pussyTraining%+80", "hunger+5"];
                        let stats = [
                          "pussyTraining+10",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                          "hunger+5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().pushDickVag.next.ram.next,
                    },
                    cumInside: {
                      optionText: "⛽ Cum inside $npc.pronoun.",
                      contents: `You release your seed inside $npc.name's body. Filling up $npc.possessive womb.
                      <<set 
                        Player.manageEnergy(1);
                        $npc.pussySpermAmount++;
                        $player.lust = 0;
                      >>\
                      After shooting all your load you pull out your dick leaving $npc.pronoun with your present inside.`,
                      next: () => afterStrip(),
                    },
                    ...cumOutsideOptions,
                    out: {
                      optionText: "🔙 Pull out",
                      contents: `You pull out your dick on $npc.name`,
                      next: afterStrip,
                    },
                  },
                },
                back: {
                  optionText: "🔙 Pull back",
                  contents: `You pull back leaving $npc.pronoun naked on the ground.`,
                  next: afterStrip,
                },
              },
            },
            pushDickAnus: {
              playerRequirements: ["gender=male"],
              settingsRequirements: ["anal"],
              optionText: "🍆 Push your dick into $npc.possessive ass.",
              contents: `You press your dick against $npc.possessive asshole.`,
              next: {
                carefully: {
                  optionText: "🍬 Carefully press it in.",
                  minutesCost: 2,
                  contents: `<<if $npc.anusTraining lt 20>>\
                      You sink your dick in $npc.name's ass. But $npc.possessive tight asshole doesn't seem to let you go any further.
                    <<elseif $npc.anusTraining lt 40>>\
                      <<if $npc.lubricatedAss>>\
                        <<set _cockEntered to true>>\
                        You barely manage to enter your cock's head inside $npc.name's ass and it feels really tight! <<emoji 😣>>
                      <<else>>\
                        You try to enter $npc.pronoun but $npc.possessive asshole is not properly lubricated and it hurts $npc.pronoun a little. <<emoji 😫>>
                      <</if>>\
                    <<elseif $npc.anusTraining lt 60>>\
                      <<set _cockEntered to true>>\
                      You slowly enter $npc.possessive asshole as it gets stretched.
                      <<if $npc.lubricatedAss>>\
                        $npc.GenPronoun looks a little troubled<<emoji 😣>>, but it looks like $npc.genPronoun can take it.
                      <<else>>\
                        Your cock hurts $npc.possessive unlubricated anus. A tear runs down $npc.possessive face. <<emoji 😢>>
                      <</if>>\
                    <<elseif $npc.anusTraining lt 80>>\
                      <<set _cockEntered to true>>\
                      <<if $npc.lubricatedAss>>\
                        Your cock easily slides inside $npc.pronoun. $npc.GenPronoun doesn't seem to hate it.
                      <<else>>\
                        $npc.GenPronoun squints $npc.possessive eyes as you penetrate $npc.pronoun. <<emoji 😣>>
                        $npc.Possessive unlubricated anus hurts a little.
                      <</if>>\
                    <<else>>\
                      <<set _cockEntered to true>>\
                      Your cock slides right in as $npc.genPronoun lets out a quiet ~~"Ah!"~~.
                    <</if>>\
                    <<if _cockEntered>>\
                      <<checkNpcVirgin anal>>\
                    <</if>>`,
                  npcStats: (npc) => {
                    let stats = [];
                    if (npc.anusTraining < 20) {
                      stats.push("fear-5");
                      return stats;
                    }
                    if (!npc.lubricatedAss && npc.anusTraining < 80) {
                      if (npc.anusTraining < 40) stats.push("fear+5");
                      else if (npc.anusTraining < 60) stats.push("fear+10");
                      else stats.push("fear+5");
                    }
                    if (npc.lubricatedAss || npc.anusTraining >= 40)
                      stats.push("anusTraining+10");
                    if (npc.lubricatedAss && npc.anusTraining >= 60)
                      stats.push("fear-5");
                    if (npc.anusTraining >= 80) {
                      stats.push("+aroused");
                      stats.push("freedomWish-10");
                      stats.push("lust+5%");
                    }
                    return stats;
                  },
                  showNpcStats: true,
                  next: () => afterStrip().pushDickAnus.next,
                  altOptions: (npc, current) => {
                    if (Temporary().cockEntered) {
                      Variables().npcInteractionRoute =
                        "slave.pushDown.strip.pushDickAnus.ram";
                      return current.ram.next as NpcInteractionOptions;
                    }
                    return current;
                  },
                },
                ram: {
                  optionText: "🍆 Just ram it in.",
                  contents: `<<if $npc.anusTraining lt 80>>\
                      Your dick pierces $npc.name's insides as you forcefully penetrate $npc.pronoun.
                      $npc.GenPronoun starts crying and whimpering.
                    <<else>>\
                      You slam the whole thing inside filling up $npc.possessive rectum.
                      $npc.GenPronoun looks surprised<<emoji 😲>> with $npc.possessive $npc.eyeColor eyes wide open.
                    <</if>><<checkNpcVirgin anal>>`,
                  npcStats: (npc) =>
                    npc.anusTraining < 80
                      ? ["fear+50", "freedomWish+25", "anusTraining%+60"]
                      : ["fear+5", "lust+2%", "anusTraining%+90"],
                  showNpcStats: true,
                  next: {
                    slow: {
                      optionText: "🦥 Fuck $npc.pronoun slowly.",
                      contents: `You try your best in slowly going in and out of $npc.name's $npc.age year old rectum.
                        <<if $npc.anusTraining lt 20>>\
                          $npc.GenPronoun keeps crying<<if $npc.age gt 0>> and pushing you while saying "Stop! It hurts!!"<</if>>. <<emoji 😢>>
                        <<elseif $npc.anusTraining lt 40>>\
                          $npc.name seems to have a hard time taking your dick while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                        <<elseif $npc.lust lt 30>>\
                          $npc.GenPronoun seems to be able to take you in and, after a while, even starts to feel good for $npc.pronoun.\
                          <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you make love to $npc.pronoun. <<emoji ♥>><</if>>
                        <<else>>\
                          $npc.name is visibly enjoying your cock. You can hear $npc.pronoun loudly moaning:
                          "Ah!...Ah!...<<if $npc.age gt 4>> Yes... Please don't stop!!<</if>>\
                          <<if $npc.love gte 50>>I love you <<npcAddressPlayer>><<emoji ♥>>.<</if>>"\
                        <</if>>`,
                      minutesCost: 30,
                      npcStats: (npc) => {
                        if (npc.anusTraining < 20)
                          return [
                            "fear+20",
                            "freedomWish+5",
                            "anusTraining%+40",
                          ];
                        if (npc.anusTraining < 40)
                          return ["fear+5", "anusTraining%+50"];
                        let stats = [
                          "anusTraining%+60",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().pushDickAnus.next.ram.next,
                    },
                    fast: {
                      optionText: "⏩ Fast piston.",
                      contents: `You trust your dick into $npc.name's anus. Making $npc.genPronoun bounce with a fast pelvic piston movement.
                      <<run Player.manageEnergy(3)>>\
                      <<if $npc.anusTraining lt 40>>\
                        $npc.GenPronoun <<if $npc.age gt 0>>pushes you while crying<<else>>cries<</if>> desperately. <<emoji 😭>>
                      <<elseif $npc.anusTraining lt 60>>\
                        $npc.name seems to have a hard time taking your thrusts while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                      <<elseif $npc.lust lt 60>>\
                        $npc.GenPronoun seems to be able to withstand your piston and, after a while, even starts to feel good for $npc.pronoun.\
                        <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you screw $npc.pronoun.<<emoji ♥>><</if>>
                      <<else>>\
                        $npc.name keeps turning $npc.possessive head from side to side due to the immense pleasure $npc.genPronoun's experiencing.
                        "Ah!, Ah!, Ah!<<if $npc.age gt 3 && $npc.love gte 50>>, <<npcAddressPlayer>>!...<<emoji 💕>><</if>>"<<emoji 😫>>\
                      <</if>>`,
                      minutesCost: 10,
                      npcStats: (npc) => {
                        if (npc.anusTraining < 40)
                          return [
                            "fear+40",
                            "freedomWish+10",
                            "anusTraining%+60",
                            "hunger+5",
                          ];
                        if (npc.anusTraining < 60)
                          return ["fear+5", "anusTraining%+80", "hunger+5"];
                        let stats = [
                          "anusTraining+10",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                          "hunger+5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().pushDickAnus.next.ram.next,
                    },
                    cumInside: {
                      optionText: "⛽ Cum inside $npc.pronoun.",
                      contents: `You release your seed inside $npc.name's body. Filling up $npc.possessive bowels.
                      <<set 
                        Player.manageEnergy(1);
                        $npc.assSpermAmount++;
                        $player.lust = 0;
                      >>\
                      After shooting all your load you pull out your dick leaving $npc.pronoun with your present inside.`,
                      next: () => afterStrip(),
                    },
                    ...cumOutsideOptions,
                    out: {
                      optionText: "🔙 Pull out",
                      contents: `You pull out your dick on $npc.name`,
                      next: afterStrip,
                    },
                  },
                },
                back: {
                  optionText: "🔙 Pull back",
                  contents: `You pull back leaving $npc.pronoun naked on the ground.`,
                  next: afterStrip,
                },
              },
            },
            dildoVag: {
              inventoryRequirements: ["dildo"],
              npcRequirements: ["hasPussy"],
              optionText:
                "🥒 Push the dildo into $npc.possessive $npc.genitals",
              contents: `You push the dildo against $npc.possessive $npc.genitals
                <<if $npc.age gt 3 && ($npc.lust lt 30 || $npc.fear gte 40)>>\
                  $npc.GenPronoun panics <<emoji 😨>> as $npc.genPronoun sees the dildo pressing against $npc.pronoun private place.
                <</if>>\
                <<if $npc.aroused>>\
                  The dildo is already getting wet from $npc.name's $npc.genitals juices.
                <</if>>\

                How do you want to proceed?`,
              next: {
                carefully: {
                  optionText: "🍬 Carefully press it in.",
                  minutesCost: 2,
                  contents: `<<if $npc.pussyTraining lt 20>>\
                      You press the dildo in $npc.name's $npc.genitals squishing $npc.pronoun puffy labia on the sides. But it doesn't seem that is gonna go any further than this.
                    <<elseif $npc.pussyTraining lt 40>>\
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        <<set _cockEntered to true>>\
                        You barely manage to enter the dildo's tip inside $npc.name's $npc.genitals but it's still pretty hard to enter!<<emoji 😣>>
                      <<else>>\
                        You try to enter $npc.pronoun but $npc.possessive $npc.genitals is too dry and it hurts $npc.pronoun a little.<<emoji 😫>>
                      <</if>>\
                    <<elseif $npc.pussyTraining lt 60>>\
                      <<set _cockEntered to true>>\
                      You slowly enter $npc.possessive $npc.genitals as it gets stretched.
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        $npc.GenPronoun looks a little troubled<<emoji 😣>>, but it looks like $npc.genPronoun can take it.
                      <<else>>\
                        The dildo hurts $npc.possessive dry vagina. A tear runs down $npc.possessive face.<<emoji 😢>>
                      <</if>>\
                    <<elseif $npc.pussyTraining lt 80>>\
                      <<set _cockEntered to true>>\
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        The dildo easily slides inside $npc.pronoun. $npc.GenPronoun doesn't seem to hate it.
                      <<else>>\
                        $npc.GenPronoun squints $npc.possessive eyes as you penetrate $npc.pronoun.<<emoji 😣>>
                        $npc.Possessive dry pussy hurts a little.
                      <</if>>\
                    <<else>>\
                      <<set _cockEntered to true>>\
                      The dildo slides right in as $npc.genPronoun lets out a quiet ~~"Ah!"~~.
                    <</if>>\
                    <<if _cockEntered>>\
                      <<checkNpcVirgin genital>>\
                    <</if>>`,
                  npcStats: (npc) => {
                    let stats = [];
                    if (npc.pussyTraining < 20) {
                      stats.push("fear-5");
                      return stats;
                    }
                    let wet = npc.aroused || npc.lubricatedPussy;
                    if (!wet && npc.pussyTraining < 80) {
                      if (npc.pussyTraining < 40) stats.push("fear+5");
                      else if (npc.pussyTraining < 60) stats.push("fear+10");
                      else stats.push("fear+5");
                    }
                    if (
                      (wet || npc.pussyTraining >= 40) &&
                      npc.pussyTraining < 75
                    )
                      stats.push("pussyTraining+5");
                    if (wet && npc.pussyTraining >= 60) stats.push("fear-5");
                    if (npc.pussyTraining >= 80) {
                      stats.push("+aroused");
                      stats.push("freedomWish-10");
                      stats.push("lust+5%");
                    }
                    return stats;
                  },
                  showNpcStats: true,
                  next: () => afterStrip().dildoVag.next,
                  altOptions: (npc, current) => {
                    if (Temporary().cockEntered) {
                      Variables().npcInteractionRoute =
                        "slave.pushDown.strip.dildoVag.ram";
                      return current.ram.next as NpcInteractionOptions;
                    }
                    return current;
                  },
                },
                ram: {
                  optionText: "🥒 Just ram it in.",
                  contents: `<<if $npc.pussyTraining lt 80>>\
                      The dildo pierces $npc.name's insides as you forcefully penetrate $npc.pronoun.
                      $npc.GenPronoun starts crying and whimpering.
                    <<else>>\
                      You slam the whole thing inside filling up $npc.possessive vagina.
                      $npc.GenPronoun looks surprised<<emoji 😲>> with $npc.possessive $npc.eyeColor eyes wide open.
                    <</if>><<checkNpcVirgin genital>>`,
                  npcStats: (npc) => {
                    let stats =
                      npc.pussyTraining < 80
                        ? ["fear+50", "freedomWish+25"]
                        : ["fear+5", "lust+2%"];
                    if (npc.pussyTraining < 50) stats.push("pussyTraining%+60");
                    else if (npc.pussyTraining < 60)
                      stats.push("pussyTraining%+70");
                    else if (npc.pussyTraining < 70)
                      stats.push("pussyTraining%+80");
                    else if (npc.pussyTraining < 80)
                      stats.push("pussyTraining%+90");
                    return stats;
                  },
                  showNpcStats: true,
                  next: {
                    slow: {
                      optionText: "🦥 Fuck $npc.pronoun slowly with the dildo.",
                      contents: `You try your best in slowly going in and out of $npc.name's $npc.age year old $npc.genitals.
                        <<if $npc.pussyTraining lt 20>>\
                          $npc.GenPronoun keeps crying<<if $npc.age gt 0>> and pushing your hand while saying "Stop! It hurts!!"<</if>>. <<emoji 😢>>
                        <<elseif $npc.pussyTraining lt 40>>\
                          $npc.name seems to have a hard time taking the dildo while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                        <<elseif $npc.lust lt 30>>\
                          $npc.GenPronoun seems to be able to take the dildo in and, after a while, even starts to feel good for $npc.pronoun.\
                          <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you fuck her with your dildo. <<emoji ♥>><</if>>
                        <<else>>\
                          $npc.name is visibly enjoying your dildo in $npc.possessive $npc.genitals. You can hear $npc.pronoun loudly moaning:
                          "Ah!...Ah!...<<if $npc.age gt 4>> Yes... Please don't stop!!<</if>>\
                          <<if $npc.age gt 3 && $npc.love gte 50>>I love you <<npcAddressPlayer>><<emoji ♥>><</if>>".\
                        <</if>>`,
                      minutesCost: 30,
                      npcStats: (npc) => {
                        if (npc.pussyTraining < 20)
                          return [
                            "fear+20",
                            "freedomWish+5",
                            "pussyTraining%+40",
                          ];
                        if (npc.pussyTraining < 40)
                          return ["fear+5", "pussyTraining%+50"];
                        let stats = [
                          "pussyTraining%+60",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().dildoVag.next.ram.next,
                    },
                    fast: {
                      optionText: "⏩ Fast piston.",
                      contents: `You trust the dildo into $npc.name's $npc.genitals. Making $npc.genPronoun bounce with a fast piston movement.
                      <<run Player.manageEnergy(1)>>\
                      <<if $npc.pussyTraining lt 40>>\
                        $npc.GenPronoun <<if $npc.age gt 0>>pushes you while crying<<else>>cries<</if>> desperately.<<emoji 😭>>
                      <<elseif $npc.pussyTraining lt 60>>\
                        $npc.name seems to have a hard time taking your thrusts while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                      <<elseif $npc.lust lt 60>>\
                        $npc.GenPronoun seems to be able to withstand your piston and, after a while, even starts to feel good for $npc.pronoun.\
                        <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you screw $npc.pronoun.<<emoji ♥>><</if>>
                      <<else>>\
                        $npc.name keeps turning $npc.possessive head from side to side due to the immense pleasure $npc.genPronoun's experiencing.
                        "Ah!, Ah!, Ah!<<if $npc.age gt 3 && $npc.love gte 50>>, <<npcAddressPlayer>>!...<<emoji 💕>><</if>>"<<emoji 😫>>\
                      <</if>>`,
                      minutesCost: 10,
                      npcStats: (npc) => {
                        if (npc.pussyTraining < 40)
                          return [
                            "fear+40",
                            "freedomWish+10",
                            "pussyTraining%+60",
                            "hunger+5",
                          ];
                        if (npc.pussyTraining < 60)
                          return ["fear+5", "pussyTraining%+80", "hunger+5"];
                        let stats = [
                          "pussyTraining+10",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                          "hunger+5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().dildoVag.next.ram.next,
                    },
                    out: {
                      optionText: "🔙 Pull out",
                      contents: `You pull the dildo out of $npc.name's $npc.genitals`,
                      next: afterStrip,
                    },
                  },
                },
                back: {
                  optionText: "🔙 Pull back",
                  contents: `You pull back leaving $npc.pronoun naked on the ground.`,
                  next: afterStrip,
                },
              },
            },
            dildoAnus: {
              inventoryRequirements: ["dildo"],
              settingsRequirements: ["anal"],
              optionText: "🥒 Push dildo into $npc.possessive ass.",
              contents: `You press the dildo against $npc.possessive asshole.`,
              next: {
                carefully: {
                  optionText: "🍬 Carefully press it in.",
                  minutesCost: 2,
                  contents: `<<if $npc.anusTraining lt 20>>\
                      You sink the dildo in $npc.name's ass. But $npc.possessive tight asshole doesn't seem to let you go any further.
                    <<elseif $npc.anusTraining lt 40>>\
                      <<if $npc.lubricatedAss>>\
                        <<set _cockEntered to true>>\
                        You barely manage to enter the dildo's tip inside $npc.name's ass but it's still pretty hard to enter! <<emoji 😣>>
                      <<else>>\
                        You try to enter $npc.pronoun but $npc.possessive asshole is not properly lubricated and it hurts $npc.pronoun a little. <<emoji 😫>>
                      <</if>>\
                    <<elseif $npc.anusTraining lt 60>>\
                      <<set _cockEntered to true>>\
                      You slowly enter $npc.possessive asshole as it gets stretched.
                      <<if $npc.lubricatedAss>>\
                        $npc.GenPronoun looks a little troubled<<emoji 😣>>, but it looks like $npc.genPronoun can take it.
                      <<else>>\
                        The dildo hurts $npc.possessive unlubricated anus. A tear runs down $npc.possessive face. <<emoji 😢>>
                      <</if>>\
                    <<elseif $npc.anusTraining lt 80>>\
                      <<set _cockEntered to true>>\
                      <<if $npc.lubricatedAss>>\
                        The dildo easily slides inside $npc.pronoun. $npc.GenPronoun doesn't seem to hate it.
                      <<else>>\
                        $npc.GenPronoun squints $npc.possessive eyes as you penetrate $npc.pronoun. <<emoji 😣>>
                        $npc.Possessive unlubricated anus hurts a little.
                      <</if>>\
                    <<else>>\
                      <<set _cockEntered to true>>\
                      The dildo slides right in as $npc.genPronoun lets out a quiet ~~"Ah!"~~.
                    <</if>>\
                    <<if _cockEntered>>\
                      <<checkNpcVirgin anal>>\
                    <</if>>`,
                  npcStats: (npc) => {
                    let stats = [];
                    if (npc.anusTraining < 20) {
                      stats.push("fear-5");
                      return stats;
                    }
                    if (!npc.lubricatedAss && npc.anusTraining < 80) {
                      if (npc.anusTraining < 40) stats.push("fear+5");
                      else if (npc.anusTraining < 60) stats.push("fear+10");
                      else stats.push("fear+5");
                    }
                    if (npc.lubricatedAss || npc.anusTraining >= 40)
                      stats.push("anusTraining+10");
                    if (npc.lubricatedAss && npc.anusTraining >= 60)
                      stats.push("fear-5");
                    if (npc.anusTraining >= 80) {
                      stats.push("+aroused");
                      stats.push("freedomWish-10");
                      stats.push("lust+5%");
                    }
                    return stats;
                  },
                  showNpcStats: true,
                  next: () => afterStrip().dildoAnus.next,
                  altOptions: (npc, current) => {
                    if (Temporary().cockEntered) {
                      Variables().npcInteractionRoute =
                        "slave.pushDown.strip.dildoAnus.ram";
                      return current.ram.next as NpcInteractionOptions;
                    }
                    return current;
                  },
                },
                ram: {
                  optionText: "🥒 Just ram it in.",
                  contents: `<<if $npc.anusTraining lt 80>>\
                      The dildo pierces $npc.name's insides as you forcefully penetrate $npc.pronoun.
                      $npc.GenPronoun starts crying and whimpering.
                    <<else>>\
                      You slam the whole thing inside filling up $npc.possessive rectum.
                      $npc.GenPronoun looks surprised<<emoji 😲>> with $npc.possessive $npc.eyeColor eyes wide open.
                    <</if>><<checkNpcVirgin anal>>`,
                  npcStats: (npc) =>
                    npc.anusTraining < 80
                      ? ["fear+50", "freedomWish+25", "anusTraining%+60"]
                      : ["fear+5", "lust+2%", "anusTraining%+90"],
                  showNpcStats: true,
                  next: {
                    slow: {
                      optionText:
                        "🦥 Fuck $npc.pronoun bottom slowly with the dildo.",
                      contents: `You try your best in slowly going in and out of $npc.name's $npc.age year old rectum.
                        <<if $npc.anusTraining lt 20>>\
                          $npc.GenPronoun keeps crying<<if $npc.age gt 0>> and pushing your hand while saying "Stop! It hurts!!"<</if>>.<<emoji 😢>>
                        <<elseif $npc.anusTraining lt 40>>\
                          $npc.name seems to have a hard time taking the dildo while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                        <<elseif $npc.lust lt 30>>\
                          $npc.GenPronoun seems to be able to take it in and, after a while, even starts to feel good for $npc.pronoun.\
                          <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you move the dildo in and out of $npc.possessive ass.<<emoji ♥>><</if>>
                        <<else>>\
                          $npc.name is visibly enjoying the dildo. You can hear $npc.pronoun loudly moaning:
                          "Ah!...Ah!...<<if $npc.age gt 4>> Yes... Please don't stop!!<</if>>\
                          <<if $npc.love gte 50>>I love you <<npcAddressPlayer>><<emoji ♥>>.<</if>>"\
                        <</if>>`,
                      minutesCost: 30,
                      npcStats: (npc) => {
                        if (npc.anusTraining < 20)
                          return [
                            "fear+20",
                            "freedomWish+5",
                            "anusTraining%+40",
                          ];
                        if (npc.anusTraining < 40)
                          return ["fear+5", "anusTraining%+50"];
                        let stats = [
                          "anusTraining%+60",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().dildoAnus.next.ram.next,
                    },
                    fast: {
                      optionText: "⏩ Fuck $npc.pronoun fast.",
                      contents: `You trust the dildo into $npc.name's anus. Making $npc.genPronoun bounce with a fast piston movement.
                      <<run Player.manageEnergy(1)>>\
                      <<if $npc.anusTraining lt 40>>\
                        $npc.GenPronoun <<if $npc.age gt 0>>pushes your hand while crying<<else>>cries<</if>> desperately. <<emoji 😭>>
                      <<elseif $npc.anusTraining lt 60>>\
                        $npc.name seems to have a hard time taking your thrusts while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun with the dildo.
                      <<elseif $npc.lust lt 60>>\
                        $npc.GenPronoun seems to be able to withstand your piston and, after a while, even starts to feel good for $npc.pronoun.\
                        <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you screw $npc.pronoun.<<emoji ♥>><</if>>
                      <<else>>\
                        $npc.name keeps turning $npc.possessive head from side to side due to the immense pleasure $npc.genPronoun's experiencing.
                        "Ah!, Ah!, Ah!<<if $npc.age gt 3 && $npc.love gte 50>>, <<npcAddressPlayer>>!...<<emoji 💕>><</if>>"<<emoji 😫>>\
                      <</if>>`,
                      minutesCost: 10,
                      npcStats: (npc) => {
                        if (npc.anusTraining < 40)
                          return [
                            "fear+40",
                            "freedomWish+10",
                            "anusTraining%+60",
                            "hunger+5",
                          ];
                        if (npc.anusTraining < 60)
                          return ["fear+5", "anusTraining%+80", "hunger+5"];
                        let stats = [
                          "anusTraining+10",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                          "hunger+5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().dildoAnus.next.ram.next,
                    },
                    gentleRubSlaveGen: {
                      optionText: "👋 Gently rub $npc.name's $npc.genitals.",
                      minutesCost: 5,
                      contents: `You slowly rub $npc.name's $npc.genitals while keeping the dildo in her bottom, moving only slowly.
                        <<if $npc.hasPussy>>\
                          @@color:deeppink;$npc.Possessive cunny gets wetter@@\
                        <</if>>\
                        <<if $npc.hasPenis>>\
                          @@color:deeppink;$npc.GenPronoun gets harder@@\
                        <</if>>\
                        <<if $npc.anusTraining lt 20>>\
                          despite the pain in $npc.pronoun bottom.  $npc.GenPronoun keeps crying the pleasure and pain is tormenting $npc.pronoun.<<emoji 😢>>
                        <<elseif $npc.anusTraining lt 40>>\
                          even though $npc.name seems to have a hard time taking the dildo.
                        <<elseif $npc.lust lt 30>>\
                          and $npc.pronoun body even starts to enjoy the feel of the dildo in $npc.pronoun bottom.  $npc.GenPronoun is very confused and conflicted by the mix of feelings. \
                          <<if $npc.love gte 75>>$npc.GenPronoun smiles at you as you move the dildo in and out of $npc.possessive ass.<<emoji ♥>><</if>>
                        <<else>>\
                          and $npc.name is visibly enjoying the anal dildo as you rub $npc.pronoun. You can hear $npc.pronoun loudly moaning:
                          "Ah!...Ah!...<<if $npc.age gt 4>> Yes... Please don't stop!!<</if>>\
                          <<if $npc.love gte 50>>I love you <<npcAddressPlayer>><<emoji ♥>>.<</if>>"\
                        <</if>>`,
                      npcStats: (npc) => {
                        if (npc.anusTraining < 20)
                          return [
                            "fear+5",
                            "lust+10%",
                            "+aroused",
                            "freedomWish+5",
                            "anusTraining%+10",
                          ];
                        if (npc.anusTraining < 40)
                          return [
                            "fear+5",
                            "lust+10%",
                            "+aroused",
                            "anusTraining%+10",
                          ];
                        let stats = [
                          "anusTraining%+40",
                          "lust+10%",
                          "+aroused",
                          "fear-5",
                        ];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      showNpcStats: true,
                      next: () => afterStrip().dildoAnus.next.ram.next,
                    },
                    out: {
                      optionText: "🔙 Pull out",
                      contents: `You pull out the dildo from $npc.name's ass`,
                      next: afterStrip,
                    },
                  },
                },
                back: {
                  optionText: "🔙 Pull back",
                  contents: `You pull back leaving $npc.pronoun naked on the ground.`,
                  next: afterStrip,
                },
              },
            },
            rubPussies: {
              playerRequirements: ["gender=female"],
              npcRequirements: ["hasPussy"],
              optionText: "🌮 Trib pussies together.",
              minutesCost: 20,
              contents: `You open $npc.pronoun legs and you start rubbing your pussy against <<if $npc.gender != 'male'>>hers<<else>>his<</if>>.
                <<if $npc.lust lt 35>>\
                  $npc.name doesn't seem to dislike it.
                <<elseif $npc.lust lt 65>>\
                  $npc.name doesn't resist at all. $npc.GenPronoun lets you have your way and seems to enjoy it while closing $npc.pronoun eyes. <<emoji 😩>>
                  <<if $npc.love gte 50>>$npc.GenPronoun smiles at you as you make love to $npc.pronoun. <<emoji ♥>><</if>>
                <<else>>\
                  $npc.name starts moaning along. "Ah!...Ah!..." <<emoji 😩>>
                  <<if $npc.love gt 50>>
                    $npc.genPronoun smiles at you and says: "I love you <<npcAddressPlayer>>!!<<emoji ♥>>"
                  <</if>>
                <</if>>`,
              npcStats: (npc) => {
                let stats = ["fear-5", "lust+10%", "+aroused", "freedomWish-2"];
                if (npc.lust >= 65 && npc.love > 50) stats = ["love+5"];
                return stats;
              },
              showNpcStats: true,
              next: afterStrip,
            },
            gentleRubSlaveGen: {
              optionText: "👋 Gently rub $npc.name's $npc.genitals.",
              minutesCost: 5,
              contents: `You slowly rub $npc.name's $npc.genitals.
                After a while, \
                <<if $npc.hasPussy>>\
                  @@color:deeppink;$npc.possessive cunny gets wet@@.
                <</if>>\
                <<if $npc.hasPenis>>\
                  @@color:deeppink;$npc.genPronoun gets hard@@.\
                <</if>>`,
              npcStats: ["fear-5", "lust+20%", "+aroused"],
              showNpcStats: true,
              next: afterStrip,
            },
            getPenPussy: {
              playerRequirements: ["gender=female"],
              npcRequirements: ["hasPenis", "aroused"],
              optionText: "🤙 Have sex with $npc.name.",
              minutesCost: 20,
              contents: `You grab $npc.name erected penis and enter it in your pussy and start bouncing and enjoying $npc.possessive dick.
                After a while you start going faster and the $npc.title starts panting.

                It looks like $npc.genPronoun's about to cum. What do you do?<<checkNpcVirgin genital>>`,
              npcStats: ["fear-5", "lust+30%"],
              showNpcStats: true,
              next: {
                endure: {
                  optionText: "💪 Tell him to endure it.",
                  minutesCost: 10,
                  contents: `<<playerSay "Don't you dare cum in me">>

                    $npc.name looks troubled but obeys.`,
                  npcStats: ["fear+1", "obedience+2"],
                  showNpcStats: true,
                  playerStats: ["lust-10"],
                  next: () => afterStrip().getPenPussy.next,
                  stopOption: "🛑 Stop right there.",
                },
                cum: {
                  optionText: "👍 Let $npc.pronoun cum.",
                  contents: `<<if $npc.age lt 14>>\
                      You feel $npc.name shaking while $npc.genPronoun has a nice dry cum.
                    <<else>>\
                      You feel $npc.possessive dick shooting $npc.possessive seed inside you.
                    <</if>>`,
                  npcStats: [
                    "lust+30%",
                    "love+10",
                    "freedomWish-10",
                    "hunger+10",
                    "-aroused",
                  ],
                  playerStats: ["lust-10"],
                  showNpcStats: true,
                  stopOption: "💤 Let $npc.pronoun rest.",
                },
              },
              stopOption: "🛑 Stop right there.",
            },
            getPenAss: {
              npcRequirements: ["hasPenis", "aroused"],
              settingsRequirements: ["anal"],
              optionText:
                "🍆 Insert $npc.possessive erected penis in your ass.",
              minutesCost: 20,
              contents: `You grab $npc.name erected penis and enter it in your asshole and start bouncing and enjoying $npc.possessive dick.
                After a while you start going faster and the $npc.title starts panting.

                It looks like $npc.genPronoun's about to cum. What do you do?<<checkNpcVirgin genital>>`,
              npcStats: ["fear-5", "lust+30%"],
              showNpcStats: true,
              next: {
                endure: {
                  optionText: "💪 Tell $npc.pronoun to endure it.",
                  minutesCost: 10,
                  contents: `<<playerSay "Don't you dare cum in me">>

                    $npc.name looks troubled but obeys.`,
                  npcStats: ["fear+1", "obedience+2"],
                  showNpcStats: true,
                  playerStats: ["lust-10"],
                  next: () => afterStrip().getPenAss.next,
                  stopOption: "🛑 Stop right there.",
                },
                cum: {
                  optionText: "👍 Let him cum.",
                  contents: `<<if $npc.age lt 14>>\
                      You feel $npc.name shaking while he has a nice dry cum.
                    <<else>>\
                      You feel his dick shooting his seed in your bowels.
                    <</if>>`,
                  npcStats: [
                    "lust+30%",
                    "love+10",
                    "freedomWish-10",
                    "hunger+10",
                    "-aroused",
                  ],
                  playerStats: ["lust-10"],
                  showNpcStats: true,
                  stopOption: "💤 Let $npc.pronoun rest.",
                },
              },
              stopOption: "🛑 Stop right there.",
            },
            applyLubeAss: {
              settingsRequirements: ["anal"],
              inventoryRequirements: ["lube"],
              npcRequirements: ["!lubricatedAss"],
              optionText: "💧 Apply lube to $npc.name's ass.",
              minutesCost: 2,
              contents:
                "You squeeze some lube from the tube and thoroughly apply it to $npc.name's asshole making it nice and slippery.",
              npcStats: ["+lubricatedAss"],
              next: afterStrip,
            },
            applyLubePussy: {
              inventoryRequirements: ["lube"],
              npcRequirements: ["hasPussy", "!lubricatedPussy"],
              optionText: "💧 Apply lube to $npc.name's pussy.",
              minutesCost: 2,
              contents: `You squeeze some lube from the tube and thoroughly apply it to $npc.name's pussy making it nice and slippery.
                  It seems that your rubbing has caused a faint reaction in $npc.pronoun`,
              npcStats: ["+lubricatedPussy", "lust+1%"],
              showNpcStats: true,
              next: afterStrip,
            },
          },
        },
        stealClothes: {
          optionText: "🖐 Strip $npc.pronoun and keep $npc.possessive clothes.",
          contents: null,
          npcStats: ["-haveClothes"],
          next: () =>
            window.Interactions.slave.options["pushDown"].next["strip"].next,
        },
      },
    },
    askLickPus: {
      playerRequirements: ["gender=female"],
      npcRequirements: ["age>0"],
      optionText: "👅 Ask $npc.pronoun to lick your pussy.",
      minutesCost: 30,
      contents: `With your hand on the back of $npc.possessive $npc.hairColor head you approach your pussy to $npc.pronoun face and say:
      "Lick here!"

      <<if $npc.love gte 80>>\
        <<npcSay "Sure thing, <<npcAddressPlayer>>!!">><<emoji ❤>>
        Right after finishing $npc.possessive sentence, $npc.name places $npc.possessive<<if $npc.age lt 7>> little<</if>> hands on your legs as $npc.pronoun approaches his face to your pussy.
        You can see $npc.pronoun $npc.eyeColor loving eyes looking at you while $npc.pronoun mouth is being covered by your crotch as you feel the first contact of $npc.possessive<<if $npc.age lt 7>> little<</if>> tongue on your labia.
        <<if $npc.mouthTraining gte 30>>\
          $npc.name already knows how to pleasure you and focuses on your clit, giving you lots of pleasure. You instinctively press $npc.possessive head towards you while $npc.genPronoun insist on the licking and sucking.
        <<else>>\
          $npc.name randomly licks you between your legs. $npc.GenPronoun's a little clumsy with it but $npc.genPronoun's trying $npc.pronoun best and it feels pretty good.
        <</if>>\
      <<elseif $npc.lust gte 60>>\
        Hearing that makes $npc.pronoun aroused and blushes at the thought.
        $npc.name nods and quickly throws <<- $npc.pronoun>>self between your legs and starts licking with vigor.
        <<if $npc.mouthTraining gte 30>>\
          $npc.name already knows how to pleasure you and focuses on your clit, giving you lots of pleasure. You instinctively press $npc.possessive head towards you while $npc.genPronoun insist on the licking and sucking.
        <<else>>\
          $npc.name randomly licks you between your legs. $npc.GenPronoun's a little clumsy with it but $npc.genPronoun's trying $npc.pronoun best and it feels pretty good.
        <</if>>\
      <<else>>\
        <<set _unwilling to true>>\
        <<if $npc.obedience lt 30 && $npc.mouthTraining lt 30>>\
          <<set _refused = true>>\
          <<if $npc.age lt 5>>\
            $npc.name shakes $npc.possessive head, refusing your request.<<emoji 😟>>
          <<else>>\
            <<npcSay "Eww! No!">><<emoji 😟>>
          <</if>>\
        <<elseif $npc.mouthTraining lt 60>>\
          <<if $npc.mouthTraining gte 30>> $npc.name has no problem approaching and licking your pussy. $npc.GenPronoun's pretty used to it by now.
          $npc.GenPronoun<<else>>$npc.name<</if>> gives you random licks to your labia, some of them ends up rubbing your clit giving you some little peaks of pleasure.
          $npc.GenPronoun's not too shabby, although $npc.genPronoun doesn't put too much passion into it and seems like $npc.genPronoun's doing some chore. But feels pretty good for you anyway.
        <<else>>\
          $npc.name's no amateur about this, $npc.genPronoun already knows how to please you.
          $npc.GenPronoun starts by sinking $npc.possessive tongue under your labia and lick inside. You feel $npc.possessive<<if $npc.age lt 7>> little<</if>> warm lips over your labia while $npc.pronoun does it.
          $npc.GenPronoun can surely taste your flavor and $npc.genPronoun has to gulp down the excess of saliva and love juice more than once during the process.
        <</if>>\
      <</if>>`,
      npcStats(npc) {
        let temp = Temporary();
        if (temp.refused) return null;
        let stats = ["mouthTraining+10", "fear-5", "hunger-1"];
        if (!temp.unwilling) stats.push("lust+10%");
        if (npc.mouthTraining >= 60) stats.push("hunger-2");
        return stats;
      },
      showNpcStats: true,
      next() {
        let thisPunish: NpcInteraction = {
          optionText: "",
          contents: "",
        };
        Object.assign(thisPunish, punishment);
        Variables().punishReason = "refusing your request";
        thisPunish.canBeShown = () => Temporary().refused;
        return {
          pushDown: window.Interactions.slave.options["pushDown"],
          more: {
            canBeShown: () => !Temporary().refused,
            optionText: "👅 keep going.",
            minutesCost: 30,
            contents: `<<playerSay "Don't stop. Keep licking me down there.">>
            $npc.name obeys and keeps licking you making lots of lewd noises. $npc.GenPronoun's face gets covered by your juices more and more as it keeps liking.`,
            npcStats(npc) {
              let stats = ["mouthTraining+10", "fear-5", "hunger-1"];
              if (npc.love > 80 || npc.lust > 60) stats.push("lust+10%");
              return stats;
            },
            showNpcStats: true,
            next: () =>
              (
                window.Interactions.slave.options["askLickPus"]
                  .next as CallableFunction
              )(),
          },
          punish: thisPunish,
        };
      },
    },
    penToMouth: {
      playerRequirements: ["gender=male"],
      npcRequirements: ["age>0"],
      optionText: "👄🍆 Put your dick in $npc.possessive mouth.",
      contents: `You place a hand on the back of $npc.possessive $npc.hairColor head and with the other hand you guide your erected penis to $npc.possessive mouth.
      <<set _okBj = $npc.love gte 80 || $npc.lust gte 60 || $npc.hunger gte 90 || $npc.obedience gte 30 || $npc.mouthTraining gte 30;
      _willing = $npc.love gte 80 || $npc.lust gte 60>>\
      <<if !_okBj>>\
        <<if $npc.age lt 5>>\
          $npc.name turns $npc.possessive face away, refusing your request.<<emoji 😟>>\
        <<else>>\
          <<npcSay "Eww! No!">><<emoji 😟>>\
        <</if>>\
      <<else>>\
        <<if $npc.mouthTraining lt 60 && $npc.hunger lt 80>>\
          $npc.name <<if _willing>>blushes at the sight of your dick pointing to $npc.possessive mouth and <</if>>starts licking the under your dick head while timidly looking at you with $npc.possessive $npc.eyeColor eyes.<<emoji 🥺>>
          $npc.Possessive<<if $npc.age lt 7>> little<</if>> tongue rubbing and wetting your dick feels really good.\
        <<else>>\
          $npc.name <<if $npc.hunger gt 80>>is so hungry that $npc.genPronoun <</if>>does not hesitate and opens $npc.possessive mouth allowing you to enter.
          You can feel the warmth inside $npc.possessive mouth wrapping around your dick and $npc.possessive lips closing on it.
          $npc.GenPronoun starts suckling on your member and rubbing with $npc.possessive tongue while inside $npc.possessive mouth, <<if $npc.hunger gt 80>>desperate to get whatever sustenance $npc.genPronoun can get, <</if>>making a lot of noise.\
          <<set _sucking = true>>\
        <</if>>\
      <</if>>`,
      npcStats(npc) {
        let temp = Temporary();
        if (!temp.okBj) return null;
        let stats = ["fear-5"];
        if (npc.mouthTraining < 30) stats.push("mouthTraining%+40");
        else stats.push("mouthTraining%+70");
        if (temp.willing) stats.push("lust+10%");
        return stats;
      },
      showNpcStats: true,
      next() {
        let thisPunish: NpcInteraction = {
          optionText: "",
          contents: "",
        };
        Object.assign(thisPunish, punishment);
        Variables().punishReason = "refusing your request";
        thisPunish.canBeShown = () => !Temporary().okBj || Temporary().refused;
        return {
          balls: {
            canBeShown: () => Temporary().okBj,
            optionText: '👅🥚 "Lick my balls."',
            minutesCost: 5,
            contents: `<<set _okBj = true>>\
            $npc.name pushes your dick upwards with $npc.possessive<<if $npc.age lt 7>> little<</if>> hands in order to reach your balls.
            $npc.GenPronoun moves $npc.possessive mouth down to them and starts licking.
            Your balls bounce a little bit with $npc.possessive<<if $npc.age lt 7>> little<</if>> tongue.
            <<if $npc.mouthTraining gte 60>>\
              $npc.GenPronoun then licks all around them while giving you gentle sucks on each ball.\
            <</if>>`,
            npcStats: ["fear-5", "mouthTraining%+40"],
            showNpcStats: true,
            next: afterPenToMouth,
          },
          shaft: {
            canBeShown: () => Temporary().okBj,
            optionText: '👅🍆 "Lick along my shaft."',
            minutesCost: 5,
            contents: `<<set _okBj = true>>\
           $npc.name grabs your dick with $npc.possessive hands and licks you under your shaft.
           Painting your dick with $npc.possessive saliva.
           <<if $npc.mouthTraining gte 60>>\
             Then $npc.genPronoun slowly slides $npc.possessive tongue from head to base using your cock's entire length.
             And then moves back to the head doing rapid little licks along the way.
            <</if>>`,
            npcStats(npc) {
              let stats = ["fear-5", "lust+3%"];
              if (npc.mouthTraining < 30) stats.push("mouthTraining%+40");
              else stats.push("mouthTraining%+70");
              return stats;
            },
            showNpcStats: true,
            next: afterPenToMouth,
          },
          deep: {
            canBeShown: () => Temporary().okBj && !Temporary().refused,
            optionText: "🐍 Push it all the way",
            minutesCost: 20,
            contents: `<<set _refused = $npc.love lt 80 && $npc.lust lt 60 && $npc.mouthTraining lt 60 && $npc.hunger lt 80 && $npc.fear lt 80;
            _okBj = _refused ? ($npc.lust gte 40 || $npc.love gte 30) : true;>>\
            You push your dick into $npc.possessive mouth. As much as you can.
            <<if _refused>>\
              $npc.name immediately pushes you and takes your dick out of $npc.possessive mouth while coughing.
              <<if $npc.age gte 4>>\
                <<npcSay "Don't do that!!">>
              <</if>>\
              <<if !_okBj>>\
                $npc.name steps back surprised by the sudden thrust.
                <<if $npc.age gte 4>>\
                  <<npcSay "I don't want to do this anymore...">>
                <<else>>\
                  It seems that $npc.genPronoun doesn't want to continue sucking you.\
                <</if>>\
              <</if>>\
            <<else>>\
              <<if $npc.hunger gt 80>>\
                $npc.name is so hungry that $npc.genPronoun allows you to \
              <<elseif $npc.fear gt 80>>\
                $npc.name is so scared of you that $npc.genPronoun doesn't fight as you\
              <<else>>\
                $npc.name looks surprised but allows you to \
              <</if>>\
              penetrate $npc.possessive throat.
              $npc.GenPronoun sucks your cock while its filling all of the space inside $npc.possessive mouth.
              You can feel all of $npc.possessive insides from the lips pursed near the base of your cock all the way to $npc.pronoun throat.
              <<if $npc.lust gte 80>>\
                It doesn't take long until $npc.genPronoun has to retreat for air but $npc.possessive high lust <<if $npc.hunger gt 80>>and hunger <</if>>makes $npc.pronoun gobble your dick up again and again.\
                <<set _sucking = true>>\
              <<elseif $npc.fear gte 80>>\
                She is terrified of you, but it doesn't take long until $npc.genPronoun has to retreat for air.  Fear that you will hurt her makes $npc.pronoun gobble your dick up again and again.\
                <<set _sucking = true>>\
              <<else>>\
                $npc.GenPronoun tries to give you as much pleasure as possible but in the end $npc.genPronoun has to take it out making a big breath of air afterwards.\
              <</if>>\
              <<if $npc.hunger gt 80 && $npc.age gt 3>>$npc.GenPronoun is so hungry that her big $npc.eyeColor eyes look up at you, begging you to cum and give her at least some sustenance.<</if>>\
            <</if>>`,
            altMinutes: (current) => (Temporary().refused ? 1 : current),
            npcStats(npc) {
              let temp = Temporary();
              if (temp.refused) return temp.okBj ? ["fear+5"] : ["fear+10"];
              return [npc.lust >= 80 ? "mouthTraining+20" : "mouthTraining+10"];
            },
            showNpcStats: true,
            next: afterPenToMouth,
          },
          punish: thisPunish,
          suck: {
            canBeShown: () => Temporary().okBj,
            optionText: '👄🍆 "Suck it"',
            minutesCost: 10,
            contents: `$npc.name places $npc.pronoun lips back to the tip of your dick and you help $npc.pronoun inserting it into $npc.possessive mouth.
            <<set
              _okBj = true
              _sucking = true
            >>\
            <<if $npc.mouthTraining gte 50>>\
              $npc.GenPronoun then starts sucking and jerking while your dick goes in and out of $npc.possessive mouth.
              You can see $npc.pronoun head bobbing down on you at the rhythm of your pleasure peaks.\
            <<else>>\
              $npc.name sucks and licks your tip. Feels good, but you think it could be better. So you grab $npc.possessive head with both hands and penetrate $npc.possessive lips a little more than $npc.genPronoun was doing.\
            <</if>>\
            <<if $npc.hunger gte 80>>\
              $npc.GenPronoun looks up at you, so hungry that she sucks desperately on your cock.\
            <</if>>\
            `,
            npcStats: (npc) => afterPenToMouth().shaft.npcStats(npc),
            showNpcStats: true,
            next: afterPenToMouth,
          },
          cumInside: {
            canBeShown: () => Temporary().okBj && Temporary().sucking,
            optionText: "⛽ Cum inside $npc.possessive mouth.",
            contents: `You reach your climax and release your seed inside $npc.name's mouth.
            <<set 
              Player.manageEnergy(1);
              $player.lust = 0;
            >>\
            <<if $npc.hunger gte 50 || $npc.lust gte 80>>\
              $npc.GenPronoun gulps all of your load directly after each spurt.
            <<else>>\
              $npc.GenPronoun does not seem to appreciate your sperm very much and quickly retreats while coughing and spitting.
            <</if>>`,
            npcStats: (npc) =>
              npc.hunger >= 50 || npc.lust >= 80 ? ["hunger-5"] : null,
            showNpcStats: true,
            next: () => afterStrip(),
          },
          ...cumOutsideOptions,
        } as NpcInteractionOptions;
      },
    },
    rubToSlaveFace: {
      optionText: "Rub your $player.genitals on $npc.name's face.",
      minutesCost: 10,
      contents: `You grab $npc.name's head and press it between your legs and start rubbing.
        $npc.Possessive nose and lips feel really good on your $player.genitals.
        $npc.GenPronoun looks at you with <<- $player.gender!='male'?$npc.possessive+' now wet':'some precum on '+$npc.possessive>> face. <<emoji 🥺>>
        <<if $npc.hunger gt 50>>$npc.GenPronoun is so hungry that the smell of your precum makes her even more hungry.<</if>>`,
      npcStats: (npc) => {
        let stats = ["fear-1"];
        if (npc.lust >= 50) stats.push("lust+5%");
        if (npc.hunger > 50) stats.push("hunger+2");
        return stats;
      },
      showNpcStats: true,
      next: afterStrip,
    },
    bringUpstairs: {
      locationRequirements: ["basement"],
      npcRequirements: ["freedomWish<=25"],
      optionText: "🚪 Let $npc.name roam the house.",
      altMinutes: () => 2,
      contents: `You carefully open the door letting only $npc.name out of the basement.
      <<if !Person.hasAchievement('beenOnHomeMain')>>\
        $npc.GenPronoun starts exploring each room of your home that $npc.genPronoun has never fully seen.
        <<set $npc.achievements.push('beenOnHomeMain')>>\
      <</if>>\
      <<run Person.setStatus("home slave")>>\
      <<if $npc.love lt 60 && $npc.age gte 1>>\
        The taste of a little more freedom makes $npc.name wanting it even more.
      <</if>>`,
      npcStats: (npc) =>
        npc.love < 60 && npc.age >= 1
          ? ["freedomWish+" + Math.floor(Math.min((npc.age * 25) / 6, 25))]
          : null,
      showNpcStats: true,
      next: {
        up: {
          optionText: "🔼 Go upstairs",
          contents: "<<goto main>>",
          action: true,
        },
      },
      stopOption: "🔽 Return to the basement",
    },
    value: {
      locationRequirements: ["basement"],
      optionText: "💵 See $npc.name's selling value.",
      settingsRequirements: ["slaveSelling"],
      action: true,
      contents: `<<set _dialogTitle = $npc.name + "'s value">>
      <<dialog _dialogTitle>>
          <<set _value = Person.getValue()>>\
          Obedience_value.obedienceRatio: ¤<<- _value.obedience.toFixed(2)>>
          Lust_value.lustRatio: ¤<<- _value.lust.toFixed(2)>>

          <<if $npc.hasPussy>>Pussy Training_value.pussyRatio: ¤<<- _value.pussy.toFixed(2)>>
          <</if>>Anal Training_value.anusRatio: ¤<<- _value.anus.toFixed(2)>>
          Oral Training_value.mouthRatio: ¤<<- _value.mouth.toFixed(2)>>
          <<if $npc.freedomWish>>
          Freedom Wish Penalty: @@color:red;¤<<- Math.abs(_value.freedomWish).toFixed(2)>>@@<</if>><<if _value.virginType>>
          @@color:deeppink;Bonus _value.virginType: ¤<<- _value.virginBonus.toFixed(2)>>@@<</if>><<if  $npc.freedomWish ||  _value.virginType>>
          <</if>>
          Total: ¤<<- _value.total.toFixed(2)>>\

          <span id="spaceAct">\
            <<button "💵 (Space) Sell $npc.name">>\
              <<set _dialogTitle = "Sell "+$npc.name>>\
              <<dialog _dialogTitle>>\
                Are you ''REALLY'' sure you want to sell out $npc.name for ¤<<- _value.total.toFixed(2)>>??
                You won't see $npc.pronoun ever again!!

                <<button "✅ Yes, sell $npc.pronoun">>
                  <<cash _value.total>>
                  <<run Basement.deleteSlave($npc);Dialog.close()>>
                  <<goto basement>>
                <</button>>\
                <span id="escAct">\
                  <<button "❌ (Esc) No!!">>\
                    <<run Dialog.close()>>\
                  <</button>>\
                </span>\
              <</dialog>>
            <</button>>\
          </span>\
          <span id="escAct">\
            <<button "🔙 (Esc) Go back">>\
              <<run Dialog.close()>>\
            <</button>>\
          </span>\
      <</dialog>>`,
    },
  },
  timeIncreaseNpcHunger: true,
};
window.Interactions.slave.options["pushDown"].next.stealClothes.contents =
  window.Interactions.slave.options["pushDown"].next.strip.contents +
  `<<set _item = {
name:'Used clothes(' + $npc.age + ' y.o.)',
description:'Used clothes from a ' + $npc.age + ' year old',
quantity: 1,
tags:["person","clothes","used"]
};
Player.getInventory().add(_item);>>
(_item.description added to your inventory)`;
