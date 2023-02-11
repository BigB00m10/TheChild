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
        count: 1,
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
        Since $npc.genPronoun<<thirdPerson "'s" "'re">> naked, you can feel $npc.possessive body warmth on your legs and start spanking $npc.possessive $npc.skin bare ass.
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
    $npc.GenPronoun <<thirdPerson "is" "are">> still on top of you lying naked as $npc.genPronoun <<thirdPerson "looks" "look">> you in the eye.\
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
      You put it down and $npc.genPronoun <<thirdPerson "starts" "start">> happily eating it <<emoji 😊>>
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
        The sounds of $npc.possessive wet tongue rubbing your penis inside $npc.possessive $npc.age year old mouth echoes on the  $scenery's walls.

        <<playerSay "That's it. Good $npc.title. Just a little more and you'll have your meal.">>
        The feeling of $npc.possessive<<if $npc.age lt 10>> little<</if>> lips and tongue quickly brings you to the edge and start shooting your seed inside.
        <<if $npc.hunger gte 80>>\
          $npc.name is so hungry that, as soon as $npc.genPronoun <<thirdPerson "feels" "feel">> your cum shooting on $npc.possessive tongue, $npc.genPronoun eagerly <<thirdPerson "eats" "eat">> your cum with passion till the last drop.

          <<npcSay "Haa... much better <<emoji 😫>>.">>
        <<elseif _willing>>\
          As you shoot you can hear and feel $npc.name gulping down your semen while $npc.possessive lips keep pursed around your cock.

          Right after your dick stops shooting, $npc.genPronoun <<thirdPerson "sucks" "suck">> out the remaining sperm in your urethra. Closing up $npc.possessive lips as $npc.genPronoun slowly <<thirdPerson "takes" "take">> out your penis from $npc.possessive mouth.

          <<npcSay "Thanks <<npcAddressPlayer>>. That was yummy<<emoji 😋>>.">>
        <<else>>\
          You can see $npc.name making a weird face as you shoot your seed inside $npc.possessive mouth<<emoji 😫>>.
          $npc.GenPronoun <<thirdPerson "steps" "step">> back after taking in some cumshots. You can hear $npc.pronoun making a gulp with $npc.possessive hands covering $npc.possessive mouth.

          Finally, $npc.genPronoun <<thirdPerson "chews" "chew">> on the remaining cum on $npc.possessive tongue.
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
          $npc.name is so hungry that, as soon as $npc.genPronoun <<thirdPerson "feels" "feel">> your love juice on $npc.possessive tongue, $npc.genPronoun eagerly <<thirdPerson "drinks" "drink">> and <<thirdPerson "sucks" "suck">> your nectar with passion till the last drop.

          <<npcSay "Haa... much better <<emoji 😫>>.">>
        <<elseif _willing>>\
          As you squirt, you can hear and feel $npc.name gulping down your nectar while $npc.possessive lips keep pressing on your pussy.

          Afterwards, $npc.genPronoun <<thirdPerson "sucks" "suck">> out the remaining juice while doing a loud kiss down there.

          <<npcSay "Thanks <<npcAddressPlayer>>. That was yummy<<emoji 😋>>.">>
        <<else>>\
          You can see $npc.name making a weird face as you squirt in $npc.possessive mouth<<emoji 😫>>.
          $npc.GenPronoun <<thirdPerson "steps" "step">> back after taking a good portion of your nectar. You can hear $npc.pronoun making a gulp with $npc.possessive hand covering $npc.possessive mouth.

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
    breastfeed: {
      playerRequirements: ["hasBoobs", "lactating"],
      optionText: "🤱 Breastfeed (-30 hunger)",
      minutesCost: 25,
      contents: `You sit down and show $npc.pronoun your breast and say:
      "Come have some of my milk."
      <<if $npc.age lte 3>>\
        <<set _willing = true>>\
        <<if $npc.lust gt 60>>\
          <<npcSay "Boobies! Yay!<<emoji 😛>>">>
          <<set _sexual = true>>\
        <<elseif $npc.love gt 80>>\
          <<npcSay "Okay <<emoji ❤>>">>
        <<elseif $npc.hunger gt 40>>\
          <<npcSay "So hungryyy...<<emoji 🥺>>">>
        <<else>>\
          <<npcSay "Hungry..<<emoji 😗>>">>
        <</if>>\
      <<elseif $npc.age lte 9>>\
        <<set _sexual = true>>\
        <<if $npc.lust gt 60>>\
          <<set _willing = true>>\
          <<npcSay "Boobs! Yes!<<emoji 😛>>">>
        <<elseif $npc.love gt 80>>\
          <<set _willing = true>>\
          <<npcSay "Okay <<emoji ❤>>">>
        <<elseif $npc.hunger gt 50>>\
          <<set _willing = true>>\
          <<npcSay "Please, I'm so hungry!<<emoji 😗>>">>
        <<elseif $npc.hunger gt 35>>\
          <<npcSay "I'm not a baby, but if there's nothing else to eat...<<emoji 🙄>>">>
        <<else>>\
          <<set _denied = true>>\
          <<npcSay "I'm not a baby.<<emoji 😟>>">>
        <</if>>\
      <<else>>\
        <<set _sexual = true>>\
        <<if $npc.lust gt 60>>\
          <<set _willing = true>>\
          <<npcSay "Boobs! Yes!<<emoji 😛>>">>
        <<elseif $npc.love gt 80>>\
          <<set _willing = true>>\
          <<npcSay "Okay <<emoji ❤>>">>
        <<elseif $npc.hunger gt 80>>\
          <<set _willing = true>>\
          <<npcSay "Please, anything, I'm so hungry!<<emoji 😗>>">>
        <<elseif $npc.hunger gt 50>>\
          <<npcSay "That's gross, but if there's nothing else to eat...<<emoji 🙄>>">>
        <<else>>\
          <<set _denied = true>>\
          <<npcSay "Ew, no!<<emoji 😟>>">>
        <</if>>\
      <</if>>\
      <<if !_denied>>\
        <<if _willing>>\
          $npc.name <<if $npc.uniqueness.shy>>timidley approaches and <</if>>climbs into your lap.\
          <<if $npc.uniqueness.curious>>$npc.GenPronoun <<thirdPerson "studies" "study">> your boobs for a moment.<</if>>\
          $npc.GenPronoun eagerly <<thirdPerson "finds" "find">> your nipple.
        <<else>>\
          You pull $npc.name into your lap and guide $npc.possessive head to your nipple.
        <</if>>\
        <<if $npc.uniqueness.naughty || $npc.lust gt 60>>$npc.Possessive hand plays with your other boob.<</if>>\
        You run your hand through $npc.possessive $npc.hairColor $npc.hairStyle hair as you feed $npc.pronoun.\
        <<if $npc.uniqueness.energetic || $npc.hunger gt 40 >>$npc.GenPronoun vigerously <<thirdPerson "sucks" "suck">> down your milk.<</if>>\
        <<if _willing>>$npc.GenPronoun <<thirdPerson "hums" "hum" contentedly>> and <<thirdPerson "relaxes" "relax">> in your arms.<</if>>
      <</if>>
      `,
      altMinutes: (minutes) => (Temporary().denied ? 0 : minutes),
      npcStats: () => {
        let temp = Temporary();
        if (temp.denied) return null;
        let stats = ["hunger-30", "fear-5"];
        if (temp.sexual) {
          stats.push("lust+3%");
          stats.push("mouthTraining+10")
        }
        if (temp.willing) stats.push("love+10");
        return stats;
      },
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
  contents: `You call $npc.name over to go to sleep and $npc.genPronoun <<thirdPerson "approaches" "approach">> you.
  <<if $npc.uniqueness.shy or $npc.love gte 80>>$npc.GenPronoun <<thirdPerson "blushes" "blush">>
  <<else>>$npc.GenPronoun <<thirdPerson "looks" "look">> nervous...
  <</if>><<if $npc.love gte 80>>\
    <<if $npc.haveClothes>>\
      $npc.GenPronoun happily <<thirdPerson "takes" "take">> all of $npc.possessive clothes off.
    <<elseif Person.getInventory().has('cooking apron')>>\
      $npc.GenPronoun happily <<thirdPerson "takes" "take">> off $npc.possessive apron.
    <</if>>\
    <<if $npc.lust gte 60>>\
      You can see $npc.possessive <<- $npc.hasPussy ? "wet " + $npc.genitals.female : "erected " + $npc.genitals.male>><<emoji 👀>><<npcStimulated>>
    <</if>>\
    $npc.GenPronoun hastily <<thirdPerson "climbs" "climb">> in bed with you.
    You also climb in bed with $npc.pronoun, after taking your clothes off.
  <<else>>\
    $npc.GenPronoun slowly <<thirdPerson "takes" "take">> $npc.possessive clothes off and then <<thirdPerson "climbs" "climb">> on the bed.
    You take your clothes off and climb the bed after $npc.pronoun.
  <</if>><<npcStats>>`,
  defaultStopOption: false, //This interaction cannot be stopped since the player sleeps after it.
  options: {
    touchGenitals: {
      optionText: "👆🏽 Touch $npc.possessive $npc.genitals.all",
      contents: `You touch $npc.possessive $npc.genitals.all to see that $npc.genPronoun<<thirdPerson "'s" "'re">> <<- $npc.hasPussy ? 'wet' : 'erected'>>.<<if $npc.lust gte 60>>
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
          You continue to rub $npc.pronoun until $npc.genPronoun <<thirdPerson "orgasms" "orgasm">> and <<thirdPerson "spams" "spam">> around the bed<<if $npc.hasPussy>> and <<thirdPerson "wets" "wet">> the bed a little<</if>>.
          $npc.GenPronoun <<thirdPerson "goes" "go">> to sleep after that.<<npcCum>>`,
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
    touchBoobs: {
      npcRequirements: ["hasBoobs"],
      optionText: "🍈🍈 Fondle $npc.possessive boobs.",
      minutesCost: 3,
      contents:
        `You bring your hands up to $npc.possessive beautiful melons and softly rub them, your thumbs brushing $npc.possessive nipples.`,
      npcStats: ["lust+3%"],
    },
    suckBoobs: {
      npcRequirements: ["hasBoobs"],
      optionText: "🍈🍈👄 Suck $npc.possessive boobs.",
      minutesCost: 10,
      contents:
        `You kiss your way down $npc.possessive neck and chest to $npc.possessive nipple. You suck it into your mouth and gently suckle. Your tongue makes circles around $npc.possessive nipple<<if $npc.lactating>>, lapping up their delicious milk<</if>>.`,
      npcStats: ["lust+10%"],
    },
    pat: {
      optionText: "🥰👋 Pat $npc.possessive head.",
      minutesCost: 3,
      contents:
        `You gently take you hand around $npc.possessive face and move it towards $npc.possessive head through $npc.possessive $npc.hairColor hair and then you slowly rub $npc.possessive head as $npc.GenPronoun <<thirdPerson "looks" "look">> you in the eyes directly. $npc.GenPronoun <<thirdPerson "trusts" "trust">> you.`,
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
      contents: `You move your body over $npc.pronoun while still inside your bed sheets. $npc.GenPronoun <<thirdPerson "opens" "open">> $npc.possessive legs letting you invade $npc.possessive private space. You press your erected dick on $npc.possessive ass and $npc.genPronoun <<thirdPerson "looks" "look">> up at you while you enter inside $npc.possessive body. You can see $npc.possessive expression change as $npc.genPronoun <<thirdPerson "feels" "feel">> <<- $npc.pronoun>>self being penetrated.
      You slowly continue to penetrate $npc.possessive ass as $npc.genPronoun <<thirdPerson "continues" "continue">> to moan a little.<<checkNpcVirgin anal>>`,
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
          $npc.GenPronoun happily <<thirdPerson "drinks" "drink">> your cum.<<run Player.manageEnergy(3)>>
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
      contents: `You move your body over $npc.pronoun while still inside your bed sheets. $npc.GenPronoun <<thirdPerson "opens" "open">> $npc.possessive legs letting you invade $npc.possessive private space. You press your erected dick on $npc.possessive cunny and $npc.genPronoun <<thirdPerson "looks" "look">> up at you while you enter inside $npc.possessive body. You can see $npc.possessive expression change as $npc.genPronoun <<thirdPerson "feels" "feel">> <<- $npc.pronoun>>self being penetrated.
      A small moan escapes $npc.possessive body as you penetrate $npc.pronoun.<<checkNpcVirgin vagina>><<npcStimulated>>`,
      next: {
        deep: {
          optionText: "🍆 Penetrate deeper",
          contents: `You put your hand on $npc.possessive ass to penetrate deeper inside $npc.possessive cunny as you reach the deepest part of $npc.possessive cunny.
          $npc.GenPronoun <<thirdPerson "clenches" "clench">> and <<thirdPerson "tightens" "tighten">> as the top of your dick kisses $npc.possessive womb.`,
          npcStats: ["pussyTraining+5"],
          next: {
            cumIn: {
              optionText: "💦 Cum inside (end).",
              contents: `While your dick touches $npc.possessive deepest part you release your semen inside $npc.pronoun and cumming inside $npc.possessive undeveloped cervix.
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
      $npc.GenPronoun <<thirdPerson "groans" "groan">> and <<thirdPerson "wakes" "wake">> up.<<set $personWokeUp = true>>
      $npc.GenPronoun <<thirdPerson "is" "are">> still on top of you lying naked as $npc.genPronoun <<thirdPerson "looks" "look">> you in the eye.`,
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
      It takes a couple of seconds for $npc.pronoun to get <<- $npc.hasPenis ? "hard" : "wet">>.<<npcStimulated>><<if $npc.hasPussy>>
      After that your finger slides smoothly inside $npc.possessive tight $npc.genitals.all.<</if>>`,
      npcStats: (npc) =>
        npc.hasPussy ? ["pussyTraining%+20", "lust+1%"] : ["lust+1%"],
      next: {
        cum: {
          optionText: "💦 Make $npc.pronoun cum (end).",
          minutesCost: 10,
          contents: `<<if $npc.age gt 4>><<npcSay "Ah...   .  . This feels soo good">>
          <</if>>$npc.GenPronoun <<thirdPerson "screams" "scream">> and <<thirdPerson "orgasms" "orgasm">>.<<npcCum>>`,
          npcStats: ["love+10", "freedomWish-10"],
        },
        back: wakeUpMorningBack,
      },
    },
    touchAss: {
      optionText: "🍑 Touch $npc.possessive ass.",
      minutesCost: 2,
      contents: `You gently move your hand below $npc.possessive waist and touch $npc.possessive asshole.
      <<npcSay "Mnn- hmnn">> $npc.GenPronoun <<thirdPerson "moans" "moan">> a little.
      Your finger moves around the edge of $npc.possessive asshole for a couple of seconds and then it moves inside.`,
      npcStats: ["anusTraining%+20", "lust+1%"],
      next: () =>
        window.Interactions.wakeUpAfterNightTogether
          .options as NpcInteractionOptions,
    },
    lickGenitals: {
      optionText: "👅 Lick $npc.possessive $npc.genitals.all. (end)",
      minutesCost: 20,
      contents: `You pick $npc.pronoun up by the waist and put $npc.pronoun beside you.
      You slowly take your hand down $npc.possessive body<<if $npc.hasPussy>> and put your fingers on $npc.possessive $npc.genitals.female as you spread it apart<</if>>.<<if $npc.hasPussy>>
      You put your lips on $npc.possessive clitoris and start moving your tongue slowly.<</if>>
      $npc.GenPronoun <<thirdPerson "moans" "moan">> a little and <<if $npc.hasPussy>><<thirdPerson "gets" "get">> wetter<<else>>$npc.possessive penis gets harder<</if>>.
      You increase your speed and start moving your tongue as fast as you can.
      $npc.GenPronoun <<thirdPerson "moans" "moan">> loudly and <<thirdPerson "grips" "grip">> the bedsheets tightly.
      As $npc.genPronoun <<thirdPerson "clenches" "clench">> $npc.possessive butt cheeks in pleasure<<if $npc.hasPussy>> wetting the bed a little<</if>>. 
      $npc.Possessive face is bright red.`,
      npcStats: ["love+10", "freedomWish-10"],
    },
    touchBoobs: {
      npcRequirements: ["hasBoobs"],
      optionText: "🍈🍈 Fondle $npc.possessive boobs.",
      minutesCost: 3,
      contents:
        `You bring your hands up to $npc.possessive beautiful melons and softly rub them, your thumbs brushing $npc.possessive nipples.`,
      npcStats: ["lust+3%"],
    },
    suckBoobs: {
      npcRequirements: ["hasBoobs"],
      optionText: "🍈🍈👄 Suck $npc.possessive boobs.",
      minutesCost: 10,
      contents:
        `You kiss your way down $npc.possessive neck and chest to $npc.possessive nipple. You suck it into your mouth and gently suckle. Your tongue makes circles around $npc.possessive nipple<<if $npc.lactating>>, lapping up their delicious milk<</if>>.`,
      npcStats: ["lust+10%"],
    },
  },
};
let afterSpread = () =>
  (<CallableFunction>baseInteractionOptions().lookLow.next)().spread.next;
let afterSexOption = () => afterSpread().sex.next();
function overrideOptionsBacks(
  base: NpcInteractionOptions,
  back: NpcInteraction
) {
  for (const optionName in base) {
    if (optionName == "back") base.back = back;
    else if (optionName == "out") base.out = back;
    else {
      let option: NpcInteraction = base[optionName];
      if (option.next) overrideBacks(option, back);
    }
  }
}
function overrideBacks(base: NpcInteraction, back: NpcInteraction) {
  if (typeof base.next != "object") {
    let nextFunc = base.next;
    base.next = () => {
      let options = nextFunc();
      overrideOptionsBacks(options, back);
      return options;
    };
    return;
  }
  base.next = { ...base.next };
  overrideOptionsBacks(base.next, back);
}
const goToStartSlaveEventCookOption: NpcInteraction = {
  optionText: "🔙 Go back",
  contents: `<<openNpcInteraction slaveEventCook>>`,
  action: true,
};
window.Interactions["slaveEventCook"] = {
  defaultStopOption: "🛑 Leave $npc.pronoun alone",
  contents: `$npc.name is cooking\
  <<if Person.getInventory().has('cooking apron')>>\
    using the apron that you gave $npc.pronoun.\
    <<if !$npc.haveClothes>>\
      It's pretty obvious that $npc.genPronoun<<thirdPerson "'s" "'re">> naked underneath.<<emoji 👀>>\
    <</if>>\
  <<elseif !$npc.haveClothes>>\
    naked.\
  <</if>>`,
  options: {
    kissNeck: {
      optionText:
        "💋 Surprise $npc.pronoun with a kiss on $npc.possessive neck.",
      minutesCost: 5,
      npcStats: ["love+5%"],
      contents: `You silently approach $npc.pronoun from behind and slowly press your lips on $npc.possessive neck while you grab $npc.possessive waist and gently press it towards you.
      <<personUniqueness surpriseNeckKiss>>`,
      next: () => baseInteractionOptions(),
    },
    pullDownClothes: {
      canBeShown: () => !Temporary().pulledDownClothes,
      npcRequirements: ["haveClothes"],
      optionText: "👇 Pull $npc.possessive clothes down",
      contents:
        "You pull down $npc.possessive clothes exposing $npc.possessive naked butt.<<set _pulledDownClothes=true>>",
      next: () => baseInteractionOptions(),
    },
    lookLow: {
      canBeShown: () =>
        !Variables().npc.haveClothes || Temporary().pulledDownClothes,
      optionText: "👀 Look at $npc.pronoun with a lower angle.",
      contents: `You deliberately crouch down behind $npc.possessive. Enough to properly admire $npc.possessive cute ass and <<if $npc.hasPussy>>$npc.genitals.female<<else>>a peek of $npc.possessive balls<</if>>.
      <<personUniqueness noticedBeingLookedLewdly>>`,
      next: () =>
        <NpcInteractionOptions>{
          gropeAss: baseInteractionOptions().gropeAss,
          spread: {
            optionText: "👐 Spread $npc.possessive private parts.",
            npcStats: ["lust+5%"],
            contents: `You grab both of $npc.possessive butt cheeks and spread them wide, revealing $npc.possessive bumhole<<if $npc.hasPussy>> and $npc.genitals.female<</if>>.
            <<personUniqueness spreadPrivates>>`,
            next: {
              lick: {
                optionText: "👅 Lick $npc.pronoun",
                minutesCost: 10,
                npcStats: ["+aroused", "lust+20%"],
                contents: `You get your face closer to $npc.possessive privates and start licking $npc.pronoun.
                <<npcSay "Hah!..Hah!..Ahn!">>
                $npc.GenPronoun <<thirdPerson "has" "have">> a delicious taste<<emoji 😛>>`,
                next: afterSpread,
              },
              sex: {
                playerRequirements: ["hasPenis"],
                optionText: "🍆 Get ready for sex.",
                contents: `You place yourself behind $npc.pronoun and make $npc.pronoun bend over the kitchen. $npc.GenPronoun obediently <<thirdPerson "lets" "let">> you do it without resistance.`,
                next() {
                  return {
                    pushDickVag: {
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
                          next: () => afterSexOption().pushDickVag.next,
                          altOptions: (npc, current) => {
                            if (Temporary().cockEntered) {
                              Variables().npcInteractionRoute =
                                "slaveEventCook.lookLow.spread.sex.pushDickVag.ram";
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
                                afterSexOption().pushDickVag.next.ram.next,
                            },
                            fast: {
                              optionText: "⏩ Fast piston.",
                              contents: `You thrust your dick into $npc.name's $npc.genitals.female. Making $npc.pronoun bounce with a fast pelvic piston movement.
                              <<run Player.manageEnergy(3)>>\
                              <<if $npc.pussyTraining lt 40>>\
                                $npc.GenPronoun <<if $npc.age gt 0>><<thirdPerson "pushes" "push">> you while crying<<else>>cries<</if>> desperately. <<emoji 😭>>
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
                                afterSexOption().pushDickVag.next.ram.next,
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
                            },
                            out: {
                              optionText: "🔙 Pull out",
                              contents: `You pull out your dick on $npc.name`,
                              next: afterSexOption,
                            },
                          },
                        },
                        back: {
                          optionText: "🔙 Pull back",
                          contents: `You pull back. $npc.name is still bent over the kitchen.`,
                          next: afterSexOption,
                        },
                      },
                    },
                    pushDickAnus: {
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
                              else if (npc.anusTraining < 60)
                                stats.push("fear+10");
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
                          next: () => afterSexOption().pushDickAnus.next,
                          altOptions: (npc, current) => {
                            if (Temporary().cockEntered) {
                              Variables().npcInteractionRoute =
                                "slaveEventCook.lookLow.spread.sex.pushDickAnus.ram";
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
                              ? [
                                  "fear+50",
                                  "freedomWish+25",
                                  "anusTraining%+60",
                                ]
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
                                  $npc.GenPronoun <<thirdPerson "seems" "seem">> to be able to take you in and, after a while, it even starts to feel good for $npc.pronoun.\
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
                                afterSexOption().pushDickAnus.next.ram.next,
                            },
                            fast: {
                              optionText: "⏩ Fast piston.",
                              contents: `You thrust your dick into $npc.name's anus. Making $npc.pronoun bounce with a fast pelvic piston movement.
                              <<run Player.manageEnergy(3)>>\
                              <<if $npc.anusTraining lt 40>>\
                                $npc.GenPronoun <<if $npc.age gt 0>><<thirdPerson "pushes" "push">> you while crying<<else>>cries<</if>> desperately. <<emoji 😭>>
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
                                  return [
                                    "fear+5",
                                    "anusTraining%+80",
                                    "hunger+5",
                                  ];
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
                                afterSexOption().pushDickAnus.next.ram.next,
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
                            },
                            out: {
                              optionText: "🔙 Pull out",
                              contents: `You pull out your dick on $npc.name`,
                              next: afterSexOption,
                            },
                          },
                        },
                        back: {
                          optionText: "🔙 Pull back",
                          contents: `You pull back. $npc.name is still bent over the kitchen.`,
                          next: afterSexOption,
                        },
                      },
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
                      next: afterSpread().sex.next,
                    },
                    applyLubePussy: {
                      inventoryRequirements: ["lube"],
                      npcRequirements: ["hasPussy", "!lubricatedPussy"],
                      optionText: "💧 Apply lube to $npc.name's pussy.",
                      minutesCost: 2,
                      contents: `You squeeze some lube from the tube and thoroughly apply it to $npc.name's pussy making it nice and slippery.
                          It seems that your rubbing has caused a faint reaction in $npc.pronoun`,
                      npcStats: ["+lubricatedPussy", "lust+1%"],
                      next: afterSpread().sex.next,
                    },
                    back: goToStartSlaveEventCookOption,
                  };
                },
              },
              back: goToStartSlaveEventCookOption,
            },
          },
          back: goToStartSlaveEventCookOption,
        },
    },
    gropeAss: {
      optionText: "🖐 Grope $npc.possessive ass!!",
      minutesCost: 1,
      contents: `You grab and squish $npc.possessive ass cheek. The squishiness feels amazing on your hand.
      <<personUniqueness assGrabbed>>`,
      npcStats: ["lust+5%"],
      next: () => baseInteractionOptions(),
    },
    giveApron: {
      inventoryRequirements: ["cooking apron"],
      optionText: "🎁 Give $npc.pronoun the cooking apron.",
      npcStats: ["love+30%", "freedomWish-50%"],
      contents: `You give $npc.name the cute apron you bought. $npc.GenPronoun <<thirdPerson "looks" "look">> very happy.
      <<personUniqueness receivedCookingApron>>
      <<if $scenery=='kitchen'>>\
        $npc.GenPronoun <<thirdPerson "puts" "put">> it on right away<<if !$npc.haveClothes>> barely covering $npc.possessive nude $npc.skin skin<</if>> and <<thirdPerson "continues" "continue">> with $npc.possessive cooking.
      <<else>>\
        $npc.GenPronoun then <<thirdPerson "runs" "run">> off into the wc to try $npc.possessive new outfit in front of the mirror.<<set $npc.location='wc'>>
      <</if>><<run Player.getInventory().moveByName('cooking apron', Person.getInventory())>>`,
    },
  },
};
