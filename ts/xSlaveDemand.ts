const punishment: NpcInteraction = {
  optionText: "🖐 Punish $npc.pronoun.",
  contents: "How should $npc.name be punished?",
  next: {
    clothes: {
      npcRequirements: ["haveClothes"],
      optionText: "🩲 Steal $npc.possessive clothes.",
      contents: `You take all off $npc.possessive clothes leaving $npc.name completely naked and say:
      "I'll be keeping this as punishment. From now on you'll go without clothes all day. And your $npc.genitals.all will bring good views for the house<<emoji 🤤>>."

      <<if $npc.lust gte 60>>\
        $npc.name blushes a little bit and says: "Ah!.. O-Okay <<emoji 🥺>>"
      <<else>>\
        $npc.name covers $npc.possessive genitals with both hands: "Nooo!, give it baaack!!<<emoji 😳>>"
      <</if>>\
      <<set _item = {
        name:'Used clothes(' + $npc.age + ' y.o.)',
        description:'Used clothes from a ' + $npc.age + ' year old',
        quantity: 1,
        tags:["person","clothes","used"]
      };
      Player.getInventory().add(_item);
      $npc.punishments.push("naked");>>
      (_item.description added to your inventory)`,
      npcStats: (npc) => {
        let stats = ["obedience+10", "-haveClothes"];
        if (npc.lust >= 60) stats.push("lust+10%");
        else stats.push("freedomWish-20");
        return stats;
      },
    },
    scold: {
      optionText: "🗯 Scold $npc.pronoun.",
      contents: "You scold $npc.name for $punishReason.",
      minutesCost: 2,
      npcStats: ["obedience+5"],
    },
    spank: {
      optionText: "🖐 Give $npc.pronoun a spanking.",
      minutesCost: 10,
      contents: `You grab $npc.name and force $npc.pronoun to bend over your lap.
      <<if $npc.haveClothes>>\
        You reveal $npc.possessive $npc.skin buttocks and start spanking $npc.pronoun.
      <<else>>\
        Since <<genPronounIs>> naked, you can feel $npc.possessive body warmth on your legs and start spanking $npc.possessive $npc.skin bare ass.
      <</if>>\

      <<npcSay "\
      <<if $npc.lust gte 70 && $npc.age gte 5>>\
        Ow!!...Yes!!...Punish me!!...I'm a bad $npc.title!!<<emoji 😩>>\
      <<elseif $npc.lust gte 50>>\
        Ow!..Ah!!...\
      <<elseif $npc.love gte 50>>\
        <<if $npc.age lt 5>>Waaaah!!!<<else>>I'm so sowwyyy!!<</if>><<emoji 😭>>\
      <<else>>\
        <<if $npc.age lt 5>>Nooo!!! Stoop iiit!!!<<else>>Ouch!! It hurts!! Please stop!!<</if>><<emoji 😫>>\
      <</if>>">>
      You let go of $npc.pronoun with visible tears running on $npc.possessive face.`,
      npcStats: (npc) => {
        let stats = ["obedience+10"];
        if (npc.lust >= 50) stats.push("lust+5%");
        else if (npc.love < 50) stats.push("freedomWish+5", "fear+20");
        return stats;
      },
    },
  },
  stopOption: "🚫 Don't do anything",
};
const wakeUpMorningInteraction: NpcInteraction = {
  optionText: "🌞 Wake up in the morning",
  contents: "<<sleep>>",
  action: true,
};
const wakeUpMorning: NpcInteractionOptions = {
  sleep: wakeUpMorningInteraction,
};
const wakeUpMorningBack: NpcInteraction = {
  optionText: "🔙 Do something else.",
  contents: `<<if $personWokeUp>>\
    $npc.GenPronoun <<npcVerbIs>> still on top of you lying naked as $npc.genPronoun look<<thirdPersonVerb>> you in the eye.\
  <<else>>\
    $npc.name is still sleeping on top of you.\
  <</if>>`,
  next: () =>
    window.Interactions.wakeUpAfterNightTogether
      .options as NpcInteractionOptions,
};
class OkSleepWithPlayerDemand {
  static baseOptions = () =>
    window.Interactions.okSleepWithPlayerDemand
      .options as NpcInteractionOptions;
  static somethingElse: NpcInteraction = {
    optionText: "🔙 Do something else",
    contents: `You're under the bed sheets with $npc.name.
    What do you want to do now?`,
    next: OkSleepWithPlayerDemand.baseOptions,
  };
}
window.Interactions["slaveEventHunger"] = {
  contents: `$npc.name is asking for food.
  <<run
    var name = 'hunger'
    Meter.del(name);
    Meter.add(name, {
        label: name.beautifyStat() + ':' + $npc[name],
        height: '20px',
        full: '#FF4136',
        empty: '#2ECC40'
    }, $npc[name] / 100);
    name = 'obedience'
    Meter.del(name);
    Meter.add(name, {
        label: name.beautifyStat() + ':' + $npc[name],
        height: '20px',
    }, $npc[name] / 100);
    $punishReason = 'demanding too much';
  >>\
  <<showmeter hunger>>\
  <<showmeter obedience>>\
  How do you want to handle it?`,
  options: {
    smallMeal: {
      optionText: "🥪 Give $npc.pronoun a small meal. (-10 hunger)",
      minutesCost: 10,
      contents: `You go to the kitchen to prepare something quick, come back and you give it to $npc.pronoun.
      <<npcSay "\
      <<if $npc.love lt 80>>\
        Thank you\
      <<else>>\
        Thank you <<npcAddressPlayer>><<emoji ❤>>\
      <</if>>.">>`,
      npcStats: ["hunger-10", "love+1", "freedomWish-1"],
    },
    fullMeal: {
      optionText: "🍝 Make $npc.pronoun a full meal. (-80 hunger)",
      minutesCost: 40,
      contents: `You cook a full meal in the kitchen. When you come back $npc.name $npc.eyeColor eyes widen as it sees and smells the good meal you prepared for $npc.pronoun. <<emoji 😮>>
      You put it down and $npc.genPronoun starts happily eating it <<emoji 😊>>
      <<npcSay "<<if $npc.love lt 80>>\
        Thank you!! It's really good!!\
      <<else>>\
        Thanks <<npcAddressPlayer>>!! I love you <<emoji ♥>>\
      <</if>>">>`,
      npcStats: ["hunger-80", "love+10", "freedomWish-20"],
    },
    cum: {
      playerRequirements: ["hasPenis"],
      optionText:
        "💦 Offer $npc.pronoun your ==sperm== white jelly. (-5 hunger)",
      minutesCost: 30,
      contents: `You show $npc.pronoun your dick while grabbing it with your hand and say:
      "Here, you can eat my special jelly. My body produces it, but you need to stimulate this to be able to get it out."

      <<npcSay "\
      <<if $npc.lust gte 80>>\
        <<set _willing = true>>\
        <<if $npc.age lt 4>>\
          Yay! White jelly!!<<emoji 😛>>\
        <<else>>\
          Yesh!!! I'll drink the white jelly!<<emoji 😛>>\
        <</if>>\
      <<elseif $npc.love gte 80>>\
        <<set _willing = true>>\
        Okay <<emoji ❤>>\
      <<elseif $npc.hunger gte 80>>\
        <<set _willing = true>>\
        <<if $npc.age lt 4>>\
          Hungryyy..<<emoji 😗>>\
        <<else>>\
          Anything<<if $npc.age gte 6>> is fine<</if>>.. Please... So hungry...\
        <</if>>\
      <<elseif $npc.hunger gte 50>>\
        <<if $npc.age lt 4>>\
          Okay...<<emoji 🙄>>\
        <<else>>\
          If there isn't really anything else for me to eat...<<emoji 😥>>\
        <</if>>\
      <<else>>\
        <<set _denied = true>>\
        <<emoji 😟>>Ugh!! no... I don't wanna...\
      <</if>>.">><<if !_denied>>

        <<if _willing>>$npc.name stretches out $npc.possessive hands to grab $npc.possessive "meal dispenser".
        <</if>>\
        With a hand in $npc.possessive $npc.hairColor $npc.hairStyle head you guide $npc.pronoun in giving you pleasure by licking and sucking your dick.
        The sounds of $npc.possessive wet tongue rubbing your penis inside $npc.possessive $npc.age year old mouth echoes on the basement's walls.

        <<playerSay "That's it. Good $npc.title. Just a little more and you'll have your meal.">>
        The feeling of $npc.possessive<<if $npc.age lt 10>> little<</if>> lips and tongue quickly brings you to the edge and start shooting your seed inside.
        <<if $npc.hunger gte 80>>\
          $npc.name is so hungry that, as soon as $npc.genPronoun feels your cum shooting on $npc.possessive tongue, eagerly eats your cum with passion till the last drop.

          <<npcSay "Haa... much better <<emoji 😫>>.">>
        <<elseif _willing>>\
          As you shoot you can hear and feel $npc.name gulping down your semen while $npc.possessive lips keep pursed around your cock.

          Right after your dick stops shooting, $npc.genPronoun sucks out the remaining sperm in your urethra. Closing up $npc.possessive lips as $npc.genPronoun slowly takes out your penis from $npc.possessive mouth.

          <<npcSay "Thanks <<npcAddressPlayer>>. That was yummy<<emoji 😋>>.">>
        <<else>>\
          You can see $npc.name making a weird face as you shoot your seed inside $npc.possessive mouth<<emoji 😫>>.
          $npc.GenPronoun steps back after taking in some cumshots. You can hear $npc.pronoun making a gulp with $npc.possessive hands covering $npc.possessive mouth.

          Finally, $npc.genPronoun chews in the remaining cum on $npc.possessive tongue.
          <<npcSay "<<if $npc.age lt 5>>It's yucky!! <<emoji 😟>><<else>>Ugh! It doesn't taste very good...<<emoji 😖>><</if>>">>
        <</if>>
      <</if>>`,
      altMinutes: (minutes) => (Temporary().denied ? 0 : minutes),
      npcStats: () => {
        let temp = Temporary();
        if (temp.denied) return null;
        let stats = ["hunger-5", "lust+5%", "mouthTraining+10"];
        if (temp.willing) stats.push("love+5");
        return stats;
      },
    },
    pussy: {
      playerRequirements: ["hasPussy"],
      optionText: "💦 Offer $npc.pronoun your love juice. (-5 hunger)",
      minutesCost: 30,
      contents: `You show $npc.pronoun your pussy and say:
      "Come here, you can drink my love juice. My body produces it, but you need to stimulate me down here to be able to get it out."
      <<npcSay "\
      <<if $npc.lust gte 80>>\
        <<set _willing = true>>\
        <<if $npc.age lt 4>>\
          <<npcAddressPlayer>>'s love juice!! Yay!!<<emoji 😛>>\
        <<else>>\
          Yesh!!! I'll drink your love juice!<<emoji 😛>>\
        <</if>>\
      <<elseif $npc.love gte 80>>\
        <<set _willing = true>>\
        Okay <<emoji ❤>>\
      <<elseif $npc.hunger gte 80>>\
        <<set _willing = true>>\
        <<if $npc.age lt 4>>\
          Hungryyy..<<emoji 😗>>\
        <<else>>\
          Anything<<if $npc.age gte 6>> is fine<</if>>.. Please... So hungry...\
        <</if>>\
      <<elseif $npc.hunger gte 50>>\
        <<if $npc.age lt 4>>\
          Okay...<<emoji 🙄>>\
        <<else>>\
          If there isn't really anything else for me to eat...<<emoji 😥>>\
        <</if>>\
      <<else>>\
        <<set _denied = true>>\
        <<emoji 😟>>Ugh!! no... I don't wanna...\
      <</if>>.">><<if !_denied>>

        <<if _willing>>$npc.name doesn't hesitate and puts $npc.possessive face between your legs while grabbing your legs.
        <</if>>\
        With a hand in $npc.possessive $npc.hairColor $npc.hairStyle head you guide $npc.pronoun in giving you pleasure by licking and sucking your pussy and clit.
        The sounds of $npc.possessive wet tongue gently slapping your privates echoes on the basement's walls.

        <<playerSay "That's it. Good $npc.title. Just a little more and you'll have your meal.">>
        The feeling of $npc.possessive<<if $npc.age lt 10>> little<</if>> lips and tongue caressing you down there finally brings you to the edge and start squirting.
        <<if $npc.hunger gte 80>>\
          $npc.name is so hungry that, as soon as $npc.genPronoun feels your love juice on $npc.pronoun tongue, eagerly drinks and sucks your nectar with passion till the last drop.

          <<npcSay "Haa... much better <<emoji 😫>>.">>
        <<elseif _willing>>\
          As you squirt, you can hear and feel $npc.name gulping down your nectar while $npc.possessive lips keep pressing on your pussy.

          Afterwards, $npc.genPronoun sucks out the remaining juice while doing a loud kiss down there.

          <<npcSay "Thanks <<npcAddressPlayer>>. That was yummy<<emoji 😋>>.">>
        <<else>>\
          You can see $npc.name making a weird face as you squirt in $npc.possessive mouth<<emoji 😫>>.
          $npc.GenPronoun steps back after taking a good portion of your nectar. You can hear $npc.pronoun making a gulp with $npc.possessive hand covering $npc.pronoun mouth.

          <<if $npc.age gte 5>>\
            <<npcSay "It tastes weird<<emoji 😑>>.">>\
          <</if>>\
        <</if>>\
      <</if>>`,
      altMinutes: (minutes) => (Temporary().denied ? 0 : minutes),
      npcStats: () =>
        (
          window.Interactions.slaveEventHunger.options["cum"]
            .npcStats as CallableFunction
        )(),
    },
    punish: punishment,
  },
};
window.Interactions["slaveEventSleepWithPlayer"] = {
  contents: `$npc.name would like to sleep together in the bed with you tonight.
  Would you like to accept?`,
  options: {
    yesNaked: {
      optionText:
        "😏 Yes, sure but I'm going to sleep without clothes is that okay with you.",
      npcStats: ["fear-1", "love+5"],
      contents:
        "<<personUniqueness sleepPlayerNaked>><<run Person.setAchievement('okSleepWithPlayer')>>",
    },
    yesClothes: {
      npcRequirements: ["haveClothes"],
      optionText: "🍑 Yes, but you'll have to take your clothes off.",
      npcStats: ["obedience+10", "love+5"],
      contents:
        "<<personUniqueness sleepPersonNaked>><<run Person.setAchievement('okSleepWithPlayer')>>",
    },
    no: {
      optionText: "🚫 No.",
      contents: "$npc.name looks sad<<emoji 😢>>",
      npcStats: ["love-5%"],
    },
  },
};
window.Interactions["okSleepWithPlayerDemand"] = {
  contents: `You call $npc.name over to go to sleep and $npc.genPronoun approaches you.
  <<if $npc.uniqueness.shy or $npc.love gte 80>>$npc.GenPronoun blush<<thirdPersonVerbPlural>>
  <<else>>$npc.GenPronoun look<<thirdPersonVerb>> nervous...
  <</if>><<if $npc.love gte 80>>\
    $npc.GenPronoun happily take<<thirdPersonVerb>> all of $npc.possessive clothes off.<<if $npc.lust gte 60>>You can see $npc.possessive <<- $npc.hasPussy ? "wet " + $npc.genitals.female : "erected " + $npc.genitals.male>><<emoji 👀>><<npcStimulated>><</if>>
    $npc.GenPronoun hastily climb<<thirdPersonVerb>> in bed with you.
    You also climb in bed with $npc.pronoun, after taking your clothes off.
  <<else>>\
    $npc.GenPronoun slowly take<<thirdPersonVerb>> $npc.possessive clothes off and then climb<<thirdPersonVerb>> on the bed.
    You take your clothes off and climb the bed after $npc.pronoun.
  <</if>><<npcStats>>`,
  defaultStopOption: false, //This interaction cannot be stopped since the player sleeps after it.
  options: {
    touchGenitals: {
      optionText: "👆🏽 Touch $npc.possessive $npc.genitals.all",
      contents: `You touch $npc.possessive $npc.genitals.all to see that <<genPronounIs>> <<- $npc.hasPussy ? 'wet' : 'erected'>>.<<if $npc.lust gte 60>>
        <<if $npc.hasPussy>>\
          You touch $npc.possessive $npc.genitals.female and it easily slides in.
        <<elseif $npc.hasPenis>>\
          You slowly stroke $npc.possessive erected $npc.age year old $npc.genitals.male.
        <</if>>\
      <</if>><<npcStimulated>>`,
      minutesCost: 3,
      next: {
        cum: {
          optionText: "💦 Make $npc.pronoun cum (end).",
          minutesCost: 10,
          contents: `A slow moan escapes $npc.possessive mouth as you put your hand over $npc.possessive $npc.genitals.all and slowly pleasure $npc.possessive <<- $npc.hasPussy ? 'clitoris' : $npc.genitals.male>>.
          You continue to rub $npc.pronoun until $npc.genPronoun orgasm<<thirdPersonVerb>> and spam<<thirdPersonVerb>> around the bed<<if $npc.hasPussy>> and wetting the bed a little<</if>>.
          $npc.GenPronoun go<<thirdPersonVerbPlural>> to sleep after that.<<npcCum>>`,
          next: wakeUpMorning,
        },
        back: OkSleepWithPlayerDemand.somethingElse,
      },
    },
    touchAss: {
      optionText: "🍑🖐 Touch $npc.possessive ass.",
      minutesCost: 3,
      contents: `You slide your hand down $npc.possessive waist and back to touch the $npc.age year old butt.
      The sensation on your hand feels amazing as you caress $npc.possessive butt cheeks and crack.<<npcStimulated>>`,
      next: OkSleepWithPlayerDemand.baseOptions,
    },
    pat: {
      optionText: "🥰👋 Pat $npc.possessive head.",
      minutesCost: 3,
      contents:
        "You gently take you hand around $npc.possessive face and move it towards $npc.pronoun head through $npc.possessive $npc.hairColor hair and then you slowly rub $npc.possessive head as $npc.genPronoun looks you in the eyes directly and trusts you.",
      npcStats: ["love+1"],
      next: OkSleepWithPlayerDemand.baseOptions,
    },
    penAss: {
      playerRequirements: ["hasPenis"],
      npcRequirements: ["anusTraining>=40"],
      showDisabled: "Anus Training 40",
      optionText: "🍑🍆 Penetrate $npc.possessive ass.",
      minutesCost: 10,
      npcStats: ["anusTraining+5"],
      contents: `You move your body over $npc.pronoun while still inside your bed sheets. $npc.GenPronoun opens $npc.possessive legs letting you invade $npc.possessive private space. You press your erected dick on $npc.possessive ass and $npc.genPronoun looks up at you while you enter inside $npc.possessive body. You can see $npc.possessive expression change as $npc.genPronoun feels <<- $npc.pronoun>>self being penetrated.
      You slowly continue to penetrate $npc.possessive ass as $npc.genPronoun continues to moan a little.<<checkNpcVirgin anal>>`,
      next: {
        cumOn: {
          optionText: "💦 Cum on $npc.pronoun (end).",
          minutesCost: 1,
          contents: `You pull out your dick and spread all your cum on $npc.possessive ass. (Bedsheets are completely dirty)<<run Player.manageEnergy(3);$npc.bodySpermAmount++>>
            You are too tired to do anything and you sleep after that.`,
          next: wakeUpMorning,
        },
        cumIn: {
          optionText: "💦 Cum in $npc.possessive ass (end).",
          minutesCost: 1,
          contents: `You bring $npc.pronoun closer to you and hug $npc.pronoun tightly as you unload all of your cum inside $npc.possessive ass. (Bedsheets are a little dirty)<<run Player.manageEnergy(3);$npc.assSpermAmount++>>
            You are too tired to do anything and you sleep after that.`,
          next: wakeUpMorning,
        },
        drink: {
          optionText: "🥛 Tell $npc.pronoun to drink your cum (end).",
          minutesCost: 1,
          contents: `You pull your dick out and place your hand on $npc.possessive waist as you rotate $npc.pronoun towards you and you tell $npc.pronoun to put $npc.possessive mouth on your dick and drink your cum.
          $npc.GenPronoun happily drinks your cum.<<run Player.manageEnergy(3)>>
          You are too tired to do anything and you sleep after that.`,
          npcStats: ["hunger-5"],
          next: wakeUpMorning,
        },
        back: {
          optionText: "🔙 Pull out.",
          contents: "You pop out your dick from $npc.possessive asshole",
          next: OkSleepWithPlayerDemand.baseOptions,
        },
      },
    },
    penPussy: {
      playerRequirements: ["hasPenis"],
      npcRequirements: ["love>=80", "hasPussy", "pussyTraining>=40"],
      showDisabled:
        "hasPussy=><<-Person.getMinRequirementsSentence({love:80,pussyTraining:40})>>",
      optionText: "🍆 Penetrate $npc.possessive $npc.genitals.female",
      minutesCost: 10,
      npcStats: ["pussyTraining+5"],
      contents: `You move your body over $npc.pronoun while still inside your bed sheets. $npc.GenPronoun opens $npc.possessive legs letting you invade $npc.possessive private space. You press your erected dick on $npc.possessive cunny and $npc.genPronoun looks up at you while you enter inside $npc.possessive body. You can see $npc.possessive expression change as $npc.genPronoun feels <<- $npc.pronoun>>self being penetrated.
      A small moan escapes $npc.possessive body as you penetrate $npc.pronoun.<<checkNpcVirgin vagina>><<npcStimulated>>`,
      next: {
        deep: {
          optionText: "🍆 Penetrate deeper",
          contents: `You put your hand on $npc.possessive ass to penetrate deeper inside $npc.possessive cunny as you reach the deepest part of $npc.possessive cunny.
          $npc.GenPronoun clench<<thirdPersonVerbPlural>> and tighten<<thirdPersonVerb>> as your top of your dick kisses $npc.possessive womb.`,
          npcStats: ["pussyTraining+5"],
          next: {
            cumIn: {
              optionText: "💦 Cum inside (end).",
              contents: `While your dick touches $npc.possessive deepest part you release your semen inside $npc.pronoun and cumming i side $npc.possessive undeveloped cervix.
              You are too tired to do anything and you sleep after that.<<run Player.manageEnergy(3);$npc.pussySpermAmount++>>`,
              next: wakeUpMorning,
            },
            back: {
              optionText: "🔙 Pull out.",
              contents: "You slide it out of $npc.name's $npc.genitals.female.",
              next: OkSleepWithPlayerDemand.baseOptions,
            },
          },
        },
        back: {
          optionText: "🔙 Pull out.",
          contents: "You slide it out of $npc.name's $npc.genitals.female.",
          next: OkSleepWithPlayerDemand.baseOptions,
        },
      },
    },
    cuddle: {
      optionText: "😴 Cuddle with $npc.name and sleep.",
      contents:
        "You get close to $npc.name under the sheets and tenderly hold $npc.name close in your arms until you two fall sleep.",
      npcStats: ["love+10", "fear-20"],
      next: wakeUpMorning,
    },
    sleep: {
      optionText: "💤 Just sleep.",
      contents: "<<sleep>>",
      action: true,
    },
  },
};
window.Interactions["wakeUpAfterNightTogether"] = {
  defaultStopOption: "🔙 Leave $npc.pronoun.",
  beforeStop: "<<run $player.sleeping=true>>",
  contents: `<<run Person.removeAchievement('okSleepWithPlayer');$personWokeUp = false>>\
  Morning light hits your face escaping from the window. You open your eyes and see $npc.name laying on top of you.<<switch $npc.hairColor>>
    <<case blonde>>
      $npc.Possessive blond hair glows in the sunlight as you admire $npc.possessive $npc.skin body.
    <<case black>>
    <<case "dark brown">>
    <<case "midnight blue">>
      $npc.Possessive $npc.hairColor hair looks sharp in the sunlight as you admire $npc.possessive $npc.skin body.
    <<case red>>
      $npc.Possessive ginger hair fills the room with reddish light in the sunlight as you admire $npc.possessive $npc.skin body.
  <</switch>>`,
  options: {
    wakeHer: {
      canBeShown: () => !Variables().personWokeUp,
      optionText: "⏰ Wake $npc.pronoun up.",
      contents: `You try to wake $npc.pronoun up.
      $npc.GenPronoun groan<<thirdPersonVerb>> and wake<<thirdPersonVerb>> up.<<set $personWokeUp = true>>
      $npc.GenPronoun <<npcVerbIs>> still on top of you lying naked as $npc.genPronoun look<<thirdPersonVerb>> you in the eye.`,
      npcStats: ["fear-20", "love+5%", "freedomWish-5"],
      next: () =>
        ({
          kiss: {
            optionText: "💋 Kiss $npc.pronoun.",
            contents:
              "You kiss $npc.pronoun slowly waking $npc.pronoun up even further.",
            npcStats: ["love+5%"],
            next: () => window.Interactions.wakeUpAfterNightTogether.options,
          },
          ...window.Interactions.wakeUpAfterNightTogether.options,
        } as NpcInteractionOptions),
    },
    touchGenitals: {
      optionText: "🖐 Touch $npc.possessive $npc.genitals.all.",
      minutesCost: 2,
      contents: `You gently move your hand below $npc.possessive waist and touch $npc.possessive $npc.genitals.all.
      It takes $npc.pronoun a couple of seconds for $npc.pronoun to get <<- $npc.hasPenis ? "hard" : "wet">>.<<npcStimulated>><<if $npc.hasPussy>>
      After that your finger slides smoothly inside $npc.pronoun tight $npc.genitals.all.<</if>>`,
      npcStats: (npc) =>
        npc.hasPussy ? ["pussyTraining%+20", "lust+1%"] : ["lust+1%"],
      next: {
        cum: {
          optionText: "💦 Make $npc.pronoun cum (end).",
          minutesCost: 10,
          contents: `<<if $npc.age gt 4>><<npcSay "Ah...   .  . This feels soo good">>
          <</if>>$npc.GenPronoun scream<<thirdPersonVerb>> and orgasm<<thirdPersonVerb>>.<<npcCum>>`,
          npcStats: ["love+10", "freedomWish-10"],
        },
        back: wakeUpMorningBack,
      },
    },
    touchAss: {
      optionText: "🍑 Touch $npc.possessive ass.",
      minutesCost: 2,
      contents: `You gently move your hand below $npc.possessive waist and touch $npc.possessive asshole.
      <<npcSay "Mnn- hmnn">> $npc.GenPronoun moan<<thirdPersonVerb>> a little.
      Your finger moves around the edge of $npc.possessive asshole for a couple of seconds and then it moves inside.`,
      npcStats: ["anusTraining%+20", "lust+1%"],
      next: () =>
        window.Interactions.wakeUpAfterNightTogether
          .options as NpcInteractionOptions,
    },
    lickGenitals: {
      optionText: "👅 Lick $npc.possessive $npc.genitals.all. (end)",
      minutesCost: 20,
      contents: `You pick $npc.pronoun up by the waist and put $npc.pronoun beside $npc.pronoun.
      You slowly take your hand down $npc.possessive body<<if $npc.hasPussy>> and put your fingers on $npc.possessive $npc.genitals.female as you spread it apart<</if>>.<<if $npc.hasPussy>>
      You put your lips on $npc.possessive clitoris and start moving your tongue slowly.<</if>>
      $npc.GenPronoun moan<<thirdPersonVerb>> a little and <<if $npc.hasPussy>>gets wetter<<else>>$npc.possessive penis gets harder<</if>>.
      You increase your speed and start moving your tongue as fast as you can.
      $npc.GenPronoun moan<<thirdPersonVerb>> loudly and grip<<thirdPersonVerb>> the bedsheets tightly.
      As $npc.pronoun clench<<thirdPersonVerbPlural>> $npc.possessive butt cheeks in pleasure<<if $npc.hasPussy>> wetting the bed a little<</if>>. 
      $npc.Possessive face is bright red.`,
      npcStats: ["love+10", "freedomWish-10"],
    },
  },
};
window.Interactions["slaveEventCook"] = {
  contents: `$npc.name is cooking<<if Person.getInventory().hasItem('apron')>><<elseif !$npc.hasClothes>><</if>>`,
  options: {
    kissNeck: {
      optionText:
        "💋 Surprise $npc.pronoun with a kiss on $npc.possessive neck.",
      contents:
        "You silently approach $npc.pronoun from behind and slowly press your lips on $npc.possessive neck. (WIP)",
    },
    lookLow: {
      npcRequirements: ["!haveClothes"],
      optionText: "👀 Look at $npc.pronoun with a lower angle.",
      contents: "WIP",
    },
    gropeAss: {
      optionText: "🖐 Grope $npc.possessive ass!",
      contents: "WIP",
    },
  },
};
