window.Interactions = {
  slave: {
    defaultStopOption: "✋ Leave $npc.pronoun alone",
    contents: "<<include slaveApproach>>",
    options: {
      pushDown: {
        optionText: "👇 Push $npc.pronoun down",
        contents: `You push $npc.name down placing your body over.
        <<if $npc.fear gt 25>>\
            $npc.genPronoun trembles in fear under your shadow.\
        <</if>>`,
        altOptions: (npc: Npc, current: Record<string, NpcInteraction>) => {
          //If slave has no clothes we can skip stripping.
          if ((npc as Person).haveClothes) return current;
          return window.Interactions.slave.options.pushDown.next["strip"].next;
        },
        next: {
          strip: {
            optionText: "👌 Strip $npc.pronoun naked",
            contents:
              "You take off all $npc.possessive clothes leaving $npc.name completely naked in front of you.\nYou admire $npc.possessive nice body 👀.",
            next: {
              penetrate: {
                playerRequirements: ["gender=male"],
                optionText: "🍆 Penetrate $npc.pronoun.",
                minutesCost: 30,
                contents: `You forcefully push your dick inside $npc.name and start to fuck $npc.pronoun.
                $npc.genPronoun starts crying and whimpering.`,
                npcStats: ["fear+50", "freedomWish+10"],
                showNpcStats: true,
                next: () =>
                  window.Interactions.slave.options.pushDown.next["strip"].next,
              },
              rubPussies: {
                playerRequirements: ["gender=female"],
                npcRequirements: ["gender=female"],
                optionText: "🌮 Trib pussies together.",
                minutesCost: 20,
                contents: `You open her legs and you start rubbing your pussy against hers.\nShe doesn't seem to dislike it.`,
                npcStats: ["fear-5", "lust+10%"],
                showNpcStats: true,
                next: () =>
                  window.Interactions.slave.options.pushDown.next["strip"].next,
              },
              rubToSlaveFace: {
                optionText: "Rub your $player.genitals on $npc.name\\'s face.",
                minutesCost: 10,
                contents: `You grab $npc.name head and press it between your legs and start rubbing.
                <<- $npc.pronoun[0].toUpperCase() + $npc.pronoun.slice(1)>> nose and lips feel really good on your $player.genitals.
                $npc.genPronoun looks at you with <<- $player.gender!='male'?$npc.possessive+' now wet':'some precum on '+$npc.possessive>> face. 🥺`,
                npcStats: ["fear-1"],
                showNpcStats: true,
                next: () =>
                  window.Interactions.slave.options.pushDown.next["strip"].next,
              },
              gentleRubSlaveGen: {
                optionText: "👋 Gently rub $npc.name\\'s $npc.genitals.",
                minutesCost: 5,
                contents: `You slowly rub $npc.name's $npc.genitals.
                After a while, \
                <<if $npc.gender != 'male'>>\
                  @@color:deeppink;Her cunny gets wet@@.
                <<else>>\
                  @@color:deeppink;he gets hard@@.\
                <</if>>`,
                npcStats: ["fear-5", "lust+20%", "+horny"],
                showNpcStats: true,
                next: () =>
                  window.Interactions.slave.options.pushDown.next["strip"].next,
              },
              getPenPussy: {
                playerRequirements: ["gender=female"],
                npcRequirements: ["gender=male", "horny"],
                optionText: "🤙 Have sex with $npc.name.",
                minutesCost: 20,
                contents: `You grab $npc.name erected penis and enter it in your pussy and start bouncing and enjoying his dick.
                After a while you start going faster and the boy starts panting.
                
                It looks like he's about to cum. What do you do?`,
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
                    next: () =>
                      window.Interactions.slave.options.pushDown.next["strip"]
                        .next["getPenPussy"].next,
                    stopOption: "🛑 Stop right there.",
                  },
                  cum: {
                    optionText: "👍 Let him cum.",
                    contents: `<<if $npc.age lt 14>>\
                      You feel $npc.name shaking while he has a nice dry cum.
                    <<else>>\
                      You feel his dick shooting his seed inside you.
                    <</if>>`,
                    npcStats: ["lust+30%", "love+10", "freedomWish-10", "hunger+10"],
                    playerStats: ["lust-10"],
                    showNpcStats: true,
                    next: () =>
                      window.Interactions.slave.options.pushDown.next["strip"]
                        .next["getPenPussy"].next,
                    stopOption: "💤 Let him rest.",
                  },
                },
                stopOption: "🛑 Stop right there.",
              },
            },
          },
        },
      },
    },
  },
};
