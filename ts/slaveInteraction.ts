if (window.Interactions == undefined) window.Interactions = {};
let afterStrip = () =>
  window.Interactions.slave.options.pushDown.next["strip"].next;
window.Interactions["slave"] = {
  defaultStopOption: "✋ Leave $npc.pronoun alone",
  contents: "<<include slaveApproach>>",
  options: {
    pushDown: {
      optionText: "👇 Push $npc.pronoun down",
      contents: `You push $npc.name down placing your body over.
        <<if $npc.fear gt 25>>\
          $npc.GenPronoun trembles in fear under your shadow.
        <<elseif $npc.love gt 50>>\
          $npc.GenPronoun leaves <<- $npc.pronoun>>self completely open as $npc.genPronoun smiles at you<<emoji ♥>>.
        <</if>>`,
      altOptions: (npc: Npc, current: Record<string, NpcInteraction>) => {
        if ((npc as Person).haveClothes) return current;
        return afterStrip(); //If slave has no clothes we can skip stripping.
      },
      baseRoute: (npc) =>
        (npc as Person).haveClothes ? "slave.pushDown" : "slave.pushDown.strip",
      next: {
        strip: {
          optionText: "👌 Strip $npc.pronoun naked",
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
                You rub $npc.name's insides making her body react to it. <<emoji 😇>>\
                <</if>>`,
              npcStats: ["pussyTraining%+40", "lust+10%", "+aroused"],
              showNpcStats: true,
              next: afterStrip,
            },
            pushDickVag: {
              playerRequirements: ["gender=male"],
              npcRequirements: ["hasPussy"],
              optionText:
                "🍆 Push your dick into $npc.possessive $npc.genitals",
              contents: `You push your dick against $npc.possessive $npc.genitals
                <<if $npc.age gt 3 && ($npc.lust lt 30 || $npc.fear gte 40)>>\
                  $npc.GenPronoun panics <<emoji 😨>> as $npc.genPronoun sees your dick pressing against her private place.
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
                    if (wet || npc.pussyTraining >= 40)
                      stats.push("pussyTraining+10");
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
                      return current.ram.next as Record<string, NpcInteraction>;
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
                  npcStats: (npc) =>
                    npc.pussyTraining < 80
                      ? ["fear+50", "freedomWish+25", "pussyTraining%+60"]
                      : ["fear+5", "lust+2%", "pussyTraining%+90"],
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
                          <<if $npc.age gt 3 && $npc.love gte 50>>I love you $player.name<<emoji ♥>>.<</if>>"\
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
                    }, //TODO: add fast and rough options
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
                      return current.ram.next as Record<string, NpcInteraction>;
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
                          <<if $npc.love gte 50>>I love you $player.name<<emoji ♥>>.<</if>>"\
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
                    }, //TODO: add fast and rough options
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
            rubPussies: {
              playerRequirements: ["gender=female"],
              npcRequirements: ["hasPussy"],
              optionText: "🌮 Trib pussies together.",
              minutesCost: 20,
              contents: `You open her legs and you start rubbing your pussy against <<if $npc.gender != 'male'>>hers<<else>>his<</if>>.
                <<if $npc.lust lt 35>>\
                  $npc.name doesn't seem to dislike it.
                <<elseif $npc.lust lt 65>>\
                  $npc.name doesn't resist at all. $npc.GenPronoun lets you have your way and seems to enjoy it while closing her eyes. <<emoji 😩>>
                  <<if $npc.love gte 50>>$npc.GenPronoun smiles at you as you make love to $npc.pronoun. <<emoji ♥>><</if>>
                <<else>>\
                  $npc.name starts moaning along. "Ah!...Ah!..." <<emoji 😩>>
                  <<if $npc.love gt 50>>
                    $npc.genPronoun smiles at you and says: "I love you $player.name!!<<emoji ♥>>"
                  <</if>>
                <</if>>`,
              npcStats: (npc) => {
                var stats = ["fear-5", "lust+10%", "+aroused", "freedomWish-2"];
                if (npc.lust >= 65 && npc.love > 50) stats = ["love+5"];
                return stats;
              },
              showNpcStats: true,
              next: afterStrip,
            },
            rubToSlaveFace: {
              optionText: "Rub your $player.genitals on $npc.name\\'s face.",
              minutesCost: 10,
              contents: `You grab $npc.name head and press it between your legs and start rubbing.
                $npc.Possessive nose and lips feel really good on your $player.genitals.
                $npc.GenPronoun looks at you with <<- $player.gender!='male'?$npc.possessive+' now wet':'some precum on '+$npc.possessive>> face. <<emoji 🥺>>`,
              npcStats: (npc) => {
                let stats = ["fear-1"];
                if (npc.lust > 50) stats.push("lust+5%");
                return stats;
              },
              showNpcStats: true,
              next: afterStrip,
            },
            gentleRubSlaveGen: {
              optionText: "👋 Gently rub $npc.name\\'s $npc.genitals.",
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
                  contents: `$player.name: "Don't you dare cum in me"
                    
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
                  next: () => afterStrip().getPenPussy.next,
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
                  contents: `$player.name: "Don't you dare cum in me"
                    
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
                  next: () => afterStrip().getPenAss.next,
                  stopOption: "💤 Let $npc.pronoun rest.",
                },
              },
              stopOption: "🛑 Stop right there.",
            },
            applyLubeAss: {
              settingsRequirements: ["anal"],
              inventoryRequirements: ["lube"],
              npcRequirements: ["!lubricatedAss"],
              optionText: "💧 Apply lube to $npc.name\\'s ass.",
              minutesCost: 2,
              contents:
                "You squeeze some lube from the tube and thoroughly apply it to $npc.name's asshole making it nice and slippery.",
              npcStats: ["+lubricatedAss"],
              next: afterStrip,
            },
            applyLubePussy: {
              inventoryRequirements: ["lube"],
              npcRequirements: ["hasPussy", "!lubricatedPussy"],
              optionText: "💧 Apply lube to $npc.name\\'s pussy.",
              minutesCost: 2,
              contents: `You squeeze some lube from the tube and thoroughly apply it to $npc.name's pussy making it nice and slippery.
                  It seems that your rubbing has caused a faint reaction in $npc.pronoun`,
              npcStats: ["+lubricatedPussy", "lust+1%"],
              showNpcStats: true,
              next: afterStrip,
            },
          },
        },
      },
    },
  },
};
