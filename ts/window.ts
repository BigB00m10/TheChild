interface Window {
  Now: Now;
  Homes: Record<string, Home>;
  Jobs: Record<string, Job>;
  Player: Player;
  Person: Person;
  PersonGeneration: PersonGeneration;
  Basement: Basement;
  OnlineStore: OnlineStore;
  Interactions: Record<string, NpcInteractionCollection>;
}
window.Now = new Now();
window.Homes = Homes;
window.Jobs = Jobs;
window.Player = new Player();
window.Person = new Person();
window.OnlineStore = new OnlineStore();
window.Basement = new Basement();
window.PersonGeneration = new PersonGeneration();
let keyBuffer = [];
let lastKeyTime = Date.now();
document.addEventListener("keypress", (evt) => {
  if (!SugarCube.State || SugarCube.State.passage != "onlineStore") return;
  const currentTime = Date.now();
  if (currentTime - lastKeyTime > 2000) keyBuffer = [];
  keyBuffer.push(evt.key.toLowerCase());
  lastKeyTime = currentTime;
  if (keyBuffer.join("").endsWith("butmyitems")) {
    const store = (Variables().onlineStore as OnlineStore);
    store.products[3].soldOut = false;
    store.products[4].soldOut = false;
    SugarCube.Engine.show();
  }
});
$(document).on(":passageinit", () => {
  if (Save.onLoad.size == 0) {
    Save.onLoad.add((save) => {
      let stateIndex = save.state.history.length - 1;
      let variables = save.state.history[stateIndex].variables;
      let slaves = variables.slaves as Person[];
      if (slaves && slaves.length) {
        if (!slaves[0].GenPronoun)
          slaves.forEach((slave: Person) => {
            slave.GenPronoun = slave.gender != "male" ? "She" : "He";
            slave.genPronoun = slave.gender != "male" ? "she" : "he";
            slave.Possessive = slave.gender != "male" ? "Her" : "His";
          });
        if (slaves[0].anusTraining == undefined)
          slaves.forEach((slave: Person) => {
            slave.anusTraining = 0;
            slave.pussyTraining = 0;
            slave.mouthTraining = 0;
          });
        if (slaves[0].hasPenis == undefined)
          slaves.forEach((slave: Person) => {
            slave.hasPenis = slave.gender == "male";
            slave.hasPussy = slave.gender == "female";
          });
        if (slaves[0].analVirgin == undefined)
          slaves.forEach((slave: Person) => {
            slave.analVirgin = true;
            slave.genitalVirgin = true;
            slave.mouthVirgin = true;
          });
        if (slaves[0].status == undefined)
          slaves.forEach((slave: Person) => {
            slave.status = "slave";
          });
      }
      if (variables.settings.anal == undefined) variables.settings.anal = true;
      if (variables.achievements == undefined) variables.achievements = [];
    });
  }
});
