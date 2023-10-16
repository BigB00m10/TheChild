//This interface uses the window DOM object to share objects between back end and front end.
//Every object hooked to the window object will also be directly available in the browser console.
//You'll typically want to use only the functions on the class instances that are hooked to the window.
//Class instance properties are reset every time the game is loaded, so in practice you only can use them if they are constant or temporary.
interface Window {
  Now: Now;
  Homes: Record<string, Home>;
  Jobs: Record<string, Job>;
  Player: Player;
  Person: Person;
  PersonGeneration: PersonGeneration;
  Basement: Basement;
  TortRafters: TortRafters;
  MainRoom: MainRoom;
  BedRoom: BedRoom;
  BathRoom: Bathroom;
  Wc: Wc;
  Kitchen: Kitchen;
  Garden: Garden;
  OnlineStore: OnlineStore;
  Interactions: Record<string, NpcInteractionCollection>;
  PersonUniquenessPresets: PersonUniqueness[];
  PornMovie: PornMovie;
}
window.Now = new Now();
window.Homes = Homes;
window.Jobs = Jobs;
window.Player = new Player();
window.Person = new Person();
window.OnlineStore = new OnlineStore();
window.Basement = new Basement();
window.TortRafters = new TortRafters();
window.MainRoom = new MainRoom();
window.BedRoom = new BedRoom();
window.BathRoom = new Bathroom();
window.Wc = new Wc();
window.Kitchen = new Kitchen();
window.Garden = new Garden();
window.PersonGeneration = new PersonGeneration();
window.PersonUniquenessPresets = personUniquenessPresets;
window.PornMovie = new PornMovie();
//Interactions will be populated in the next files.
//Typescript files are processed in alphabetical order, that's why letters are prepended to the file names.
window.Interactions = {};
let keyBuffer = [];
let lastKeyTime = Date.now();
document.addEventListener("keypress", (evt) => {
  const currentTime = Date.now();
  if (currentTime - lastKeyTime > 2000) keyBuffer = [];
  keyBuffer.push(evt.key.toLowerCase());
  lastKeyTime = currentTime;
  let typed = keyBuffer.join("");
  if (typed.endsWith("butmyitems")) {
    if (!SugarCube.State || SugarCube.State.passage != "onlineStore") return;
    const store = Variables().onlineStore as OnlineStore;
    store.products[3].soldOut = false;
    store.products[4].soldOut = false;
    SugarCube.Engine.show();
  } else if (typed.endsWith("robinhood")) {
    Variables().player.cash += 800;
    Dialog.setup("Such lucky");
    Dialog.wiki("You found ¤800!!! Where does this come from?!");
    Dialog.open();
    Engine.show();
  } else if (typed.endsWith("coconuts")) {
    Variables().player.energy = 100;
    Engine.show();
  } else if (typed.endsWith("goblind")) {
    Variables().settings.hideScenery = true;
    Engine.show();
  } else if (typed.endsWith("letsee")) {
    Variables().settings.hideScenery = false;
    Engine.show();
  } else if (typed.endsWith("cheat")) {
    Variables().cheat ^= 1;
    Engine.show();
  } else if (typed.endsWith("teststartkit")) {
    const basementContents = window.Basement.getContents();
    const mattressCount = basementContents.get("mattress").count;
    if (mattressCount < 10)
      window.OnlineStore.get("mattress").transferTo(
        basementContents,
        10 - mattressCount
      );
    const inventory = window.Player.getInventory();
    if (!inventory.has("chloroform", 10))
      window.OnlineStore.get("chloroform").transferTo(inventory);
    ["lactation pills", "rope", "aging stop pill"].forEach((productName) => {
      if (!inventory.has(productName))
        window.OnlineStore.get(productName).transferTo(inventory);
    });
    [
      "lube",
      "dildo",
      "magic sunglasses",
      "cooking apron",
      "the art of shibari",
    ].forEach((productName) => {
      const product = window.OnlineStore.get(productName);
      if (product.soldOut) return;
      product.transferTo(inventory);
      product.soldOut = true;
    });
    [
      "male fertility pill",
      "female fertility pill",
      "pregnancy test",
      "condom",
    ].forEach((productName) => {
      const itemCount = inventory.get(productName)?.count || 0;
      if (itemCount < 15)
        window.OnlineStore.get(productName).transferTo(
          inventory,
          15 - itemCount
        );
    });
    Engine.show();
  }
});
$(document).on(":passageinit", () => {
  if (Save.onLoad.size == 0) {
    Save.onLoad.add((save) => {
      let stateIndex = save.state.history.length - 1;
      let variables = save.state.history[stateIndex].variables;
      if (
        !variables.player.genitals.all ||
        variables.player.impregnationChance == undefined
      ) {
        if (!variables.player.genitals.all)
          variables.player.gender =
            variables.player.gender != "male" ? "girl" : "boy";
        //Change to new gender/sex format from a 0.1.8.2 save or older
        //This will now also run when updating from 0.1.14.1 or older to add pregnancy stats
        window.Player.setSex(
          variables.player.sex
            ? variables.player.sex
            : variables.player.gender == "boy"
            ? "male"
            : "female",
          variables.player
        );
      }
      let slaves = variables.slaves as Person[];
      if (slaves && slaves.length) {
        let reassignUid = false;
        if (slaves[0].version == 1) {
          variables.lastUid = 0;
          reassignUid = true;
        }
        let addSlaveUniqueness = !slaves[0].uniqueness;
        let randomIndex = 0;
        slaves.forEach((slave: Person) => {
          if (!slave.hunger) slave.hunger = 0;
          if (!slave.GenPronoun) {
            slave.GenPronoun = slave.gender != "boy" ? "She" : "He";
            slave.genPronoun = slave.gender != "boy" ? "she" : "he";
            slave.Possessive = slave.gender != "boy" ? "Her" : "His";
          }
          if (slave.anusTraining == undefined) {
            slave.anusTraining = 0;
            slave.pussyTraining = 0;
            slave.mouthTraining = 0;
          }
          if (slave.hasPenis == undefined) {
            slave.hasPenis = slave.sex == "male";
            slave.hasPussy = slave.sex == "female";
          }
          window.Person.adjustPubescence(false, slave);
          if (slave.analVirgin == undefined) {
            slave.analVirgin = true;
            slave.vaginaVirgin = true;
            slave.penisVirgin = true;
            slave.mouthVirgin = true;
          }
          if (slave.status == undefined) slave.status = "slave";
          if (slave.punishments == undefined) slave.punishments = [];
          if (slave.location == undefined) slave.location = "basement";
          if (slave.achievements == undefined) slave.achievements = [];
          if (slave.uid == undefined || reassignUid) {
            slave.uid = getUid(variables);
            delete slave.index;
          }
          if (slave.status == "slave" && slave.location != "basement")
            slave.status = "home slave";
          if (!slave.version) {
            if (!slave.analVirgin)
              window.Person.setAchievement("playerTookAnalVirginity", slave);
            if (!slave.vaginaVirgin)
              window.Person.setAchievement("playerTookVaginaVirginity", slave);
            if (!slave.penisVirgin)
              window.Person.setAchievement("playerTookPenisVirginity", slave);
            if (!slave.mouthVirgin)
              window.Person.setAchievement("playerTookMouthVirginity", slave);
            if (slave.mouthTraining)
              window.Person.setAchievement("hadMouthSexWithPlayer", slave);
            slave.assSpermAmount = 0;
            slave.pussySpermAmount = 0;
            slave.faceSpermAmount = 0;
            slave.bodySpermAmount = 0;
          }
          slave.version = window.Person.version;
          if (!slave.uniqueness) PersonUniqueness.applyRandom(slave, false);
          if (!slave.genitals.all) {
            //Change to new gender/sex format from a 0.1.8.2 save or older
            slave.sex = slave.gender as Sex;
            slave.gender = slave.sex == "male" ? "boy" : "girl";
            slave.genitals = {
              male: slave.sex == "male" ? "dick" : null,
              female:
                slave.sex == "female"
                  ? slave.age < 15
                    ? "cunny"
                    : "pussy"
                  : null,
              all:
                slave.sex == "male"
                  ? "dick"
                  : slave.age < 15
                  ? "cunny"
                  : "pussy",
            };
          }
          if (slave.ageProgress == undefined) {
            slave.ageProgress = PseudoRandom.getFromRange(
              PseudoRandom.getSeed(variables.now.date, randomIndex++),
              0,
              7
            );
            slave.ageIntroduced = slave.age;
          }
          if (slave.hairStyle == "wavey") slave.hairStyle = "wavy";
        });
        if (addSlaveUniqueness) {
          Dialog.setup("Slave personalities");
          Dialog.wiki(
            "Old save file loaded.\nRandom personalities have been assigned to the already captured slaves."
          );
          Dialog.open();
        }
      }
      let settings: any = variables.settings;
      if (settings.anal == undefined) settings.anal = true;
      if (settings.slaveSelling == undefined) settings.slaveSelling = true;
      if (settings.lustDecCum == undefined) settings.lustDecCum = 20;
      if (variables.achievements == undefined) variables.achievements = [];
      let onlineStore = variables.onlineStore as OnlineStore;
      if (onlineStore.products.length < window.OnlineStore.products.length)
        for (
          //A new product was added to the backend class
          let productIndex = 0;
          productIndex < window.OnlineStore.products.length;
          productIndex++
        ) {
          //Find where the name doesn't match and insert the new products in the right position
          let product = window.OnlineStore.products[productIndex];
          let saveProduct = onlineStore.products[productIndex];
          if (!saveProduct) onlineStore.products.push(product);
          else if (saveProduct.name != product.name)
            onlineStore.products.splice(productIndex, 0, product);
        }
      if (!onlineStore.version || onlineStore.version < 4) {
        let mattressIndex = onlineStore.products.findIndex(
          (p) => p.name == "Matress" //Old typo
        );
        if (mattressIndex == -1)
          mattressIndex = onlineStore.products.findIndex(
            (p) => p.name == "Mattress"
          );
        onlineStore.products[mattressIndex] =
          window.OnlineStore.get("Mattress");
        const lubeIndex = onlineStore.products.findIndex(
          (p) => p.name == "Lube"
        );
        const lubeOut = onlineStore.products[lubeIndex].soldOut;
        onlineStore.products[lubeIndex] = window.OnlineStore.get("Lube");
        onlineStore.products[lubeIndex].soldOut = lubeOut;
        onlineStore.products[
          onlineStore.products.findIndex((p) => p.name == "Condom")
        ] = window.OnlineStore.get("Condom");
        var mGlassesIndex = onlineStore.products.findIndex(
          (p) => p.name == "Magic sunglasses"
        );
        var mGlassesOut = onlineStore.products[mGlassesIndex].soldOut;
        onlineStore.products[mGlassesIndex] =
          window.OnlineStore.get("Magic sunglasses");
        onlineStore.products[mGlassesIndex].soldOut = mGlassesOut;
        if (onlineStore.bought.items.length && !onlineStore.purchaseTime)
          onlineStore.purchaseTime = window.Now.isEqualOrLaterThan(
            "7:01 AM",
            variables.now.date
          )
            ? variables.now.date
            : new Date(variables.now.date).setDate(
                variables.now.date.getDate() - 1
              );
        onlineStore.version = 4;
      }
      let childGen: PersonGeneration = settings.childGeneration;
      if (!childGen.hairStyles)
        childGen.hairStyles = window.PersonGeneration.hairStyles;
      if (!childGen.eyeColors)
        childGen.eyeColors = window.PersonGeneration.eyeColors;
      if (!childGen.hairColors)
        childGen.hairColors = window.PersonGeneration.hairColors;
      if (!childGen.skins) childGen.skins = window.PersonGeneration.skins;
      if (!childGen.herms) {
        //New settings added not present in a 0.1.8.2 save or older
        childGen.hermPercentage = 0;
        childGen.herms = {
          fromAge: 1,
          toAge: 15,
        };
      }
      if (variables.player.house) {
        variables.player.home = variables.player.house;
        delete variables.player.house;
      }
      if (variables.player.home.spaces == undefined)
        variables.player.home.spaces = window.Homes.smallUrban.spaces;
      else
        for (let houseKey in window.Homes)
          if (
            window.Homes[houseKey].name == variables.player.home.name &&
            variables.player.home.spaces.length <
              window.Homes[houseKey].spaces.length
          )
            variables.player.home.spaces = window.Homes[houseKey].spaces;
      if (!variables.player.gameVersion) {
        if (!variables.settings.childGeneration.hairStyles.includes("ponytail"))
          variables.settings.childGeneration.hairStyles.pushUnique(
            "pig tails",
            "twin tails",
            "ponytail"
          );
        const waveyIndex =
          variables.settings.childGeneration.hairStyles.indexOf("wavey");
        if (waveyIndex != -1)
          variables.settings.childGeneration.hairStyles[waveyIndex] = "wavy";
      }
    });
  }
});
$(document.head).append(
  "<link rel='icon' href='data:image/jpeg;base64,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'>"
);
$(
  '<span style="color:#999;font-size:small;position:absolute;display:block;width:100%;text-align:center;top:6.4em">' +
    window.Player.gameVersion +
    "</span>"
).appendTo(document.getElementById("ui-bar"));
