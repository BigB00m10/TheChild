window.Interactions["houseSlave"] = {
  contents: "<<include slaveApproach>>",
  options: {
    putInBasement: {
      optionText: "🔒 Put $npc.name back into the basement.",
      minutesCost: 10,
      contents: `You grab $npc.name's arm and head over to the basement.
      <<if $npc.obedience lt 50>>\
        As $npc.genPronoun sees the basement door, $npc.genPronoun struggles and tries to pull your hand away.
        <<if $npc.age gte 4>>\
          ''$npc.name'': "No, please!! I want to stay here!! I'll be good. I promise!<<emoji 🥺>>"

          $npc.GenPronoun doesn't want to go and promised to behave. What do you want to do?\
          <<set _askedToStay = true>>\
        <<else>>\
          But $npc.possessive resistance is futile and you push $npc.pronoun into the basement and immediately close the door.
        <</if>>\
      <<else>>\
        $npc.GenPronoun obediently enters the basement by <<- $npc.pronoun>>self as you open the door.
      <</if>>`,
      altOptions(npc, current) {
        if (Temporary().askedToStay) return current;
        window.Person.setStatus("slave");
      },
      next: {
        letGo: {
          optionText: "😤 Let $npc.pronoun stay after all.",
          contents: `You change your mind and let $npc.name go.
          ''$npc.name'': Thank you!!<<emoji 😊>>`,
          npcStats: ["obedience+30", "love+5"],
          showNpcStats: true,
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
                <<run Dialog.close()>>\
            <</button>>\
        </span>\
        <<run $(document).ready(function(){$('#textbox--newname').focus()})>>\
      <</dialog>>`,
      action: true,
    },
    ...window.Interactions.slave.options,
  },
  defaultStopOption: "✋ Leave $npc.pronoun alone",
};
