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
    },
    fullMeal: {
      optionText: "🍝 Make $npc.pronoun a full meal. (-80 hunger)",
      minutesCost: 40,
    },
    cum: {
      playerRequirements: ["gender=male"],
      optionText: "💦 Offer $npc.pronoun your ==sperm== white jelly. (-5 hunger)",
    },
    pussy: {
      playerRequirements: ["gender=female"],
      optionText: "💦 Offer $npc.pronoun your love juice. (-5 hunger)",
    },
  },
};
