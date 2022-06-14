const punishment: NpcInteraction = {
  optionText: "🖐 Punish $npc.pronoun.",
  contents: "How should $npc.name be punished?",
  next: {
    clothes: {
      npcRequirements: ["haveClothes"],
      optionText: "🩲 Steal $npc.possessive clothes.",
      contents: `You take all off $npc.possessive clothes leaving $npc.name completely naked and say:
      "I'll be keeping this as punishment. From now on you'll go without clothes all day. And your $npc.genitals will bring good views for the house<<emoji 🤤>>."

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
      showNpcStats: true,
    },
    scold: {
      optionText: "🗯 Scold $npc.pronoun.",
      contents: "You scold $npc.name for demanding too much.",
      minutesCost: 2,
      npcStats: ["obedience+5"],
      showNpcStats: true,
    },
    spank: {
      optionText: "🖐 Give $npc.pronoun a spanking.",
      minutesCost: 10,
      contents: `You grab $npc.name and force $npc.pronoun to bend over your lap.
      <<if $npc.haveClothes>>\
        You reveal $npc.possessive $npc.skin buttocks and start spanking $npc.pronoun.
      <<else>>\
        Since $npc.genPronoun's naked, you can feel $npc.possessive body warmth on your legs and start spanking $npc.possessive $npc.skin bare ass.
      <</if>>\

      ''$npc.name'': "\
      <<if $npc.lust gte 70 && $npc.age gte 5>>\
        Ow!!...Yes!!...Punish me!!...I'm a bad $npc.title!!<<emoji 😩>>\
      <<elseif $npc.lust gte 50>>\
        Ow!..Ah!!...\
      <<elseif $npc.love gte 50>>\
        <<if $npc.age lt 5>>Waaaah!!!<<else>>I'm so sowwyyy!!<</if>><<emoji 😭>>\
      <<else>>\
        <<if $npc.age lt 5>>Nooo!!! Stoop iiit!!!<<else>>Ouch!! It hurts!! Please stop!!<</if>><<emoji 😫>>\
      <</if>>"
      You let go of $npc.pronoun with visible tears running on $npc.possessive face.`,
      npcStats: (npc) => {
        let stats = ["obedience+10"];
        if (npc.lust >= 50) stats.push("lust+5%");
        else if (npc.love < 50) stats.push("freedomWish+5");
        return stats;
      },
      showNpcStats: true,
    },
  },
  stopOption: "🚫 Don\\'t do anything",
};
window.Interactions["slaveDemandHunger"] = {
  contents: `$npc.name is asking for food.
  <<run
    let name = 'hunger'
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
        full: '#FF4136',
        empty: '#2ECC40'
    }, $npc[name] / 100);
  >>\
  <<showmeter hunger>>\
  <<showmeter obedience>>\
  How do you want to handle it?`,
  options: {
    smallMeal: {
      optionText: "🥪 Give $npc.pronoun a small meal. (-10 hunger)",
      minutesCost: 10,
      contents: `You go to the kitchen to prepare something quick, come back and you give it to $npc.pronoun.
      ''$npc.name'': "\
      <<if $npc.love lt 80>>\
        Thank you\
      <<else>>\
        Thank you $player.name <<emoji ❤>>\
      <</if>>."`,
      npcStats: ["hunger-10", "love+1", "freedomWish-1"],
      showNpcStats: true,
    },
    fullMeal: {
      optionText: "🍝 Make $npc.pronoun a full meal. (-80 hunger)",
      minutesCost: 40,
      contents: `You cook a full meal in the kitchen. When you come back $npc.name $npc.eyeColor eyes widen as it sees and smells the good meal you prepared for $npc.pronoun. <<emoji 😮>>
      You put it down and $npc.genPronoun starts happily eating it <<emoji 😊>>
      ''$npc.name'': "<<if $npc.love lt 80>>\
        Thank you!! It's really good!!\
      <<else>>\
        Thanks $player.name!! I love you <<emoji ♥>>\
      <</if>>"`,
      npcStats: ["hunger-80", "love+10", "freedomWish-20"],
      showNpcStats: true,
    },
    cum: {
      playerRequirements: ["gender=male"],
      optionText:
        "💦 Offer $npc.pronoun your ==sperm== white jelly. (-5 hunger)",
      minutesCost: 30,
      contents: `You show $npc.pronoun your dick while grabbing it with your hand and say:
      "Here, you can eat my special jelly. My body produces it, but you need to stimulate this to be able to get it out."

      ''$npc.name'': "\
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
      <</if>>".<<if !_denied>>
      
        <<if _willing>>$npc.name stretches out $npc.possessive hands to grab $npc.possessive "meal dispenser".
        <</if>>\
        With a hand in $npc.possessive $npc.hairColor $npc.hairStyle head you guide $npc.pronoun in giving you pleasure by licking and sucking your dick's.
        The sounds of $npc.possessive wet tongue rubbing your penis inside $npc.possessive $npc.age year old mouth echoes on the basement's walls.

        $player.name: "That's it. Good $npc.title. Just a little more and you'll have your meal."
        The feeling of $npc.possessive<<if $npc.age lt 10>> little<</if>> lips and tongue quickly brings you to the edge and start shooting your seed inside.
        <<if $npc.hunger gte 80>>\
          $npc.name is so hungry that, as soon as $npc.genPronoun feels your cum shooting on her tongue, eagerly eats your cum with passion till the last drop.

          ''$npc.name'': "Haa... much better <<emoji 😫>>."
        <<elseif _willing>>\
          As you shoot you can hear and feel $npc.name gulping down your semen while $npc.possessive lips keep pursed around your cock.

          Right after your dick stops shooting, $npc.genPronoun sucks out the remaining sperm in your urethra. Closing up $npc.possessive lips as $npc.genPronoun slowly takes out your penis from $npc.possessive mouth.

          ''$npc.name'': "Thanks $player.name. That was yummy<<emoji 😋>>."
        <<else>>\
          You can see $npc.name making a weird face as you shoot your seed inside $npc.possessive mouth<<emoji 😫>>.
          $npc.GenPronoun steps back after taking in some cumshots. You can hear $npc.pronoun making a gulp with $npc.possessive hands covering her mouth.

          Finally, $npc.genPronoun chews in the remaining cum on $npc.possessive tongue.
          ''$npc.name'': "<<if $npc.age lt 5>>It's yucky!! <<emoji 😟>><<else>>Ugh! It doesn't taste very good...<<emoji 😖>><</if>>".
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
      showNpcStats: true,
    },
    pussy: {
      playerRequirements: ["gender=female"],
      optionText: "💦 Offer $npc.pronoun your love juice. (-5 hunger)",
      minutesCost: 30,
      contents: `You show $npc.pronoun your pussy and say:
      "Come here, you can drink my love juice. My body produces it, but you need to stimulate me down here to be able to get it out."
      ''$npc.name'': "\
      <<if $npc.lust gte 80>>\
        <<set _willing = true>>\
        <<if $npc.age lt 4>>\
          $player.name's love juice!! Yay!!<<emoji 😛>>\
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
      <</if>>".<<if !_denied>>
      
        <<if _willing>>$npc.name doesn't hesitate and puts $npc.possessive face between your legs while grabbing your legs.
        <</if>>\
        With a hand in $npc.possessive $npc.hairColor $npc.hairStyle head you guide $npc.pronoun in giving you pleasure by licking and sucking your pussy and clit.
        The sounds of $npc.possessive wet tongue gently slapping your privates echoes on the basement's walls.

        $player.name: "That's it. Good $npc.title. Just a little more and you'll have your meal."
        The feeling of $npc.possessive<<if $npc.age lt 10>> little<</if>> lips and tongue caressing you down there finally brings you to the edge and start squirting.
        <<if $npc.hunger gte 80>>\
          $npc.name is so hungry that, as soon as $npc.genPronoun feels your love juice on her tongue, eagerly drinks and sucks your nectar with passion till the last drop.

          ''$npc.name'': "Haa... much better <<emoji 😫>>."
        <<elseif _willing>>\
          As you squirt, you can hear and feel $npc.name gulping down your nectar while $npc.possessive lips keep pressing on your pussy's.

          Afterwards, $npc.genPronoun sucks out the remaining juice while doing a loud kiss down there. 

          ''$npc.name'': "Thanks $player.name. That was yummy<<emoji 😋>>."
        <<else>>\
          You can see $npc.name making a weird face as you squirt in $npc.possessive mouth<<emoji 😫>>.
          $npc.GenPronoun steps back after taking a good portion of your nectar. You can hear $npc.pronoun making a gulp with $npc.possessive hand covering her mouth.

          <<if $npc.age gte 5>>\
            ''$npc.name'': "It tastes weird<<emoji 😑>>".\
          <</if>>\
        <</if>>\
      <</if>>`,
      altMinutes: (minutes) => (Temporary().denied ? 0 : minutes),
      npcStats: () =>
        (
          window.Interactions.slaveDemandHunger.options.cum
            .npcStats as CallableFunction
        )(),
      showNpcStats: true,
    },
    punish: punishment,
  },
};
