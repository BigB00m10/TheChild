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
                <<run Dialog.close()>>\
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
      canBeShown: () => !Variables().settings.cook?.npc,
      npcRequirements: ["obedience>=60", "freedomWish=0"],
      optionText:
        "🍳 Set $npc.name in charge of cooking and teach $npc.pronoun how to do it",
      minutesCost: 60,
      contents: `<<set 
        $settings.cook={npc:$npc.uid,feedEnabled:true,feedAtHunger:20,feedTimes:['7:00 AM','1:00 PM','7:00 PM'],exceptions:[]};
        Person.setStatus('servant');
        $npc.location='kitchen';
      >><<playerSay "Okay $npc.name, you're now in charge of cooking!">>
      <<npcSay "Okay <<npcAddressPlayer>><<if $npc.fear lt 20>><<emoji 🙂>><<else>><<emoji 🥺>><</if>>">>
      <<playerSay "You'll have a key so you can feed the ones in the basement by yourself. Let me teach you how to do it.">>`,
      next: {
        rules: {
          optionText: "⚙ Set feeding rules",
          action: true,
          contents: `<<dialog "Cook feeding rules">>
            <label><input type="checkbox" id="feedEnabled">Feed all the slaves that have at least </label><input type="number" id="feedAtHunger" style="width:3em" min="1" max="100">hunger.
            Those slaves will be fed at 7AM, 1PM and 7PM
            <div class="row">\
              <div class="one-half column">\
                Special cases:
                <span id="exceptionList"><<if $settings.cook.exceptions.length>>\
                  <<for _exception range $settings.cook.exceptions>>\
                    <<set _exceptionPerson = Person.get(_exception.npc)>>\
                    <span class="exceptionPerson" @data-exception="_exception">_exceptionPerson.name</span>
                  <</for>>\
                <<else>>\
                  (none)
                <</if>></span>\
                <button id="addExceptionBtn">Add exception</button>
              </div><div class="one-half column" id="exceptionEditor"></div>\
            </div>\
            <<done>><<run
              Player.bindSettingDom('feedEnabled',$settings.cook,'feedEnabled');
              Player.bindSettingDom('feedAtHunger',$settings.cook,'feedAtHunger');
              $('#addExceptionBtn').on('click',function(){
                var exceptionEditor = $('#exceptionEditor').html('<h3>New exception</h3>\
                Slave:\
                <select id="exceptionSlaveSelect" style="width:100%"></select>\
                <label><input type="checkbox" id="feedEnabled" checked>Feed this the slave when they have at least </label><input type="number" id="feedAtHunger" style="width:3em" min="1" max="100" value="20">hunger.\
                <br><button id="saveExceptionBtn">Save</button>');
                $('#exceptionSlaveSelect').select2({
                  placeholder:"Select slave...",
                  dropdownParent:exceptionEditor,
                  data:$.map($slaves,function(slave){
                    return {
                      id:slave.uid,
                      text:slave.name + '(' + slave.age + ' y.o. ' + slave.hairColor + ' hair)'
                    }
                  })
                }).val(null).trigger('change');
              });
            >><</done>>\
          <</dialog>>`,
        },
      },
    },
  },
  defaultStopOption: "✋ Leave $npc.pronoun alone",
  timeIncreaseNpcHunger: true,
};
