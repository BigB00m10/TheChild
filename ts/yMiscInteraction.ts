window.Interactions["houseSlave"] = {
  contents: "<<include slaveApproach>>",
  options: {
    putInBasement: {
      canBeShown: () => !window.Person.isBeingHeld(Variables().npc),
      npcRequirements: ["status!=servant", "age>0"],
      optionText: "🔒 Put $npc.name back into the basement.",
      minutesCost: 10,
      contents: `You grab $npc.name's arm and head over to the basement.
      <<if $npc.obedience lt 50>>\
        As $npc.genPronoun <<thirdPerson "sees" "see">> the basement door, $npc.genPronoun <<thirdPerson "struggles" "struggle">> and <<thirdPerson "tries" "try">> to pull your hand away.
        <<if $npc.age gte 4>>\
          ''$npc.name'': "No, please!! I want to stay here!! I'll be good. I promise!<<emoji 🥺>>"

          $npc.GenPronoun <<thirdPerson "doesn't" "don't">> want to go and promised to behave. What do you want to do?\
          <<set _askedToStay = true>>\
        <<else>>\
          But $npc.possessive resistance is futile and you push $npc.pronoun into the basement and immediately close the door.
        <</if>>\
      <<else>>\
        $npc.GenPronoun obediently <<thirdPerson "enters" "enter">> the basement by <<- $npc.pronoun>><<thirdPerson 'self' 'selves'>> as you open the door.
      <</if>>`,
      altOptions(npc, current) {
        if (Temporary().askedToStay) return current;
        window.Person.setStatus("slave");
        return {
          back: {
            optionText: "🔙 Go back.",
            contents: "<<goto $returnPassage>>",
            action: true,
          },
        };
      },
      next: {
        letGo: {
          optionText: "😤 Let $npc.pronoun stay after all.",
          contents: `You change your mind and let $npc.name go.
          ''$npc.name'': Thank you!!<<emoji 😊>>`,
          npcStats: ["obedience+30", "love+5"],
          timeIncreaseNpcHunger: false,
        },
        persist: {
          optionText: "👇 Ignore $npc.pronoun.",
          contents:
            "You ignore $npc.possessive pleading, force $npc.pronoun into the basement and close the door after $npc.pronoun.<<run Person.setStatus('slave')>>",
        },
      },
      stopOption: false,
    },
    changeName: {
      optionText: "✍ Change $npc.name's name.",
      contents: `\
        <<set _dialogTitle = 'Change ' + $npc.name + "'s name to:";>>\
        <<dialog _dialogTitle>>\
        <<textbox '_newName' $npc.name>>
        Leave it empty to reset to original name.

        <span id="enterAct">\
            <<button "✅ (Enter) Save">>\
                <<run
                  if(!$npc.originalName)
                    $npc.originalName = $npc.name;
                  _mewName = _newName.trim();
                  $npc.name = _newName ? _newName : $npc.originalName;
                  Engine.show();
                  Dialog.close();
                >>\
            <</button>>\
        </span>\
        <span id="escAct">\
            <<button "❌ (Esc) Cancel">>\
                <<dialogclose>>\
            <</button>>\
        </span>\
        <<run $(document).ready(function(){$('#textbox--newname').focus()})>>\
      <</dialog>>`,
      action: true,
    },
    ...window.Interactions.slave.options,
    setCook: {
      showDisabled:
        "Obedience $npc.obedience/60, Freedom Wish $npc.freedomWish/0",
      canBeShown: () =>
        !Variables().settings.cook?.npc && Variables().npc.age > 4,
      npcRequirements: ["obedience>=60", "freedomWish=0"],
      optionText:
        "🍳 Set $npc.name in charge of cooking and teach $npc.pronoun how to do it",
      minutesCost: 60,
      contents: `<<set 
        $settings.cook={npc:$npc.uid,feedEnabled:true,feedAtHunger:20,feedTimes:['7:00 AM','1:00 PM','7:00 PM'],lastFeedings:[],exceptions:[]};
        Person.setStatus('servant');
      >><<playerSay "Okay $npc.name, you're now in charge of cooking!">>
      <<npcSay "Okay <<npcAddressPlayer>><<if $npc.fear lt 20>><<emoji 🙂>><<else>><<emoji 🥺>><</if>>">>
      <<playerSay "You'll have a key so you can feed the ones in the basement by yourself. Let me teach you how to do it.">>`,
      next: () =>
        <NpcInteractionOptions>{
          rules: {
            optionText: "⚙ Set feeding rules",
            action: true,
            contents: `<<showCookFeedingRules>>`,
          },
          ...baseInteractionOptions(),
        },
    },
    giveApron: {
      canBeShown: () => Variables().settings.cook?.npc == Variables().npc.uid,
      ...(<NpcInteractionOptions>window.Interactions.slaveEventCook.options)
        .giveApron,
    },
    unsetCook: {
      canBeShown: () => Variables().settings.cook?.npc == Variables().npc.uid,
      optionText: "❌ Dismiss $npc.name as a cook",
      contents: `<<playerSay "You don't need to cook anymore">>
      <<npcSay "As you wish <<npcAddressPlayer>>">><<set $settings.cook.npc=null>>\
      <<if Person.getInventory().has('cooking apron')>>
        $npc.name returns the cooking apron back to you.\
        <<run Person.getInventory().moveByName('cooking apron', Player.getInventory())>>
      <</if>><<run Person.setStatus("home slave")>>`,
      next: baseInteractionOptions,
    },
  },
  defaultStopOption: "✋ Leave $npc.pronoun alone",
  timeIncreaseNpcHunger: true,
};
Macro.add("twoNpcSex", {
  handler() {
    let variables = Variables();
    if (!variables.top)
      beforeStopInteraction.push(() => {
        delete variables.top;
        delete variables.bottom;
      });
    let top = Npc.obtain(this.args[0], variables);
    let bottom = Npc.obtain(this.args[1], variables);
    variables.top = top;
    variables.bottom = bottom;
    let span = Span(
      `<<playerSay '$top, do sex with $bottom'>>
      <<personUniqueness twoNpcSexTop $top>>`,
      this.output
    );
  },
});
window.Interactions.twoNpcSex = {
  contents: "You bring $npc.name and $extraNpcs[0].name together",
  options: {},
  defaultStopOption: "✋ leave them alone",
};
window.Interactions.twoNpcSex.options = {
  clothesOff: {
    canBeShown() {
      let variables = Variables();
      return variables.npc.haveClothes || variables.extraNpcs[0].haveClothes;
    },
    optionText: "👣 Get them naked",
    contents: "", //TODO
    next: window.Interactions.twoNpcSex.options,
  },
  aFuckB: {
    npcRequirements: ["age>2"],
    optionText: "🐒 make $npc.name fuck $extraNpcs[0].name",
    contents: "<<twoNpcSex $npc $extraNpcs[0]>>",
    next: window.Interactions.twoNpcSex.options,
  },
  bFuckA: {
    canBeShown: () => Variables().extraNpcs[0].age > 2,
    optionText: "🐒 make $extraNpcs[0].name fuck $npc.name",
    contents: "<<twoNpcSex $extraNpcs[0] $npc>>",
    next: window.Interactions.twoNpcSex.options,
  },
};
