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
  Temporary: () => any;
  Variables: () => any;
  Assets: any;
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
window.Temporary = Temporary;
window.Variables = Variables;
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
      if (!variables.kitchen) variables.kitchen = new Kitchen();
      variables.player.inventory.items.forEach((item: Item) => {
        if (Array.isArray(item.tags)) item.tags = new Set(item.tags);
      });
    });
  }
});
$(document.head).append(`<link rel='icon' href='${window.Assets.icon.fav}'>`);
$(
  '<span style="color:#999;font-size:small;position:absolute;display:block;width:100%;text-align:center;top:6.4em">' +
    window.Player.gameVersion +
    "</span>"
).appendTo(document.getElementById("ui-bar"));
