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
    You splatter a full load on $npc.pronoun while you hold $npc.name's chin.`,
    next: () => afterStrip(),
  },
};
//Returns the first member in the interaction route that points to the interaction collection.
let baseInteractionRoute = () => Variables().npcInteractionRoute.split(".")[0];
let baseInteractionOptions = () =>
  <NpcInteractionOptions>window.Interactions[baseInteractionRoute()].options;
//Returns the different talk options
let talkOptions = () =>
  window.Interactions[baseInteractionRoute()].options["talk"]
    .next as NpcInteractionOptions;
window.Interactions["slave"] = {
  defaultStopOption: "✋ Leave $npc.pronoun alone",
  contents: "<<include slaveApproach>>",
  options: {
    talk: {
      npcRequirements: ["age>1"],
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
      showIfEmpty: false,
      next: {
        howAreYou: {
          canBeShown: () => !window.Person.hasAchievement("howAreYou"),
          optionText: '👄 "How are you today, $npc.name?"',
          minutesCost: 2,
          contents:
            '<<run Person.setAchievement("howAreYou")>><<personUniqueness howAreYou>>',
          npcStats: ["love+5%", "fear-5"],
          next: talkOptions,
        },
        sexExp: {
          canBeShown: () =>
            window.Person.hasAnyAchievement([
              "playerRealizedNonVirgin",
              "playerNoticedPreviousOralTraining",
            ]) &&
            !window.Person.hasAllAchievements([
              "playerAskedPreviousExperienceDone",
              "playerAskedPreviousExperienceLiked",
            ]),
          optionText: "👀 Ask about previous sex experience.",
          contents: `<<set
            _obs = [];
            if(Person.hasAchievement('playerRealizedNonVirgin'))
              _obs.push("you were not a virgin");
            if(Person.hasAchievement('playerNoticedPreviousOralTraining'))
              _obs.push($player.hasPussy ? "you were so good licking my pussy" : "you sucked my dick so well");
            _playerSay = 'I noticed that ' + _obs.join(' and ') + '. Did you do these things before?';
          >><<playerSay _playerSay>>
          <<if $npc.age lt 5 || $npc.uniqueness.shy>>$npc.name <<if $npc.uniqueness.shy>>blushes and <</if>>nods.<<elseif $npc.uniqueness.naughty>><<npcSay 'Yeah!'>><<emoji 😁>>
          $npc.GenPronoun <<thirdPerson "smiles" "smile">> and <<thirdPerson "looks" "look">> proud about it.

          <<else>><<npcSay '...yes'>><</if>>
          <<playerSay 'So, who was the one that you did it with?'>>
          <<set
            _hp = $npc.uniqueness.homePersons.filter(p => p.naughty);
            _hpSentence = _hp.map(p => Person.getHomePersonName(p.name)).getSentence();
            _hpSentence = $npc.age gt 10 && !$npc.uniqueness.shy ? "I did it with " + _hpSentence : _hpSentence.toUpperFirst();
          >>\
          <<npcSay _hpSentence>>`,
          minutesCost: 5,
          npcStats: ["lust%+40"],
          next: {
            askThingsDone: {
              canBeShown: () =>
                !window.Person.hasAchievement(
                  "playerAskedPreviousExperienceDone"
                ),
              optionText: '❓ "What kinds of things did you do?"',
              minutesCost: 5,
              contents: `<<set
                Person.setAchievement('playerAskedPreviousExperienceDone');
                let hps = $npc.uniqueness.homePersons.filter(p => p.naughty);
                let suckedDick = [];
                let lickedPussy = [];
                let getFuckedAss = [];
                let getFuckedPussy = [];
                let fuckedPussy = [];
                let fuckedAss = [];
                for(var hp of hps){
                  if(Person.getHomePersonSex(hp.name) != 'male'){
                    if(!$npc.mouthVirgin)
                      lickedPussy.push(Person.getHomePersonName(hp.name));
                    if($npc.hasPenis && !$npc.penisVirgin && !Person.hasAchievement('playerTookPenisVirginity'))
                      fuckedPussy.push(Person.getHomePersonName(hp.name));
                  } else {
                    if(!$npc.mouthVirgin)
                      suckedDick.push(Person.getHomePersonName(hp.name));
                    if(!$npc.analVirgin && !Person.hasAchievement('playerTookAnalVirginity'))
                      getFuckedAss.push(Person.getHomePersonName(hp.name));
                    if($npc.hasPussy && !$npc.vaginaVirgin && !Person.hasAchievement('playerTookVaginalVirginity'))
                      getFuckedPussy.push(Person.getHomePersonName(hp.name));
                    if($npc.hasPenis && !$npc.penisVirgin && !Person.hasAchievement('playerTookPenisVirginity'))
                      fuckedAss.push(Person.getHomePersonName(hp.name));
                  }
                }
                let thingsDone = [];
                if(suckedDick.length)
                  thingsDone.push('sucked ' + suckedDick.getSentence() + ' pepee');
                if(lickedPussy.length)
                  thingsDone.push('licked ' + lickedPussy.getSentence() + ' pussy');
                if(getFuckedAss.length)
                  thingsDone.push(getFuckedAss.getSentence() + ' put ' + (getFuckedAss.length > 1 ? 'their' : 'his') + ' pepee in my butt');
                if(getFuckedPussy.length)
                  thingsDone.push(getFuckedPussy.getSentence() + ' put ' + (getFuckedPussy.length > 1 ? 'their' : 'his') + ' pepee in my pussy');
                if(fuckedPussy.length)
                  thingsDone.push('put my pepee in ' + fuckedPussy.getSentence() + ' pussy');
                if(fuckedAss.length)
                  thingsDone.push('put my pepee in ' + fuckedAss.getSentence() + ' butt');
                _say = 'I ' + thingsDone.getSentence();
                _emoji = $npc.uniqueness.shy ? '😳' : ($npc.uniqueness.naughty ? '😃' : '')
              >><<npcSay _say>><<emoji _emoji>>`,
              next: () => talkOptions().sexExp.next as NpcInteractionOptions,
            },
            askLiked: {
              canBeShown: () =>
                !window.Person.hasAchievement(
                  "playerAskedPreviousExperienceLiked"
                ),
              optionText: '❓ "Did you like it?"',
              minutesCost: 5,
              contents:
                "<<set Person.setAchievement('playerAskedPreviousExperienceLiked')>><<personUniqueness likedPreviousNaughty>>",
              next: () => talkOptions().sexExp.next as NpcInteractionOptions,
            },
            back: {
              optionText: "🔙 Go back",
              action: true,
              contents:
                '<<openNpcInteraction $npcInteractionRoute.split(".")[0]>>',
            },
          },
        },
        back: {
          optionText: "🔙 Go back",
          action: true,
          contents: '<<openNpcInteraction $npcInteractionRoute.split(".")[0]>>',
        },
      },
    },
    hug: {
      optionText: "🤗 give a hug to $npc.name.",
      minutesCost: 2,
      contents: `<<personUniqueness hug>>`,
      next: baseInteractionOptions,
    },
    pushDown: {
      optionText: "👇 Push $npc.pronoun down",
      contents: `You push $npc.name down, placing your body over $npc.pronoun.
        <<if $npc.fear gt 25>>\
          $npc.GenPronoun <<thirdPerson "trembles" "tremble">> in fear under your shadow.
        <<elseif $npc.love gt 50>>\
          $npc.GenPronoun <<thirdPerson "leaves" "leave">> <<- $npc.pronoun>>self completely open as $npc.genPronoun <<thirdPerson "smiles" "smile">> at you<<emoji ♥>>.
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
/*            */<<if $npc.hasPussy && $npc.hasPenis>>\
/*              */@@color:deeppink;$npc.possessive $npc.genitals.male is hard and $npc.possessive $npc.genitals.female is wet@@\
/*            */<<elseif $npc.hasPussy>>\
/*              */@@color:deeppink;$npc.possessive $npc.genitals.female is wet@@\
/*            */<<elseif $npc.hasPenis>>\
/*              */@@color:deeppink;$npc.genPronoun <<thirdPerson "is" "are">> hard@@\
/*            */<</if>>\
/*            */<<if $npc.hasBoobs>> and @@color:deeppink;$npc.possessive tits are stiff@@<</if>> !!<<emoji 👀>>
              <<else>>\
                You admire $npc.possessive nice body. <<emoji 👀>>
              <</if>>\
              <<if $npc.love gt 50>>$npc.GenPronoun <<thirdPerson "offers" "offer">> no resistance<<emoji ♥>> and <<thirdPerson "lets" "let">> you have your way.<</if>>`,
          next: {
            fingerAss: {
              settingsRequirements: ["anal"],
              optionText: "👉 Finger-train $npc.possessive ass.",
              minutesCost: 10,
              contents: `<<if $npc.anusTraining lt 20>>\
              <<if !$npc.lubricatedAss>>Using some of your own spit as lubricant, y<<else>>Y<</if>>ou gently rub your finger in $npc.name's ass.
                The finger barely goes inside. <<emoji 😖>>
                <<elseif $npc.anusTraining lt 40>>\
                You gently push your finger inside $npc.name's ass.
                Still feels pretty tight. <<emoji 😖>>
                <<else>>\
                Your finger easily slides inside.
                You can easily fuck $npc.possessive asshole with your finger. <<emoji 😛>>\
                <</if>>`,
              npcStats: ["anusTraining%+40", "lust+1%"],
              next: afterStrip,
            },
            fingerPussy: {
              npcRequirements: ["hasPussy", "aroused"],
              optionText:
                "👉 Finger-train $npc.possessive $npc.genitals.female.",
              minutesCost: 10,
              contents: `<<if $npc.pussyTraining lt 20>>\
                  You gently rub your finger in $npc.name's $npc.genitals.female hole.
                  You can feel your finger getting wet <<emoji 💧>>.
                <<elseif $npc.pussyTraining lt 40>>\
                  You manage to push your finger inside $npc.name.
                  You can feel $npc.possessive $npc.genitals.female tightening around your finger. <<emoji 😛>>
                <<else>>\
                  After just a little bit of meddling, your finger slides right in!
                  You rub $npc.name's insides making $npc.possessive body react to it. <<emoji 😇>>
                  <<if $npc.lust gte 60>>\

                    $npc.GenPronoun <<thirdPerson "is" "are">> breathing hard. Looks like $npc.name is really enjoying this.\
                  <</if>>\
                <</if>><<npcStimulated>>`,
              npcStats: ["pussyTraining%+40", "lust+10%"],
              next: {
                cum: {
                  optionText: "💦 Make $npc.pronoun cum",
                  contents: `You vigorously rub inside $npc.name's vagina while you rub $npc.possessive clitoris at the same time making $npc.pronoun arc $npc.possessive body with the pleasure.
                  It doesn't take long until $npc.genPronoun <<thirdPerson "cums" "cum">> making your hand wet all over.<<npcCum>>`,
                  npcStats: ["love+5", "freedomWish-10", "hunger+10"],
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
            pushDick: {
              npcRequirements: ["hasPussy"],
              playerRequirements: ["hasPenis"],
              settingsRequirements: ["anal"],
              contents: "Which hole should you fuck?",
              optionText: "🤙 Fuck one of $npc.name's holes.",
              next: {
                penPussy: {
                  optionText: "🤙 $npc.Possessive Pussy.",
                  minutesCost: 20,
                  contents: `You push your dick against $npc.possessive $npc.genitals.female
                  <<if $npc.age gt 3 && ($npc.lust lt 30 || $npc.fear gte 40)>>\
                    $npc.GenPronoun <<thirdPerson "panics" "panic">> <<emoji 😨>> as $npc.genPronoun <<thirdPerson "sees" "see">> your dick pressing against $npc.possessive private place.
                  <</if>>\
                  <<if $npc.aroused>>\
                    You can feel the moist on the tip of your dick.
                  <</if>>\
  
                  How do you want to proceed?`,
                  npcStats: ["fear-5", "lust+30%"],
                  next: () => afterStrip().pushDickVag.next,
                  stopOption: "🛑 Stop right there.",
                },
                penAss: {
                  settingsRequirements: ["anal"],
                  optionText: "🍆 $npc.Possessive ass.",
                  minutesCost: 20,
                  contents: `You press your dick against $npc.possessive asshole.`,
                  npcStats: ["fear-5", "lust+30%"],
                  next: () => afterStrip().pushDickAnus.next,
                  stopOption: "🛑 Stop right there.",
                },
              },
            },
            pushDickVag: {
              playerRequirements: ["hasPenis"],
              settingsRequirements: ["!anal"],
              npcRequirements: ["hasPussy"],
              optionText:
                "🍆 Push your dick into $npc.possessive $npc.genitals.female",
              contents: `You push your dick against $npc.possessive $npc.genitals.female
                <<if $npc.age gt 3 && ($npc.lust lt 30 || $npc.fear gte 40)>>\
                  $npc.GenPronoun <<thirdPerson "panics" "panic">> <<emoji 😨>> as $npc.genPronoun <<thirdPerson "sees" "see">> your dick pressing against $npc.possessive private place.
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
                      You press your dick in $npc.name's $npc.genitals.female squishing $npc.possessive puffy labia on the sides. But it doesn't seem that is gonna go any further than this.
                    <<elseif $npc.pussyTraining lt 40>>\
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        <<set _cockEntered to true>>\
                        You barely manage to enter your cock's head inside $npc.name's $npc.genitals.female and it feels really tight! <<emoji 😣>>
                      <<else>>\
                        You try to enter $npc.pronoun but $npc.possessive $npc.genitals.female is too dry and it hurts $npc.pronoun a little. <<emoji 😫>>
                      <</if>>\
                    <<elseif $npc.pussyTraining lt 60>>\
                      <<set _cockEntered to true>>\
                      You slowly enter $npc.possessive $npc.genitals.female as it gets stretched.
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        $npc.GenPronoun <<thirdPerson "looks" "look">> a little troubled<<emoji 😣>>, but it looks like $npc.genPronoun can take it.
                      <<else>>\
                        Your cock hurts $npc.possessive dry vagina. A tear runs down $npc.possessive face. <<emoji 😢>>
                      <</if>>\
                    <<elseif $npc.pussyTraining lt 80>>\
                      <<set _cockEntered to true>>\
                      <<if $npc.aroused || $npc.lubricatedPussy>>\
                        Your cock easily slides inside $npc.pronoun. $npc.GenPronoun <<thirdPerson "doesn't" "don't">> seem to hate it.
                      <<else>>\
                        $npc.GenPronoun <<thirdPerson "squints" "squint">> $npc.possessive eyes as you penetrate $npc.pronoun. <<emoji 😣>>
                        $npc.Possessive dry pussy hurts a little.
                      <</if>>\
                    <<else>>\
                      <<set _cockEntered to true>>\
                      Your cock slides right in as $npc.genPronoun <<thirdPerson "lets" "let">> out a quiet ~~"Ah!"~~.<<npcStimulated>>
                    <</if>>\
                    <<if _cockEntered>>\
                      <<checkNpcVirgin vagina>>\
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
                      stats.push("freedomWish-10");
                      stats.push("lust+5%");
                    }
                    return stats;
                  },
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
                      $npc.GenPronoun <<thirdPerson "starts" "start">> crying and whimpering.
                    <<else>>\
                      You slam the whole thing inside filling up $npc.possessive vagina.
                      $npc.GenPronoun <<thirdPerson "looks" "look">> surprised<<emoji 😲>> with $npc.possessive $npc.eyeColor eyes wide open.
                    <</if>><<checkNpcVirgin vagina>>`,
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
                  next: {
                    slow: {
                      optionText: "🦥 Fuck $npc.pronoun slowly.",
                      contents: `You try your best in slowly going in and out of $npc.name's $npc.age year old $npc.genitals.female.
                        <<if $npc.pussyTraining lt 20>>\
                          $npc.GenPronoun <<thirdPerson "keeps" "keep">> crying<<if $npc.age gt 0>> and pushing you while saying "Stop! It hurts!!"<</if>>. <<emoji 😢>>
                        <<elseif $npc.pussyTraining lt 40>>\
                          $npc.name seems to have a hard time taking your dick while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                        <<elseif $npc.lust lt 30>>\
                          $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to take you in and, after a while, it even starts to feel good for $npc.pronoun.\
                          <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you make love to $npc.pronoun. <<emoji ♥>><</if>><<npcStimulated>>
                        <<else>>\
                          $npc.name is visibly enjoying your cock. You can hear $npc.pronoun loudly moaning:<<npcStimulated>>
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
                        let stats = ["pussyTraining%+60", "lust+10%", "fear-5"];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      next: () => afterStrip().pushDickVag.next.ram.next,
                    },
                    fast: {
                      optionText: "⏩ Fast piston.",
                      contents: `You thrust your dick into $npc.name's $npc.genitals.female. Making $npc.pronoun bounce with a fast pelvic piston movement.
                      <<run Player.manageEnergy(3)>>\
                      <<if $npc.pussyTraining lt 40>>\
                        $npc.GenPronoun <<if $npc.age gt 0>><<thirdPerson "pushes" "push">> you while crying<<else>><<thirdPerson "cries" "cry">><</if>> desperately. <<emoji 😭>>
                      <<elseif $npc.pussyTraining lt 60>>\
                        $npc.name seems to have a hard time taking your thrusts while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                      <<elseif $npc.lust lt 60>>\
                        $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to withstand your piston and, after a while, it even starts to feel good for $npc.pronoun.\
                        <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you screw $npc.pronoun.<<emoji ♥>><</if>>
                      <<else>>\
                        $npc.name keeps turning $npc.possessive head from side to side due to the immense pleasure $npc.genPronoun<<thirdPerson "'s" "'re">> experiencing.<<npcStimulated>>
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
                      next: () => afterStrip().pushDickVag.next.ram.next,
                    },
                    cumInside: {
                      optionText: "⛽ Cum inside $npc.pronoun.",
                      contents: `You release your seed inside $npc.name's body, filling up $npc.possessive womb.
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
              playerRequirements: ["hasPenis"],
              settingsRequirements: ["anal"],
              npcRequirements: ["!hasPussy"],
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
                        $npc.GenPronoun <<thirdPerson "looks" "look">> a little troubled<<emoji 😣>>, but it looks like $npc.genPronoun can take it.
                      <<else>>\
                        Your cock hurts $npc.possessive unlubricated anus. A tear runs down $npc.possessive face. <<emoji 😢>>
                      <</if>>\
                    <<elseif $npc.anusTraining lt 80>>\
                      <<set _cockEntered to true>>\
                      <<if $npc.lubricatedAss>>\
                        Your cock easily slides inside $npc.pronoun. $npc.GenPronoun <<thirdPerson "doesn't" "don't">> seem to hate it.
                      <<else>>\
                        $npc.GenPronoun <<thirdPerson "squints" "squint">> $npc.possessive eyes as you penetrate $npc.pronoun. <<emoji 😣>>
                        $npc.Possessive unlubricated anus hurts a little.
                      <</if>>\
                    <<else>>\
                      <<set _cockEntered to true>>\
                      Your cock slides right in as $npc.genPronoun <<thirdPerson "lets" "let">> out a quiet ~~"Ah!"~~.<<npcStimulated>>
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
                      stats.push("freedomWish-10");
                      stats.push("lust+5%");
                    }
                    return stats;
                  },
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
                      $npc.GenPronoun <<thirdPerson "starts" "start">> crying and whimpering.
                    <<else>>\
                      You slam the whole thing inside filling up $npc.possessive rectum.
                      $npc.GenPronoun <<thirdPerson "looks" "look">> surprised<<emoji 😲>> with $npc.possessive $npc.eyeColor eyes wide open.
                    <</if>><<checkNpcVirgin anal>>`,
                  npcStats: (npc) =>
                    npc.anusTraining < 80
                      ? ["fear+50", "freedomWish+25", "anusTraining%+60"]
                      : ["fear+5", "lust+2%", "anusTraining%+90"],
                  next: {
                    slow: {
                      optionText: "🦥 Fuck $npc.pronoun slowly.",
                      contents: `You try your best in slowly going in and out of $npc.name's $npc.age year old rectum.
                        <<if $npc.anusTraining lt 20>>\
                          $npc.GenPronoun <<thirdPerson "keeps" "keep">> crying<<if $npc.age gt 0>> and pushing you while saying "Stop! It hurts!!"<</if>>. <<emoji 😢>>
                        <<elseif $npc.anusTraining lt 40>>\
                          $npc.name seems to have a hard time taking your dick while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                        <<elseif $npc.lust lt 30>>\
                          $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to take you in and, after a while, even starts to feel good for $npc.pronoun.\
                          <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you make love to $npc.pronoun. <<emoji ♥>><</if>><<npcStimulated>>
                        <<else>>\
                          $npc.name is visibly enjoying your cock. You can hear $npc.pronoun loudly moaning:<<npcStimulated>>
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
                        let stats = ["anusTraining%+60", "lust+10%", "fear-5"];
                        if (
                          (npc.lust < 30 && npc.love >= 75) ||
                          (npc.lust >= 30 && npc.love >= 50)
                        )
                          stats.push("love+5");
                        return stats;
                      },
                      next: () => afterStrip().pushDickAnus.next.ram.next,
                    },
                    fast: {
                      optionText: "⏩ Fast piston.",
                      contents: `You thrust your dick into $npc.name's anus. Making $npc.pronoun bounce with a fast pelvic piston movement.
                      <<run Player.manageEnergy(3)>>\
                      <<if $npc.anusTraining lt 40>>\
                        $npc.GenPronoun <<if $npc.age gt 0>><<thirdPerson "pushes" "push">> you while crying<<else>><<thirdPerson "cries" "cry">><</if>> desperately. <<emoji 😭>>
                      <<elseif $npc.anusTraining lt 60>>\
                        $npc.name seems to have a hard time taking your thrusts while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                      <<elseif $npc.lust lt 60>>\
                        $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to withstand your piston and, after a while, it even starts to feel good for $npc.pronoun.\
                        <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you screw $npc.pronoun.<<emoji ♥>><</if>><<npcStimulated>>
                      <<else>>\
                        $npc.name keeps turning $npc.possessive head from side to side due to the immense pleasure $npc.genPronoun<<thirdPerson "'s" "'re">> experiencing.<<npcStimulated>>
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
            useDildo: {
              inventoryRequirements: ["dildo"],
              optionText: "🥒 Use the dildo on $npc.name.",
              contents: "Which hole should you use?",
              next: {
                dildoVag: {
                  inventoryRequirements: ["dildo"],
                  npcRequirements: ["hasPussy"],
                  optionText:
                    "🥒 Push the dildo into $npc.possessive $npc.genitals.female.",
                  contents: `You push the dildo against $npc.possessive $npc.genitals.female.
                    <<if $npc.age gt 3 && ($npc.lust lt 30 || $npc.fear gte 40)>>\
                      $npc.GenPronoun <<thirdPerson "panics" "panic">> <<emoji 😨>> as $npc.genPronoun <<thirdPerson "sees" "see">> the dildo pressing against $npc.possessive private place.
                    <</if>>\
                    <<if $npc.aroused>>\
                      The dildo is already getting wet from $npc.name's $npc.genitals.female juices.
                    <</if>>\
    
                    How do you want to proceed?`,
                  next: {
                    carefully: {
                      optionText: "🍬 Carefully press it in.",
                      minutesCost: 2,
                      contents: `<<if $npc.pussyTraining lt 20>>\
                          You press the dildo in $npc.name's $npc.genitals.female squishing $npc.possessive puffy labia on the sides. But it doesn't seem that is gonna go any further than this.
                        <<elseif $npc.pussyTraining lt 40>>\
                          <<if $npc.aroused || $npc.lubricatedPussy>>\
                            <<set _cockEntered to true>>\
                            You barely manage to enter the dildo's tip inside $npc.name's $npc.genitals.female but it's still pretty hard to enter!<<emoji 😣>>
                          <<else>>\
                            You try to enter $npc.pronoun but $npc.possessive $npc.genitals.female is too dry and it hurts $npc.pronoun a little.<<emoji 😫>>
                          <</if>>\
                        <<elseif $npc.pussyTraining lt 60>>\
                          <<set _cockEntered to true>>\
                          You slowly enter $npc.possessive $npc.genitals.female as it gets stretched.
                          <<if $npc.aroused || $npc.lubricatedPussy>>\
                            $npc.GenPronoun <<thirdPerson "looks" "look">> a little troubled<<emoji 😣>>, but it looks like $npc.genPronoun can take it.
                          <<else>>\
                            The dildo hurts $npc.possessive dry vagina. A tear runs down $npc.possessive face.<<emoji 😢>>
                          <</if>>\
                        <<elseif $npc.pussyTraining lt 80>>\
                          <<set _cockEntered to true>>\
                          <<if $npc.aroused || $npc.lubricatedPussy>>\
                            The dildo easily slides inside $npc.pronoun. $npc.GenPronoun <<thirdPerson "doesn't" "don't">> seem to hate it.
                          <<else>>\
                            $npc.GenPronoun <<thirdPerson "squints" "squint">> $npc.possessive eyes as you penetrate $npc.pronoun.<<emoji 😣>>
                            $npc.Possessive dry pussy hurts a little.
                          <</if>>\
                        <<else>>\
                          <<set _cockEntered to true>>\
                          The dildo slides right in as $npc.genPronoun <<thirdPerson "lets" "let">> out a quiet ~~"Ah!"~~.<<npcStimulated>>
                        <</if>>\
                        <<if _cockEntered>>\
                          <<checkNpcVirgin vagina>>\
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
                          else if (npc.pussyTraining < 60)
                            stats.push("fear+10");
                          else stats.push("fear+5");
                        }
                        if (
                          (wet || npc.pussyTraining >= 40) &&
                          npc.pussyTraining < 75
                        )
                          stats.push("pussyTraining+5");
                        if (wet && npc.pussyTraining >= 60)
                          stats.push("fear-5");
                        if (npc.pussyTraining >= 80) {
                          stats.push("freedomWish-10");
                          stats.push("lust+5%");
                        }
                        return stats;
                      },
                      next: () => afterStrip().useDildo.next.dildoVag.next,
                      altOptions: (npc, current) => {
                        if (Temporary().cockEntered) {
                          Variables().npcInteractionRoute =
                            "slave.pushDown.strip.useDildo.dildoVag.ram";
                          return current.ram.next as NpcInteractionOptions;
                        }
                        return current;
                      },
                    },
                    ram: {
                      optionText: "🥒 Just ram it in.",
                      contents: `<<if $npc.pussyTraining lt 80>>\
                          The dildo pierces $npc.name's insides as you forcefully penetrate $npc.pronoun.
                          $npc.GenPronoun <<thirdPerson "starts" "start">> crying and whimpering.
                        <<else>>\
                          You slam the whole thing inside filling up $npc.possessive vagina.
                          $npc.GenPronoun <<thirdPerson "looks" "look">> surprised<<emoji 😲>> with $npc.possessive $npc.eyeColor eyes wide open.
                        <</if>><<checkNpcVirgin vagina>>`,
                      npcStats: (npc) => {
                        let stats =
                          npc.pussyTraining < 80
                            ? ["fear+50", "freedomWish+25"]
                            : ["fear+5", "lust+2%"];
                        if (npc.pussyTraining < 50)
                          stats.push("pussyTraining%+60");
                        else if (npc.pussyTraining < 60)
                          stats.push("pussyTraining%+70");
                        else if (npc.pussyTraining < 70)
                          stats.push("pussyTraining%+80");
                        else if (npc.pussyTraining < 80)
                          stats.push("pussyTraining%+90");
                        return stats;
                      },
                      next: {
                        slow: {
                          optionText:
                            "🦥 Fuck $npc.pronoun slowly with the dildo.",
                          contents: `You try your best in slowly going in and out of $npc.name's $npc.age year old $npc.genitals.female.
                            <<if $npc.pussyTraining lt 20>>\
                              $npc.GenPronoun <<thirdPerson "keeps" "keep">> crying<<if $npc.age gt 0>> and pushing your hand while saying "Stop! It hurts!!"<</if>>. <<emoji 😢>>
                            <<elseif $npc.pussyTraining lt 40>>\
                              $npc.name seems to have a hard time taking the dildo while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                            <<elseif $npc.lust lt 30>>\
                              $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to take the dildo in and, after a while, it even starts to feel good for $npc.pronoun.\
                              <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you fuck $npc.pronoun with your dildo. <<emoji ♥>><</if>>
                            <<else>>\
                              $npc.name is visibly enjoying your dildo in $npc.possessive $npc.genitals.female. You can hear $npc.pronoun loudly moaning:<<npcStimulated>>
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
                              "fear-5",
                            ];
                            if (
                              (npc.lust < 30 && npc.love >= 75) ||
                              (npc.lust >= 30 && npc.love >= 50)
                            )
                              stats.push("love+5");
                            return stats;
                          },
                          next: () =>
                            afterStrip().useDildo.next.dildoVag.next.ram.next,
                        },
                        fast: {
                          optionText: "⏩ Fast piston.",
                          contents: `You thrust the dildo into $npc.name's $npc.genitals.female, making $npc.pronoun bounce with a fast piston movement.
                          <<run Player.manageEnergy(1)>>\
                          <<if $npc.pussyTraining lt 40>>\
                            $npc.GenPronoun <<if $npc.age gt 0>><<thirdPerson "pushes" "push">> you while crying<<else>><<thirdPerson "cries" "cry">><</if>> desperately.<<emoji 😭>>
                          <<elseif $npc.pussyTraining lt 60>>\
                            $npc.name seems to have a hard time taking your thrusts while squinting $npc.possessive eyes<<emoji 😣>> while you dildo fuck $npc.pronoun.
                          <<elseif $npc.lust lt 60>>\
                            $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to withstand your piston and, after a while, it even starts to feel good for $npc.pronoun.\
                            <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you play with $npc.pronoun.<<emoji ♥>><</if>>
                          <<else>>\
                            $npc.name keeps turning $npc.possessive head from side to side due to the immense pleasure $npc.genPronoun<<thirdPerson "'s" "'re">> experiencing.<<npcStimulated>>
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
                              return [
                                "fear+5",
                                "pussyTraining%+80",
                                "hunger+5",
                              ];
                            let stats = [
                              "pussyTraining+10",
                              "lust+10%",
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
                          next: () =>
                            afterStrip().useDildo.next.dildoVag.next.ram.next,
                        },
                        out: {
                          optionText: "🔙 Pull out",
                          contents: `You pull the dildo out of $npc.name's $npc.genitals.female.`,
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
                            $npc.GenPronoun <<thirdPerson "looks" "look">> a little troubled<<emoji 😣>>, but it looks like $npc.genPronoun can take it.
                          <<else>>\
                            The dildo hurts $npc.possessive unlubricated anus. A tear runs down $npc.possessive face. <<emoji 😢>>
                          <</if>>\
                        <<elseif $npc.anusTraining lt 80>>\
                          <<set _cockEntered to true>>\
                          <<if $npc.lubricatedAss>>\
                            The dildo easily slides inside $npc.pronoun. $npc.GenPronoun <<thirdPerson "doesn't" "don't">> seem to hate it.
                          <<else>>\
                            $npc.GenPronoun <<thirdPerson "squints" "squint">> $npc.possessive eyes as you penetrate $npc.pronoun. <<emoji 😣>>
                            $npc.Possessive unlubricated anus hurts a little.
                          <</if>>\
                        <<else>>\
                          <<set _cockEntered to true>>\
                          The dildo slides right in as $npc.genPronoun <<thirdPerson "lets" "let">> out a quiet ~~"Ah!"~~.<<npcStimulated>>
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
                          stats.push("freedomWish-10");
                          stats.push("lust+5%");
                        }
                        return stats;
                      },
                      next: () => afterStrip().useDildo.next.dildoAnus.next,
                      altOptions: (npc, current) => {
                        if (Temporary().cockEntered) {
                          Variables().npcInteractionRoute =
                            "slave.pushDown.strip.useDildo.dildoAnus.ram";
                          return current.ram.next as NpcInteractionOptions;
                        }
                        return current;
                      },
                    },
                    ram: {
                      optionText: "🥒 Just ram it in.",
                      contents: `<<if $npc.anusTraining lt 80>>\
                          The dildo pierces $npc.name's insides as you forcefully penetrate $npc.pronoun.
                          $npc.GenPronoun <<thirdPerson "starts" "start">> crying and whimpering.
                        <<else>>\
                          You slam the whole thing inside filling up $npc.possessive rectum.
                          $npc.GenPronoun <<thirdPerson "looks" "look">> surprised<<emoji 😲>> with $npc.possessive $npc.eyeColor eyes wide open.
                        <</if>><<checkNpcVirgin anal>>`,
                      npcStats: (npc) =>
                        npc.anusTraining < 80
                          ? ["fear+50", "freedomWish+25", "anusTraining%+60"]
                          : ["fear+5", "lust+2%", "anusTraining%+90"],
                      next: {
                        slow: {
                          optionText:
                            "🦥 Fuck $npc.pronoun bottom slowly with the dildo.",
                          contents: `You try your best in slowly going in and out of $npc.name's $npc.age year old rectum.
                            <<if $npc.anusTraining lt 20>>\
                              $npc.GenPronoun <<thirdPerson "keeps" "keep">> crying<<if $npc.age gt 0>> and pushing your hand while saying "Stop! It hurts!!"<</if>>.<<emoji 😢>>
                            <<elseif $npc.anusTraining lt 40>>\
                              $npc.name seems to have a hard time taking the dildo while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun.
                            <<elseif $npc.lust lt 30>>\
                              $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to take it in and, after a while, it even starts to feel good for $npc.pronoun.\
                              <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you move the dildo in and out of $npc.possessive ass.<<emoji ♥>><</if>><<npcStimulated>>
                            <<else>>\
                              $npc.name is visibly enjoying the dildo. You can hear $npc.pronoun loudly moaning:<<npcStimulated>>
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
                              "fear-5",
                            ];
                            if (
                              (npc.lust < 30 && npc.love >= 75) ||
                              (npc.lust >= 30 && npc.love >= 50)
                            )
                              stats.push("love+5");
                            return stats;
                          },
                          next: () =>
                            afterStrip().useDildo.next.dildoAnus.next.ram.next,
                        },
                        fast: {
                          optionText: "⏩ Fuck $npc.pronoun fast.",
                          contents: `You thrust the dildo into $npc.name's anus. Making $npc.pronoun bounce with a fast piston movement.
                          <<run Player.manageEnergy(1)>>\
                          <<if $npc.anusTraining lt 40>>\
                            $npc.GenPronoun <<if $npc.age gt 0>><<thirdPerson "pushes" "push">> your hand while crying<<else>>cries<</if>> desperately. <<emoji 😭>>
                          <<elseif $npc.anusTraining lt 60>>\
                            $npc.name seems to have a hard time taking your thrusts while squinting $npc.possessive eyes<<emoji 😣>> while you fuck $npc.pronoun with the dildo.
                          <<elseif $npc.lust lt 60>>\
                            $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to withstand your piston and, after a while, it even starts to feel good for $npc.pronoun.\
                            <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you screw $npc.pronoun.<<emoji ♥>><</if>><<npcStimulated>>
                          <<else>>\
                            $npc.name keeps turning $npc.possessive head from side to side due to the immense pleasure $npc.genPronoun<<thirdPerson "'s" "'re">> experiencing.<<npcStimulated>>
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
                          next: () =>
                            afterStrip().useDildo.next.dildoAnus.next.ram.next,
                        },
                        gentleRubSlaveGen: {
                          optionText:
                            "👋 Gently rub $npc.name's $npc.genitals.all.",
                          minutesCost: 5,
                          contents: `You slowly rub $npc.name's $npc.genitals.all while keeping the dildo in $npc.possessive bottom, moving only slowly.
                            <<if $npc.hasPussy>>\
                              @@color:deeppink;$npc.Possessive cunny gets wetter@@\
/*                        */<</if>>\
/*                        */<<if $npc.hasPussy && $npc.hasPenis>>, <</if>>\
/*                        */<<if $npc.hasPenis>>\
/*                            */@@color:deeppink;$npc.GenPronoun <<thirdPerson "gets" "get">> harder@@\
                            <</if>>\
                            <<if $npc.anusTraining lt 20>>\
                              despite the pain in $npc.possessive bottom.  $npc.GenPronoun <<thirdPerson "keeps" "keep">> crying the pleasure and pain is tormenting $npc.pronoun.<<emoji 😢>>
                            <<elseif $npc.anusTraining lt 40>>\
                              even though $npc.name seems to have a hard time taking the dildo.
                            <<elseif $npc.lust lt 30>>\
                              and $npc.possessive body even starts to enjoy the feel of the dildo in $npc.possessive bottom.  $npc.GenPronoun <<thirdPerson "is" "are">> very confused and conflicted by the mix of feelings. \
                              <<if $npc.love gte 75>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you move the dildo in and out of $npc.possessive ass.<<emoji ♥>><</if>><<npcStimulated>>
                            <<else>>\
                              and $npc.name is visibly enjoying the anal dildo as you rub $npc.pronoun. You can hear $npc.pronoun loudly moaning:<<npcStimulated>>
                              "Ah!...Ah!...<<if $npc.age gt 4>> Yes... Please don't stop!!<</if>>\
                              <<if $npc.love gte 50>>I love you <<npcAddressPlayer>><<emoji ♥>>.<</if>>"\
                            <</if>>`,
                          npcStats: (npc) => {
                            if (npc.anusTraining < 20)
                              return [
                                "fear+5",
                                "lust+10%",
                                "freedomWish+5",
                                "anusTraining%+20",
                              ];
                            if (npc.anusTraining < 40)
                              return ["fear+5", "lust+10%", "anusTraining%+40"];
                            let stats = [
                              "anusTraining%+50",
                              "lust+10%",
                              "fear-5",
                            ];
                            if (
                              (npc.lust < 30 && npc.love >= 75) ||
                              (npc.lust >= 30 && npc.love >= 50)
                            )
                              stats.push("love+5");
                            return stats;
                          },
                          next: () =>
                            afterStrip().useDildo.next.dildoAnus.next.ram.next,
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
                back: {
                  optionText: "🔙 Pull back",
                  contents: `You pull back leaving $npc.pronoun naked on the ground.`,
                  next: afterStrip,
                },
              },
            },
            rubPussies: {
              playerRequirements: ["hasPussy"],
              npcRequirements: ["hasPussy"],
              optionText: "🌮 Trib pussies together.",
              minutesCost: 20,
              contents: `You open $npc.possessive legs and you start rubbing your pussy against <<if $npc.gender != 'boy'>>hers<<else>>his<</if>>.
                <<if $npc.lust lt 35>>\
                  $npc.name doesn't seem to dislike it.
                <<elseif $npc.lust lt 65>>\
                  $npc.name doesn't resist at all. $npc.GenPronoun <<thirdPerson "lets" "let">> you have your way and <<thirdPerson "seems" "seem">> to enjoy it while closing $npc.possessive eyes. <<emoji 😩>>
                  <<if $npc.love gte 50>>$npc.GenPronoun <<thirdPerson "smiles" "smile">> at you as you make love to $npc.pronoun. <<emoji ♥>><</if>>
                <<else>>\
                  $npc.name starts moaning along. "Ah!...Ah!..." <<emoji 😩>>
                  <<if $npc.love gt 50>>
                    $npc.genPronoun <<thirdPerson "smiles" "smile">> at you and <<thirdPerson "says" "say">>: "I love you <<npcAddressPlayer>>!!<<emoji ♥>>"
                  <</if>>
                <</if>><<npcStimulated>>`,
              npcStats: (npc) => {
                let stats = ["fear-5", "lust+10%", "freedomWish-2"];
                if (npc.lust >= 65 && npc.love > 50) stats = ["love+5"];
                return stats;
              },
              next: afterStrip,
            },
            gentleRubSlaveGen: {
              optionText: "👋 Gently rub $npc.name's $npc.genitals.all.",
              minutesCost: 5,
              contents: `You slowly rub $npc.name's $npc.genitals.all.
                After a while, \
                <<if $npc.hasPussy && $npc.hasPenis>>\
                  @@color:deeppink;$npc.possessive cunny gets wet and $npc.genPronoun <<thirdPerson "gets" "get">> hard@@.
                <<elseif $npc.hasPussy>>\
                  @@color:deeppink;$npc.possessive cunny gets wet@@.
                <<elseif $npc.hasPenis>>\
                  @@color:deeppink;$npc.genPronoun <<thirdPerson "gets" "get">> hard@@.
                <</if>><<npcStimulated>>`,
              npcStats: ["fear-5", "lust+20%"],
              next: afterStrip,
            },
            touchBoobs: {
              npcRequirements: ["hasBoobs"],
              optionText: "🍈🍈 Fondle $npc.possessive boobs.",
              minutesCost: 5,
              contents: `You bring your hands up to $npc.possessive beautiful melons and softly rub them, your thumbs brushing $npc.possessive nipples.`,
              npcStats: ["fear-5", "lust+10%"],
              next: afterStrip,
            },
            suckBoobs: {
              npcRequirements: ["hasBoobs"],
              optionText: "🍈🍈👄 Suck $npc.possessive boobs.",
              minutesCost: 10,
              contents: `You kiss your way down $npc.possessive neck and chest to $npc.possessive nipple. You suck it into your mouth and gently suckle. $npc.GenPronoun <<thirdPerson "arcs" "arc">> $npc.possessive back.<<npcStimulated>> Your tongue makes circles around $npc.possessive nipple<<if $npc.lactating>>, lapping up $npc.possessive delicious milk<</if>>.`,
              npcStats: (npc) => {
                let stats = ["fear-5", "lust+10%", "freedomWish-2"];
                if (npc.lust >= 65 && npc.love > 50) stats = ["love+5"];
                return stats;
              },
              next: afterStrip,
            },
            getPenetrated: {
              npcRequirements: ["hasPenis", "aroused"],
              playerRequirements: ["hasPussy"],
              settingsRequirements: ["anal"],
              contents: "Which hole should $npc.name fuck?",
              optionText: "🤙 Let $npc.name fuck you.",
              next: {
                getPenPussy: {
                  optionText: "🤙 Your Pussy.",
                  minutesCost: 20,
                  contents: `You grab $npc.name erected penis and enter it in your pussy and start bouncing and enjoying $npc.possessive dick.
                    After a while you start going faster and the $npc.title starts panting.
                    <<npcStimulated>>
                    It looks like $npc.genPronoun<<thirdPerson "'s" "'re">> about to cum. What do you do?<<checkNpcVirgin penis>>`,
                  npcStats: ["fear-5", "lust+30%"],
                  next: () => afterStrip().getPenPussy.next,
                  stopOption: "🛑 Stop right there.",
                },
                getPenAss: {
                  settingsRequirements: ["anal"],
                  optionText: "🍆 Your ass.",
                  minutesCost: 20,
                  contents: `You grab $npc.name erected penis and enter it in your asshole and start bouncing and enjoying $npc.possessive dick.
                    After a while you start going faster and the $npc.title starts panting.
                    <<npcStimulated>>
                    It looks like $npc.genPronoun<<thirdPerson "'s" "'re">> about to cum. What do you do?<<checkNpcVirgin penis>>`,
                  npcStats: ["fear-5", "lust+30%"],
                  next: () => afterStrip().getPenAss.next,
                  stopOption: "🛑 Stop right there.",
                },
              },
            },
            getPenPussy: {
              playerRequirements: ["hasPussy"],
              npcRequirements: ["hasPenis", "aroused"],
              settingsRequirements: ["!anal"],
              optionText: "🤙 Have sex with $npc.name.",
              minutesCost: 20,
              contents: `You grab $npc.name erected penis and enter it in your pussy and start bouncing and enjoying $npc.possessive dick.
                After a while you start going faster and the $npc.title starts panting.
                <<npcStimulated>>
                It looks like $npc.genPronoun<<thirdPerson "'s" "'re">> about to cum. What do you do?<<checkNpcVirgin penis>>`,
              npcStats: ["fear-5", "lust+30%"],
              next: {
                endure: {
                  optionText: "💪 Tell $npc.pronoun to endure it.",
                  minutesCost: 10,
                  contents: `<<playerSay "Don't you dare cum in me">>
                    <<npcStimulated>>
                    $npc.name looks troubled but obeys.`,
                  npcStats: ["fear+1", "obedience+2"],
                  playerStats: ["lust-10"],
                  next: () => afterStrip().getPenPussy.next,
                  stopOption: "🛑 Stop right there.",
                },
                cum: {
                  optionText: "👍 Let $npc.pronoun cum.",
                  contents: `<<if $npc.age lt 14>>\
                      You feel $npc.name shaking while $npc.genPronoun <<thirdPerson "has" "have">> a nice dry cum.
                    <<else>>\
                      You feel $npc.possessive dick shooting $npc.possessive seed inside you.
                    <</if>><<npcCum>>`,
                  npcStats: ["love+10", "freedomWish-10", "hunger+10"],
                  stopOption: "💤 Let $npc.pronoun rest.",
                },
              },
              stopOption: "🛑 Stop right there.",
            },
            getPenAss: {
              npcRequirements: ["hasPenis", "aroused"],
              settingsRequirements: ["anal"],
              playerRequirements: ["!hasPussy"],
              optionText:
                "🍆 Insert $npc.possessive erected penis in your ass.",
              minutesCost: 20,
              contents: `You grab $npc.name erected penis and enter it in your asshole and start bouncing and enjoying $npc.possessive dick.
                After a while you start going faster and the $npc.title starts panting.
                <<npcStimulated>>
                It looks like $npc.genPronoun<<thirdPerson "'s" "'re">> about to cum. What do you do?<<checkNpcVirgin penis>>`,
              npcStats: ["fear-5", "lust+30%"],
              next: {
                endure: {
                  optionText: "💪 Tell $npc.pronoun to endure it.",
                  minutesCost: 10,
                  contents: `<<playerSay "Don't you dare cum in me">>
                    <<npcStimulated>>
                    $npc.name looks troubled but obeys.`,
                  npcStats: ["fear+1", "obedience+2"],
                  playerStats: ["lust-10"],
                  next: () => afterStrip().getPenAss.next,
                  stopOption: "🛑 Stop right there.",
                },
                cum: {
                  optionText: "👍 Let $npc.pronoun cum.",
                  contents: `<<if $npc.age lt 14>>\
                      You feel $npc.name shaking while $npc.genPronoun <<thirdPerson "has" "have">> a nice dry cum.
                    <<else>>\
                      You feel $npc.possessive dick shooting $npc.possessive seed in your bowels.
                    <</if>><<npcCum>>`,
                  npcStats: ["love+10", "freedomWish-10", "hunger+10"],
                  playerStats: ["lust-10"],
                  stopOption: "💤 Let $npc.pronoun rest.",
                },
              },
              stopOption: "🛑 Stop right there.",
            },
            applyLube: {
              inventoryRequirements: ["lube"],
              showIfEmpty: false,
              optionText: "💧 Apply lube to $npc.name.",
              contents: "What do you want to lube up?",
              next: {
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
                  next: afterStrip,
                },
                back: {
                  optionText: "🔙 Pull back",
                  contents: `You decide not to add any lube for now.`,
                  next: afterStrip,
                },
              },
            },
          },
        },
        stealClothes: {
          optionText: "🖐 Strip $npc.pronoun and keep $npc.possessive clothes.",
          contents: null, //These contents are assigned right after this interaction tree definition.
          npcStats: ["-haveClothes"],
          next: () =>
            window.Interactions.slave.options["pushDown"].next["strip"].next,
        },
      },
    },
    takeHead: {
      npcRequirements: ["age>0"],
      optionText: "💋 Put $npc.possessive pretty lips to work",
      contents: `You put your hands behind <<-$npc.name>>'s head and pull $npc.pronoun towards you`,
      next: {
        askLickPus: {
          playerRequirements: ["hasPussy"],
          npcRequirements: ["age>0"],
          optionText: "👅 Ask $npc.pronoun to lick your pussy.",
          minutesCost: 30,
          contents: `With your hand on the back of $npc.possessive $npc.hairColor head you approach your pussy to $npc.possessive face and say:
          "Lick here!"

          <<if $npc.love gte 80>>\
            <<npcSay "Sure thing, <<npcAddressPlayer>>!!">><<emoji ❤>>
            Right after finishing $npc.possessive sentence, $npc.name places $npc.possessive<<if $npc.age lt 7>> little<</if>> hands on your legs as $npc.genPronoun <<thirdPerson "approaches" "approach">> $npc.possessive face to your pussy.
            You can see $npc.possessive $npc.eyeColor loving eyes looking at you while $npc.possessive mouth is being covered by your crotch as you feel the first contact of $npc.possessive<<if $npc.age lt 7>> little<</if>> tongue on your labia.
            <<if $npc.mouthTraining gte 30>>\
              $npc.name already knows how to pleasure you and focuses on your clit, giving you lots of pleasure. You instinctively press $npc.possessive head towards you while $npc.genPronoun <<thirdPerson "insists" "insist">> on the licking and sucking.
            <<else>>\
              $npc.name randomly licks you between your legs. $npc.genPronoun<<thirdPerson "'s" "'re">> a little clumsy with it but $npc.genPronoun<<thirdPerson "'s" "'re">> trying $npc.possessive best and it feels pretty good.
            <</if>>\
          <<elseif $npc.lust gte 60>>\
            Hearing that makes $npc.pronoun aroused and $npc.genPronoun <<thirdPerson "blushes" "blush">> at the thought.<<npcStimulated>>
            $npc.name nods and quickly throws <<- $npc.pronoun>>self between your legs and starts licking with vigor.
            <<if $npc.mouthTraining gte 30>>\
              $npc.name already knows how to pleasure you and focuses on your clit, giving you lots of pleasure. You instinctively press $npc.possessive head towards you while $npc.genPronoun <<thirdPerson "insists" "insist">> on the licking and sucking.
            <<else>>\
              $npc.name randomly licks you between your legs. $npc.genPronoun<<thirdPerson "'s" "'re">> a little clumsy with it but $npc.genPronoun<<thirdPerson "'s" "'re">> trying $npc.possessive best and it feels pretty good.
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
              <<if $npc.mouthTraining gte 30>> $npc.name has no problem approaching and licking your pussy. $npc.genPronoun<<thirdPerson "'s" "'re">> pretty used to it by now.
              $npc.GenPronoun <<thirdPerson "gives" "give">><<else>>$npc.name gives<</if>> you random licks to your labia, some of them end up rubbing your clit giving you some little peaks of pleasure.
              $npc.genPronoun<<thirdPerson "'s" "'re">> not too shabby, although $npc.genPronoun <<thirdPerson "doesn't" "don't">> put too much passion into it and seems like $npc.genPronoun<<thirdPerson "'s" "'re">> doing some chore. But feels pretty good for you anyway.
            <<else>>\
              $npc.name's no amateur about this, $npc.genPronoun already <<thirdPerson "knows" "know">> how to please you.
              $npc.GenPronoun <<thirdPerson "starts" "start">> by sinking $npc.possessive tongue under your labia and lick inside. You feel $npc.possessive<<if $npc.age lt 7>> little<</if>> warm lips over your labia while $npc.genPronoun <<thirdPerson "does" "do">> it.
              $npc.GenPronoun can surely taste your flavor and $npc.genPronoun <<thirdPerson "has" "have">> to gulp down the excess of saliva and love juice more than once during the process.
            <</if>>\
          <</if>><<if !_refused && !$npc.mouthVirgin && !Person.hasAchievement("playerNoticedPreviousOralTraining")>>\
            <<set Person.setAchievement("playerNoticedPreviousOralTraining")>>\
            @@color:yellow;You notice that $npc.name's cunnilingus skill is unusually high!!@@
          <</if>>`,
          npcStats(npc) {
            let temp = Temporary();
            if (temp.refused) return null;
            let stats = ["mouthTraining+10", "fear-5", "hunger-1"];
            if (!temp.unwilling) stats.push("lust+10%");
            if (npc.mouthTraining >= 60) stats.push("hunger-2");
            return stats;
          },
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
                $npc.name obeys and keeps licking you making lots of lewd noises. $npc.Possessive face gets covered by your juices more and more as $npc.genPronoun <<thirdPerson "keeps" "keep">> licking.`,
                npcStats(npc) {
                  let stats = ["mouthTraining+10", "fear-5", "hunger-1"];
                  if (npc.love > 80 || npc.lust > 60) stats.push("lust+10%");
                  return stats;
                },
                next: () =>
                  (
                    window.Interactions.slave.options["takeHead"].next
                      .askLickPus.next as CallableFunction
                  )(),
              },
              punish: thisPunish,
            };
          },
        },
        penToMouth: {
          playerRequirements: ["hasPenis"],
          npcRequirements: ["age>0"],
          optionText: "👄🍆 Put your dick in $npc.possessive mouth.",
          contents: `You use one hand on the back of $npc.possessive $npc.hairColor head and while your other hand you guides your erected penis to $npc.possessive mouth.
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
              $npc.name <<if $npc.hunger gt 80>>is so hungry that $npc.genPronoun <<thirdPerson "does" "do">><<else>>does<</if>> not hesitate and <<thirdPerson "opens" "open">> $npc.possessive mouth allowing you to enter.
              You can feel the warmth inside $npc.possessive mouth wrapping around your dick and $npc.possessive lips closing on it.
              $npc.GenPronoun <<thirdPerson "starts" "start">> suckling on your member and rubbing with $npc.possessive tongue while inside $npc.possessive mouth, <<if $npc.hunger gt 80>>desperate to get whatever sustenance $npc.genPronoun can get, <</if>>making a lot of noise.\
              <<set _sucking = true>>\
            <</if>>\
            <<if !$npc.mouthVirgin && !Person.hasAchievement("playerNoticedPreviousOralTraining")>>\
              <<set Person.setAchievement("playerNoticedPreviousOralTraining")>>
              @@color:yellow;You notice that $npc.name's blowjob skill is unusually high!!@@
            <</if>>\
          <</if>>`,
          npcStats(npc) {
            let temp = Temporary();
            if (!temp.okBj) return null;
            let stats = ["fear-5", "hunger+1"];
            if (npc.mouthTraining < 30) stats.push("mouthTraining%+40");
            else stats.push("mouthTraining%+70");
            if (temp.willing) stats.push("lust+10%");
            return stats;
          },
          next() {
            let thisPunish: NpcInteraction = {
              optionText: "",
              contents: "",
            };
            Object.assign(thisPunish, punishment);
            Variables().punishReason = "refusing your request";
            thisPunish.canBeShown = () =>
              !Temporary().okBj || Temporary().refused;
            return {
              balls: {
                canBeShown: () => Temporary().okBj,
                optionText: '👅🥚 "Lick my balls."',
                minutesCost: 5,
                contents: `<<set _okBj = true>>\
                $npc.name pushes your dick upwards with $npc.possessive<<if $npc.age lt 7>> little<</if>> hands in order to reach your balls.
                $npc.GenPronoun <<thirdPerson "moves" "move">> $npc.possessive mouth down to them and <<thirdPerson "starts" "start">> licking.
                Your balls bounce a little bit with $npc.possessive<<if $npc.age lt 7>> little<</if>> tongue.
                <<if $npc.mouthTraining gte 60>>\
                  $npc.GenPronoun then <<thirdPerson "licks" "lick">> all around them while giving you gentle sucks on each ball.\
                <</if>>`,
                npcStats: ["fear-5", "mouthTraining%+40"],
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
                 Then $npc.genPronoun slowly <<thirdPerson "slides" "slide">> $npc.possessive tongue from head to base using your cock's entire length.
                 And then moves back to the head doing rapid little licks along the way.
                <</if>>`,
                npcStats(npc) {
                  let stats = ["fear-5", "lust+3%"];
                  if (npc.mouthTraining < 30) stats.push("mouthTraining%+40");
                  else stats.push("mouthTraining%+70");
                  return stats;
                },
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
                      It seems that $npc.genPronoun <<thirdPerson "doesn't" "don't">> want to continue sucking you.\
                    <</if>>\
                  <</if>>\
                <<else>>\
                  <<if $npc.hunger gt 80>>\
                    $npc.name is so hungry that $npc.genPronoun <<thirdPerson "allows" "allow">> you to \
                  <<elseif $npc.fear gt 80>>\
                    $npc.name is so scared of you that $npc.genPronoun <<thirdPerson "doesn't" "don't">> fight as you\
                  <<else>>\
                    $npc.name looks surprised but allows you to \
                  <</if>>\
                  penetrate $npc.possessive throat.
                  $npc.GenPronoun <<thirdPerson "sucks" "suck">> your cock while its filling all of the space inside $npc.possessive mouth.
                  You can feel all of $npc.possessive insides from the lips pursed near the base of your cock all the way to $npc.possessive throat.
                  <<if $npc.lust gte 80>>\
                    It doesn't take long until $npc.genPronoun <<thirdPerson "has" "have">> to retreat for air but $npc.possessive high lust <<if $npc.hunger gt 80>>and hunger <</if>>makes $npc.pronoun gobble your dick up again and again.\
                    <<set _sucking = true>>\
                  <<elseif $npc.fear gte 80>>\
                    $npc.GenPronoun <<thirdPerson "is" "are">> terrified of you, but it doesn't take long until $npc.genPronoun <<thirdPerson "has" "have">> to retreat for air.  Fear that you will hurt $npc.pronoun makes $npc.pronoun gobble your dick up again and again.\
                    <<set _sucking = true>>\
                  <<else>>\
                    $npc.GenPronoun <<thirdPerson "tries" "try">> to give you as much pleasure as possible but in the end $npc.genPronoun <<thirdPerson "has" "have">> to take it out making a big breath of air afterwards.\
                  <</if>>\
                  <<if $npc.hunger gt 80 && $npc.age gt 3>>$npc.GenPronoun <<thirdPerson "is" "are">> so hungry that $npc.possessive big $npc.eyeColor eyes look up at you, begging you to cum and give $npc.pronoun at least some sustenance.<</if>>\
                <</if>>`,
                altMinutes: (current) => (Temporary().refused ? 1 : current),
                npcStats(npc) {
                  let temp = Temporary();
                  if (temp.refused) return temp.okBj ? ["fear+5"] : ["fear+10"];
                  return [
                    npc.lust >= 80 ? "mouthTraining+20" : "mouthTraining+10",
                  ];
                },
                next: afterPenToMouth,
              },
              punish: thisPunish,
              suck: {
                canBeShown: () => Temporary().okBj,
                optionText: '👄🍆 "Suck it"',
                minutesCost: 10,
                contents: `$npc.name places $npc.possessive lips back to the tip of your dick and you help $npc.pronoun insert it into $npc.possessive mouth.
                <<set
                  _okBj = true
                  _sucking = true
                >>\
                <<if $npc.mouthTraining gte 50>>\
                  $npc.GenPronoun then <<thirdPerson "starts" "start">> sucking and jerking while your dick goes in and out of $npc.possessive mouth.
                  You can see $npc.possessive head bobbing down on you at the rhythm of your pleasure peaks.\
                <<else>>\
                  $npc.name sucks and licks your tip. Feels good, but you think it could be better. So you grab $npc.possessive head with both hands and penetrate $npc.possessive lips a little more than $npc.genPronoun <<thirdPerson "was" "were">> doing.\
                <</if>>\
                <<if $npc.hunger gte 80>>\
                  $npc.GenPronoun <<thirdPerson "looks" "look">> up at you, so hungry that $npc.genPronoun <<thirdPerson "sucks" "suck">> desperately on your cock.\
                <</if>>\
                `,
                npcStats: (npc) => afterPenToMouth().shaft.npcStats(npc),
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
                  $npc.GenPronoun <<thirdPerson "gulps" "gulp">> all of your load directly after each spurt.
                <<else>>\
                  $npc.GenPronoun <<thirdPerson "does" "do">> not seem to appreciate your sperm very much and quickly <<thirdPerson "retreats" "retreat">> while coughing and spitting.
                <</if>>`,
                npcStats: (npc) =>
                  npc.hunger >= 50 || npc.lust >= 80 ? ["hunger-5"] : null,
                next: () => afterStrip(),
              },
              ...cumOutsideOptions,
            } as NpcInteractionOptions;
          },
        },
        askSuckBoobs: {
          playerRequirements: ["hasBoobs"],
          optionText: "🍈 Ask $npc.pronoun to suck your tits.",
          minutesCost: 25,
          contents: `You take your top off and unsnap your bra. You pull $npc.name to your boobs and say:
          "Suck on my tits."
            <<if $npc.lust gt 60>>\
              <<set _willing = true>>\
              <<if $npc.age lte 3>>\
                <<npcSay "Boobies! Yay!<<emoji 😛>>">>
              <<elseif $npc.age lte 9>>\
                <<npcSay "Boobs! Yes!<<emoji 😛>>">>
              <<else>>\
                <<npcSay "Hey! Alright!<<emoji 😛>>">>
              <</if>>\
            <<elseif $npc.love gt 80>>\
              <<set _willing = true>>\
              <<npcSay "Okay <<emoji ❤>>">>
            <<elseif $npc.mouthTraining gt 30>>\
              <<npcSay "Okay...">>
              $npc.GenPronoun <<thirdPerson "isn't" "aren't">> too enthusiastic, but they are used to it by now.
            <<elseif $npc.obedience gt 30>>\
              <<npcSay "If that's what you want me to do.">>
            <<else>>\
              <<set _denied = true>>\
              <<if $npc.age lt 5>>\
                $npc.name shakes $npc.possessive head, refusing your request.<<emoji 😟>>
              <<else>>\
                <<npcSay "Eww! No!">><<emoji 😟>>
              <</if>>\
            <</if>>\
            <<if !_denied>>\
              <<if $npc.uniqueness.curious>>$npc.GenPronoun <<thirdPerson "studies" "study">> your boobs for a moment.<</if>>
              <<if $npc.mouthTraining lt 15>>\
                $npc.GenPronoun clumsily <<thirdPerson "sucks" "suck">> your tit. <<if $npc.age gt 1>>"Ow! Less teeth and more tongue!" you say.<</if>> $npc.GenPronoun <<thirdPerson "is" "are">> a little rough<<if _willing>>, but $npc.genPronoun <<thirdPerson "has" "have">> the spirit<</if>>.
              <<elseif $npc.mouthTraining lt 30>>\
                $npc.GenPronoun <<thirdPerson "sucks" "suck">> your tit.
                <<if _willing>>\
                  $npc.GenPronoun <<thirdPerson "is" "are">> not too bad.
                <<else>>\
                  You can tell $npc.genPronoun <<thirdPerson "is" "are">> just going through the motions, but $npc.genPronoun <<thirdPerson "is" "are">> not bad.
                <</if>>\
              <<else>>\
                $npc.GenPronoun <<if _willing>>skillfully <</if>><<thirdPerson "sucks" "suck">> your tit. $npc.GenPronoun <<thirdPerson "works" "work">> stimulates your nipple with $npc.possessive tongue<<if _willing>>, sending shivers down your spine.<<else>>. $npc.GenPronoun <<thirdPerson "is" "are">> pretty good, but you can tell $npc.genPronoun would be so much better if $npc.genPronoun put in the effort.<</if>>
              <</if>>\
              <<if $player.lactating>>\
                $npc.GenPronoun <<if _willing>>hungrily <</if>><<thirdPerson "drinks" "drink">> your milk.
                <<if _willing>>\
                  <<npcSay "Mmm, delicious!">>
                <<else>>\
                  $npc.GenPronoun <<thirdPerson "coughs" "cough">> and <<thirdPerson "sputters" "sputter">> and <<thirdPerson "wipes" "wipe">> $npc.possessive mouth with $npc.possessive hand before returning to the task.
                <</if>>\
                <<set _fed = true>>\
              <</if>>\
            <</if>>\
          `,
          altMinutes: (minutes) => (Temporary().denied ? 0 : minutes),
          npcStats: () => {
            let temp = Temporary();
            if (temp.denied) return null;
            let stats = ["mouthTraining+10", "fear-5"];
            if (temp.fed) stats.push("hunger-10");
            if (temp.willing) stats.push("lust+10%");
            return stats;
          },
          next() {
            let thisPunish: NpcInteraction = {
              optionText: "",
              contents: "",
            };
            Object.assign(thisPunish, punishment);
            Variables().punishReason = "refusing your request";
            thisPunish.canBeShown = () => Temporary().denied;
            return {
              pushDown: window.Interactions.slave.options["pushDown"],
              punish: thisPunish,
            };
          },
        },
        rubPenToSlaveFace: {
          playerRequirements: ["hasPenis"],
          optionText:
            "😐🍆 Rub your $player.genitals.male on $npc.name's face.",
          minutesCost: 10,
          contents: `You grab $npc.name's head and press it between your legs and start rubbing.
            $npc.Possessive nose and lips feel really good on your $player.genitals.male.
            $npc.GenPronoun <<thirdPerson "looks" "look">> at you with some precum on $npc.possessive face. <<emoji 🥺>>
            <<if $npc.hunger gt 50>>$npc.GenPronoun <<thirdPerson "is" "are">> so hungry that the smell of your precum makes $npc.pronoun even more hungry.<</if>>`,
          npcStats: (npc) => {
            let stats = ["fear-1"];
            if (npc.lust >= 50) stats.push("lust+5%");
            if (npc.hunger > 50) stats.push("hunger+2");
            return stats;
          },
          next: baseInteractionOptions,
        },
        rubVagToSlaveFace: {
          playerRequirements: ["hasPussy"],
          optionText:
            "😐🍆 Rub your $player.genitals.female on $npc.name's face.",
          minutesCost: 10,
          contents: `You grab $npc.name's head and press it between your legs and start rubbing.
            $npc.Possessive nose and lips feel really good on your $player.genitals.female.
            $npc.GenPronoun <<thirdPerson "looks" "look">> at you with $npc.possessive now wet face. <<emoji 🥺>>
            <<if $npc.hunger gt 50>>$npc.GenPronoun <<thirdPerson "is" "are">> so hungry that the smell of your juices makes $npc.pronoun even more hungry.<</if>>`,
          npcStats: (npc) => {
            let stats = ["fear-1"];
            if (npc.lust >= 50) stats.push("lust+5%");
            if (npc.hunger > 50) stats.push("hunger+2");
            return stats;
          },
          next: baseInteractionOptions,
        },
      },
    },
    giveLactationPill: {
      inventoryRequirements: ["Lactation pills"],
      npcRequirements: ["hasBoobs", "!lactating"],
      optionText: "💊 Give $npc.pronoun a lactation pill.",
      contents: `You give $npc.name a lactation pill.
      <<run Player.removeItem("Lactation pills")>>
      `,
      npcStats: ["+lactating"],
      next: baseInteractionOptions,
    },
    giveClothes: {
      npcRequirements: ["!haveClothes"],
      canBeShown: () =>
        window.Player.has(`Used clothes(${Variables().npc.age} y.o.)`),
      optionText: "👕 Give $npc.pronoun some clothes",
      contents: `<<if $npc.age lte 3>>\
          <<if $npc.uniqueness.naughty>>\
            $npc.name struggles and squirms but you manage to put clothes on $npc.pronoun.
          <<else>>
            You put clothes on $npc.name
          <</if>>
        <<else>>\
          You offer $npc.name some clothes.
          <<playerSay "Here, you can wear these.">>
          <<if $npc.fear gt 40>>\
            $npc.GenPronoun <<thirdPerson "snatches" "snatch">> the clothes out of your hand and <<thirdPerson "backs" "back">> away to put them on.
          <<elseif $npc.love gt 60>>\
            <<npcSay "Oh, thank you <<npcAddressPlayer>>!!">>
            $npc.GenPronoun <<thirdPerson "gives" "give">> you a big hug and <<thirdPerson "puts" "put">> on the clothes.
          <<elseif $npc.uniqueness.naughty>>\
            <<npcSay "You sure you don't want to see this bod?">>
            <<if $npc.lust gt 60>>\
              $npc.GenPronoun <<thirdPerson "places" "place">> $npc.possessive hands on either side of $npc.possessive $npc.genitals.all and <<thirdPerson "stares" "stare">> at you for a moment.
              <<playerSay "It is a smoking hot body, but for now put on some clothes.">>
            <<else>>\
              $npc.GenPronoun <<thirdPerson "puts" "put">> $npc.possessive hand on $npc.possessive hips.
              <<playerSay "It is a very cute body, but for now put on some clothes.">>
            <</if>>\
            $npc.GenPronoun <<thirdPerson "puts" "put">> on the clothes.
          <<elseif $npc.uniqueness.shy>>\
            $npc.GenPronoun <<thirdPerson "blushes" "blush">> and <<thirdPerson "takes" "take">> the clothes.\
            $npc.GenPronoun <<thirdPerson "turns" "turn">> around and quickly <<thirdPerson "puts" "put">> them on.\
            $npc.GenPronoun <<thirdPerson "turns" "turn">> back towards you looking down at $npc.possessive clothes.\
            With a little smile on $npc.possessive face $npc.genPronoun <<thirdPerson "says" "say">> "Thank you."
          <<else>>\
            $npc.GenPronoun <<thirdPerson "takes" "take">> the clothes and <<thirdPerson "puts" "put">> them on.
          <</if>>\
        <</if>>\
        <<run Player.removeItem("Used clothes(" + $npc.age + " y.o.)")>>`,
      npcStats: (npc) => {
        let stats = ["+haveClothes", "fear-5"];
        if (npc.love > 60) stats.push("love+5%");
        return stats;
      },
      next: baseInteractionOptions,
    },
    bringUpstairs: {
      locationRequirements: ["basement"],
      npcRequirements: ["freedomWish<=25"],
      optionText: "🚪 Let $npc.name roam the house.",
      altMinutes: () => 2,
      contents: `You carefully open the door letting only $npc.name out of the basement.
      <<if !Person.hasAchievement('beenOnHomeMain')>>\
        $npc.GenPronoun <<thirdPerson "starts" "start">> exploring each room of your home that $npc.genPronoun <<thirdPerson "has" "have">> never fully seen.
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
      next: {
        up: {
          optionText: "🔼 Go upstairs",
          contents: "<<goto main>>",
          action: true,
        },
      },
      stopOption: "🔽 Return to the basement",
    },
  },
  timeIncreaseNpcHunger: true,
};
//Instead of duplicating same text on the two interactions I just copy the contents and add the code that steals the clothes.
window.Interactions.slave.options["pushDown"].next.stealClothes.contents =
  window.Interactions.slave.options["pushDown"].next.strip.contents +
  `<<set _item = {
name:'Used clothes(' + $npc.age + ' y.o.)',
description:'Used clothes from a ' + $npc.age + ' year old',
count:1,
tags:["person","clothes","used"]
};
Player.getInventory().add(_item);>>
(_item.description added to your inventory)`;
