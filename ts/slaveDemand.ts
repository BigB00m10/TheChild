if (window.Interactions == undefined) window.Interactions = {};
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
  >>\
  <<showmeter hunger>>\
  How do you want to handle it?`,
  options: {
    smallMeal: {
      optionText: "🥪 Give $npc.pronoun a small meal. (-10 hunger)",
      minutesCost: 10,
      contents: `You go to the kitchen to prepare something quick, come back and you give it to $npc.pronoun.
      $npc.name: "\
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
      $npc.name: "<<if $npc.love lt 80>>\
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
      contents: `You show $npc.pronoun your dick while grabbing it with your hand and say:
      "Here, you can eat my special jelly. My body produces it, but you need to stimulate this to be able to get it out."
      $npc.name: "\
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
          $npc.name is so hungry that, as soon as $npc.pronoun feels your cum shooting on her tongue, eagerly eats your cum with passion till the last drop.

          $npc.name: "Haa... much better <<emoji 😫>>."
        <<elseif _willing>>\
          As you shoot you can hear and feel $npc.name gulping down your semen while $npc.possessive lips keep pursed around your cock.

          Right after your dick stops shooting, $npc.genPronoun sucks out the remaining sperm in your urethra. Closing up $npc.possessive lips as $npc.genPronoun slowly takes out your penis from $npc.possessive mouth.

          $npc.name: "Thanks $player.name. That was yummy<<emoji 😋>>."
        <<else>>\
          You can see $npc.name making a weird face as you shoot your seed inside $npc.possessive mouth<<emoji 😫>>.
          $npc.GenPronoun steps back after taking int some cumshots. You can hear $npc.pronoun making a gulp with $npc.possessive hands covering her mouth.

          Finally, $npc.genPronoun chews in the remaining cum on $npc.possessive tongue.
          $npc.name: "<<if $npc.age lt 5>>It's yucky!! <<emoji 😟>><<else>>Ugh! It doesn't taste very good...<<emoji 😖>><</if>>".
        <</if>>
      <</if>>`,
    },
    //pussy: {
    //  playerRequirements: ["gender=female"],
    //  optionText: "💦 Offer $npc.pronoun your love juice. (-5 hunger)",
    //},
  },
};
