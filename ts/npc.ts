type NpcStatus =
  | "citizen"
  | "slave"
  | "home slave"
  | "accomplice"
  | "pet"
  | "servant"
  | "lover";
interface NpcValue {
  obedience: number;
  obedienceRatio: string;
  lust: number;
  lustRatio: string;
  pussy: number;
  pussyRatio: string;
  anus: number;
  anusRatio: string;
  mouth: number;
  mouthRatio: string;
  freedomWish?: number;
  virginType?: string;
  virginBonus?: number;
  total?: number;
}
abstract class Npc {
  uid: Uid;
  name: string;
  age: number;
  sex: Sex
  gender: Gender;
  hasPussy: boolean;
  hasPenis: boolean;
  lubricatedAss: boolean;
  lubricatedPussy: boolean;
  pussyTraining: number = 0;
  anusTraining: number = 0;
  mouthTraining: number = 0;
  penisVirgin: boolean = true;
  vaginaVirgin: boolean = true;
  analVirgin: boolean = true;
  mouthVirgin: boolean = true; //Due to a personal error only slaves with previous personal experience have this at false.
  assSpermAmount: number = 0;
  pussySpermAmount: number = 0;
  bodySpermAmount: number = 0;
  faceSpermAmount: number = 0;
  children: Uid[] = [];
  mom: Uid = null;
  dad: Uid = null;
  aroused: boolean = false;
  hunger: number = 0;
  fear: number = 50;
  love: number = 0;
  obedience: number = 25;
  lust: number = 0;
  freedomWish: number = 75;
  genitals: AllGenitals;
  status: NpcStatus = "citizen";
  need: string;
  index: undefined;
  achievements: string[] = [];
  punishments: string[] = [];
  location: string = "unknown";
  hasAchievement(achievement: string, npc?: Npc): boolean {
    if (!npc) npc = Variables().npc;
    return npc.achievements.includes(achievement);
  }
  hasAnyAchievement(achievements: string[], npc?: Npc) {
    if (!npc) npc = Variables().npc;
    return npc.achievements.includesAny(achievements);
  }
  hasAllAchievements(achievements: string[], npc?: Npc) {
    if (!npc) npc = Variables().npc;
    return npc.achievements.includesAll(achievements);
  }
  setAchievement(achievement: string, npc?: Npc): void {
    if (!npc) npc = Variables().npc;
    if (!this.hasAchievement(achievement, npc))
      npc.achievements.push(achievement);
  }
  removeAchievement(achievement: string, npc?: Npc): void {
    if (!npc) npc = Variables().npc;
    npc.achievements.delete(achievement);
  }
  getValue(): NpcValue {
    let npc = Variables().npc as Npc;
    const maxNonVirgin = 1500;
    const maxFwPenalty = -0.75; //Maximum freedom wish penalty 75%
    let calcValue = (stat: number, ratio: number) =>
      (maxNonVirgin * (stat * ratio)) / 100;
    let value: NpcValue = npc.hasPussy
      ? {
          obedience: calcValue(npc.obedience, (0.27 * npc.obedience) / 100),
          obedienceRatio: "(27%)",
          lust: calcValue(npc.lust, 0.25),
          lustRatio: "(25%)",
          pussy: calcValue(npc.pussyTraining, 0.19),
          pussyRatio: "(19%)",
          anus: calcValue(npc.anusTraining, 0.16),
          anusRatio: "(16%)",
          mouth: calcValue(npc.mouthTraining, 0.13),
          mouthRatio: "(13%)",
        }
      : {
          obedience: calcValue(npc.obedience, (0.3 * npc.obedience) / 100),
          obedienceRatio: "(30%)",
          lust: calcValue(npc.lust, 0.27),
          lustRatio: "(27%)",
          pussy: 0,
          pussyRatio: "(0%)",
          anus: calcValue(npc.anusTraining, 0.23),
          anusRatio: "(23%)",
          mouth: calcValue(npc.mouthTraining, 0.2),
          mouthRatio: "(20%)",
        };
    value.total =
      value.obedience + value.lust + value.pussy + value.anus + value.mouth;
    value.freedomWish = (value.total * maxFwPenalty * npc.freedomWish) / 100;
    if (npc.hasPussy) {
      if (npc.vaginaVirgin) value.virginType = "virgin " + npc.genitals.female;
    } else if (npc.analVirgin) value.virginType = "anal virginity";
    value.virginBonus = value.virginType ? Math.max(5, value.total * 0.2) : 0;
    value.total += value.freedomWish + value.virginBonus;
    return value;
  }
  setStatus(status: NpcStatus, npc?: Npc): void {
    if (!npc) npc = Variables().npc;
    switch (status) {
      case "slave":
        npc.location = "basement";
        break;
      case "home slave":
        npc.location = "mainRoom";
        break;
    }
    npc.status = status;
  }
  capture(npc: Npc): void {
    this.setStatus("slave", npc);
    Variables().slaves.push(npc);
  }
  static updateLocations(currentDate: Date): void {
    let variables = Variables();
    if (!currentDate) currentDate = variables.now.date;
    //const sleepTime = window.Now.isBetween("10:00 PM", "7:00 AM", currentDate);
    let homeSpaces = variables.player.home.spaces.filter(
      (space: string) => space != "basement" && !space.startsWith('tort')
    );
    const baseSeed = currentDate.getTime() - 1649048400000;
    variables.slaves.forEach((slave: Person) => {
      switch (slave.status) {
        case "home slave":
        case "lover":
          slave.location = PseudoRandom.either(
            PseudoRandom.getSeed(baseSeed, slave.age, slave.name),
            homeSpaces
          );
          break;
      }
    });
  }
  get(uid: Uid): Npc {
    return Variables().slaves.firstOrDefault(
      (slave: Person) => slave.uid == uid
    );
  }
}
type AnimalSpecies = "dog" | "cat" | "rabbit" | "horse" | "pig" | "cow";
type RoughSize = "tiny" | "small" | "normal" | "big" | "very big";
class Animal extends Npc {
  species: AnimalSpecies;
  roughSize?: RoughSize;
}
const genderList: Gender[] = ["boy", "girl"];
class Person extends Npc {
  version: number = 2;
  title: string;
  pronoun: string;
  genPronoun: string;
  GenPronoun: string;
  possessive: string;
  Possessive: string;
  hairColor: string;
  hairLength: string;
  hairStyle: string;
  eyeColor: string;
  skin: string;
  haveClothes: boolean = true;
  uniqueness: PersonUniqueness;
  generate(gen?: PersonGeneration): Person {
    if (gen === undefined) gen = new PersonGeneration();
    let person = new Person();
    person.sex =
      Math.random() * 100 + 1 < gen.femalePercentage ? "female" : "male";
    person.sex = Math.random() *100 + 1 < gen.hermPercentage ? "herm" : person.sex
    person.gender = person.sex == "male" ? "boy" : person.sex == "female" ? "girl" : genderList.random();
    person.title = person.sex == "male" ? "boy" : person.sex == "female" ? "girl" : "child";
    person.pronoun = person.gender == "boy" ? "him" : person.gender == "girl" ? "her" : "them";
    person.GenPronoun = person.gender == "boy" ? "He" : person.gender == "girl" ? "She" : "They";
    person.genPronoun = person.gender == "boy" ? "he" : person.gender == "girl" ? "she" : "they";
    person.possessive = person.gender == "boy" ? "his" : person.gender == "girl" ? "her" : "their";
    person.Possessive = person.gender == "boy" ? "His" : person.gender == "girl" ? "Her" : "Their";
    person.hasPussy = person.sex == "female" || person.sex =="herm";
    person.hasPenis = person.sex == "male" || person.sex =="herm";
    let genGen: GenderGeneration =
      person.sex == "male" ? gen.males : person.sex == "female" ? gen.females : gen.herms;
    person.age =
      Math.floor(Math.random() * (genGen.toAge - genGen.fromAge)) +
      genGen.fromAge;
    if (person.age < 6)
      person.freedomWish -= ((6 - person.age) / 6) * person.freedomWish;
    person.genitals = {
      "male": person.sex == "male" || person.sex == "herm" ? "dick": null,
      "female": person.sex == "female" || person.sex == "herm" ? (person.age < 15 ? "cunny" : "pussy"): null,
      "all": "dick"
    }
    person.name = (person.gender != "boy" ? femaleNames : maleNames).random();
    person.skin = gen.skins.random();
    person.hairColor = gen.hairColors.random();
    person.hairLength =
      person.age == 0
        ? "short"
        : person.age == 1
        ? ["short", "medium"].random()
        : ["short", "medium", "long"].random();
    let hairStyles = gen.hairStyles;
    if (person.gender == "boy")
      hairStyles.delete("pig tails", "twin tails", "ponytail");
    person.hairStyle = hairStyles.random();
    person.eyeColor = gen.eyeColors.random();
    person.uid = getUid();
    PersonUniqueness.applyRandom(person);
    return person;
  }
  getWandering(): Person[] {
    let variables = Variables();
    return variables.slaves.filter(
      (slave: Person) => slave.location == variables.scenery
    );
  }
  getPersonalityDescription(uniqueness: PersonUniqueness): string {
    return Object.keys(uniqueness)
      .filter((keyName) => typeof uniqueness[keyName] == "boolean")
      .join(", ");
  }
  getHomePersonName(word: string, npc?: Npc) {
    if (!npc) npc = Variables().npc;
    if (word == "sibling") word = npc.sex != "male" ? "bro" : "sis";
    if (npc.age < 5) {
      switch (word) {
        case "uncle":
          return "uncle";
        case "dad":
          return "dada";
        case "mom":
          return "mama";
      }
      if (word.includes(" ")) {
        if (word.includes("girl")) return "a girl";
        if (word.includes("boy")) return "a boy";
      }
      return word;
    }
    if (npc.age > 10) {
      switch (word) {
        case "bro":
          word = "brother";
          break;
        case "sis":
          word = "sister";
          break;
      }
      if (!word.includes(" ")) word = "my " + word;
    } else {
      switch (word) {
        case "dad":
          word = "daddy";
          break;
        case "mom":
          word = "mommy";
          break;
      }
    }
    return word;
  }
  getHomePersonSex(word: string): Sex {
    switch (word) {
      case "dad":
      case "bro":
      case "uncle":
      case "pa":
        return "male";
      case "mom":
      case "sis":
      case "aunt":
      case "ma":
        return "female";
    }
    return word.includes("boy") ? "male" : "female";
  }
}
interface GenderGeneration {
  fromAge: number;
  toAge: number;
}
class PersonGeneration {
  females: GenderGeneration = {
    fromAge: 1,
    toAge: 15,
  };
  males: GenderGeneration = {
    fromAge: 1,
    toAge: 15,
  };
  herms: GenderGeneration = {
    fromAge: 1,
    toAge: 15
  }
  femalePercentage: number = 50;
  hermPercentage: number = 0;
  hairStyles = [
    "curly",
    "wavey",
    "straight",
    "emo bangs",
    "fauxhawkian",
    "front spikes",
    "wavy side part",
    "asymmetrical",
    "ponytail",
    "twin tails",
    "pig tails",
  ];
  eyeColors = ["green", "blue", "brown", "hazel"];
  hairColors = [
    "black",
    "dark brown",
    "brown",
    "light brown",
    "dirty blonde",
    "blonde",
    "red",
    "auburn",
    "midnight blue",
    "rainbow",
    "pale pink",
    "hot pink",
    "burgundy",
    "royal purple",
    "violet",
    "indigo",
    "blue",
  ];
  skins = ["tan", "brown", "black", "white", "pale", "olive"];
  load(definition: Object | string) {
    if (typeof definition == "string") definition = JSON.parse(definition);
    Object.assign(this, definition);
  }
}
const maleNames: string[] = [
  "Liam",
  "Noah",
  "William",
  "James",
  "Oliver",
  "Benjamin",
  "Elijah",
  "Lucas",
  "Mason",
  "Logan",
  "Alexander",
  "Ethan",
  "Jacob",
  "Michael",
  "Daniel",
  "Henry",
  "Jackson",
  "Sebastian",
  "Aiden",
  "Matthew",
  "Samuel",
  "David",
  "Joseph",
  "Carter",
  "Owen",
  "Wyatt",
  "John",
  "Jack",
  "Luke",
  "Jayden",
  "Dylan",
  "Grayson",
  "Levi",
  "Isaac",
  "Gabriel",
  "Julian",
  "Mateo",
  "Anthony",
  "Jaxon",
  "Lincoln",
  "Joshua",
  "Christopher",
  "Andrew",
  "Theodore",
  "Caleb",
  "Ryan",
  "Asher",
  "Nathan",
  "Thomas",
  "Leo",
  "Isaiah",
  "Charles",
  "Josiah",
  "Hudson",
  "Christian",
  "Hunter",
  "Connor",
  "Eli",
  "Ezra",
  "Aaron",
  "Landon",
  "Adrian",
  "Jonathan",
  "Nolan",
  "Jeremiah",
  "Easton",
  "Elias",
  "Colton",
  "Cameron",
  "Carson",
  "Robert",
  "Angel",
  "Maverick",
  "Nicholas",
  "Dominic",
  "Jaxson",
  "Greyson",
  "Adam",
  "Ian",
  "Austin",
  "Santiago",
  "Jordan",
  "Cooper",
  "Brayden",
  "Roman",
  "Evan",
  "Ezekiel",
  "Xavier",
  "Jose",
  "Jace",
  "Jameson",
  "Leonardo",
  "Bryson",
  "Axel",
  "Everett",
  "Parker",
  "Kayden",
  "Miles",
  "Sawyer",
  "Jason",
  "Declan",
  "Weston",
  "Micah",
  "Ayden",
  "Wesley",
  "Luca",
  "Vincent",
  "Damian",
  "Zachary",
  "Silas",
  "Gavin",
  "Chase",
  "Kai",
  "Emmett",
  "Harrison",
  "Nathaniel",
  "Kingston",
  "Cole",
  "Tyler",
  "Bennett",
  "Bentley",
  "Ryker",
  "Tristan",
  "Brandon",
  "Kevin",
  "Luis",
  "George",
  "Ashton",
  "Rowan",
  "Braxton",
  "Ryder",
  "Gael",
  "Ivan",
  "Diego",
  "Maxwell",
  "Max",
  "Carlos",
  "Kaiden",
  "Juan",
  "Maddox",
  "Justin",
  "Waylon",
  "Calvin",
  "Giovanni",
  "Jonah",
  "Abel",
  "Jayce",
  "Jesus",
  "Amir",
  "King",
  "Beau",
  "Camden",
  "Alex",
  "Jasper",
  "Malachi",
  "Brody",
  "Jude",
  "Blake",
  "Emmanuel",
  "Eric",
  "Brooks",
  "Elliot",
  "Antonio",
  "Abraham",
  "Timothy",
  "Finn",
  "Rhett",
  "Elliott",
  "Edward",
  "August",
  "Xander",
  "Alan",
  "Dean",
  "Lorenzo",
  "Bryce",
  "Karter",
  "Victor",
  "Milo",
  "Miguel",
  "Hayden",
  "Graham",
  "Grant",
  "Zion",
  "Tucker",
  "Jesse",
  "Zayden",
  "Joel",
  "Richard",
  "Patrick",
  "Emiliano",
  "Avery",
  "Nicolas",
  "Brantley",
  "Dawson",
  "Myles",
  "Matteo",
  "River",
  "Steven",
  "Thiago",
  "Zane",
];
const femaleNames: string[] = [
  "Emma",
  "Olivia",
  "Ava",
  "Isabella",
  "Sophia",
  "Charlotte",
  "Mia",
  "Amelia",
  "Harper",
  "Evelyn",
  "Abigail",
  "Emily",
  "Elizabeth",
  "Mila",
  "Ella",
  "Avery",
  "Sofia",
  "Camila",
  "Aria",
  "Scarlett",
  "Victoria",
  "Madison",
  "Luna",
  "Grace",
  "Chloe",
  "Penelope",
  "Layla",
  "Riley",
  "Zoey",
  "Nora",
  "Lily",
  "Eleanor",
  "Hannah",
  "Lillian",
  "Addison",
  "Aubrey",
  "Ellie",
  "Stella",
  "Natalie",
  "Zoe",
  "Leah",
  "Hazel",
  "Violet",
  "Aurora",
  "Savannah",
  "Audrey",
  "Brooklyn",
  "Bella",
  "Claire",
  "Skylar",
  "Lucy",
  "Paisley",
  "Everly",
  "Anna",
  "Caroline",
  "Nova",
  "Genesis",
  "Emilia",
  "Kennedy",
  "Samantha",
  "Maya",
  "Willow",
  "Kinsley",
  "Naomi",
  "Aaliyah",
  "Elena",
  "Sarah",
  "Ariana",
  "Allison",
  "Gabriella",
  "Alice",
  "Madelyn",
  "Cora",
  "Ruby",
  "Eva",
  "Serenity",
  "Autumn",
  "Adeline",
  "Hailey",
  "Gianna",
  "Valentina",
  "Isla",
  "Eliana",
  "Quinn",
  "Nevaeh",
  "Ivy",
  "Sadie",
  "Piper",
  "Lydia",
  "Alexa",
  "Josephine",
  "Emery",
  "Julia",
  "Delilah",
  "Arianna",
  "Vivian",
  "Kaylee",
  "Sophie",
  "Brielle",
  "Madeline",
  "Peyton",
  "Rylee",
  "Clara",
  "Hadley",
  "Melanie",
  "Mackenzie",
  "Reagan",
  "Adalynn",
  "Liliana",
  "Aubree",
  "Jade",
  "Katherine",
  "Isabelle",
  "Natalia",
  "Raelynn",
  "Maria",
  "Athena",
  "Ximena",
  "Arya",
  "Leilani",
  "Taylor",
  "Faith",
  "Rose",
  "Kylie",
  "Alexandra",
  "Mary",
  "Margaret",
  "Lyla",
  "Ashley",
  "Amaya",
  "Eliza",
  "Brianna",
  "Bailey",
  "Andrea",
  "Khloe",
  "Jasmine",
  "Melody",
  "Iris",
  "Isabel",
  "Norah",
  "Annabelle",
  "Valeria",
  "Emerson",
  "Adalyn",
  "Ryleigh",
  "Eden",
  "Emersyn",
  "Anastasia",
  "Kayla",
  "Alyssa",
  "Juliana",
  "Charlie",
  "Esther",
  "Ariel",
  "Cecilia",
  "Valerie",
  "Alina",
  "Molly",
  "Reese",
  "Aliyah",
  "Lilly",
  "Parker",
  "Finley",
  "Morgan",
  "Sydney",
  "Jordyn",
  "Eloise",
  "Trinity",
  "Daisy",
  "Kimberly",
  "Lauren",
  "Genevieve",
  "Sara",
  "Arabella",
  "Harmony",
  "Elise",
  "Remi",
  "Teagan",
  "Alexis",
  "London",
  "Sloane",
  "Laila",
  "Lucia",
  "Diana",
  "Juliette",
  "Sienna",
  "Elliana",
  "Londyn",
  "Ayla",
  "Callie",
  "Gracie",
  "Josie",
  "Amara",
  "Jocelyn",
  "Daniela",
  "Everleigh",
  "Mya",
  "Rachel",
  "Summer",
  "Alana",
];
type PersonGrowthStage =
  | "baby"
  | "toddler"
  | "junior"
  | "elementary"
  | "pubescent"
  | "postPubescent";
interface PersonGrowthStageRange {
  from: number;
  to: number;
}
const GrowthStageAge: Record<PersonGrowthStage, PersonGrowthStageRange> = {
  baby: {
    from: 0,
    to: 0,
  },
  toddler: {
    from: 1,
    to: 4,
  },
  junior: {
    from: 5,
    to: 7,
  },
  elementary: {
    from: 8,
    to: 11,
  },
  pubescent: {
    from: 12,
    to: 15,
  },
  postPubescent: {
    from: 16,
    to: 25,
  },
};
class PersonUniqueness {
  name: string; //Personality name or personality role in home
  curious?: boolean; //Likes to learn new things, gives attention to others, high empathy
  naughty?: boolean; //Not easily disgusted, interested in feeling good mutually, open to every kink like incest or bestiality
  energetic?: boolean; //Optimistic, brave, takes initiative, wants to get attention, can become sadist
  shy?: boolean; //Not very talkative, tendency to blush, secretive, can become masochist
  diligent?: boolean; //Knowledgeable, does not hesitate, strict, does what it needs to be done
  homePersons?: PersonUniqueness[]; //Personalities of other persons at home (family, guardians, roommates, etc...)
  homeOtherNpc?: Npc[]; //Other NPCs in this person home that are not persons (pets basically)
  apply?: (person: Person) => void = () => {}; //Function to modify the person that this uniqueness is applied, if necessary (remove virginity, change stat, etc...)
  appearingChance?: number = 50; //Mathematical weight, the higher the default value is the rarer will be for the lower values
  ageRange?: PersonGrowthStageRange;
  constructor(prototype: PersonUniqueness) {
    Object.assign(this, prototype);
  }
  static applyRandom(person: Person, apply = true): PersonUniqueness {
    let randomNumber = PseudoRandom.getFromRange(
      PseudoRandom.getSeed(person.age, person.name),
      0,
      personUniquenessPresets.reduce(
        (acc, preset) => acc + preset.appearingChance,
        0
      )
    );
    for (const preset of personUniquenessPresets) {
      if (randomNumber < preset.appearingChance) {
        person.uniqueness = preset;
        if (apply) preset.apply(person);
        console.info(preset);
        return;
      }
      randomNumber -= preset.appearingChance;
    }
  }
}
const personUniquenessPresets: PersonUniqueness[] = [
  new PersonUniqueness({
    name: "bottom",
    curious: true,
    shy: true,
    homePersons: [
      {
        name: "mom",
        curious: true,
      },
      {
        name: "dad",
        diligent: true,
      },
    ],
  }),
  new PersonUniqueness({
    name: "jumpy",
    curious: true,
    naughty: true,
    energetic: true,
    homePersons: [
      {
        name: "mom",
        curious: true,
        diligent: true,
      },
      {
        name: "dad",
        shy: true,
      },
      {
        name: "sis",
        shy: true,
      },
    ],
  }),
  new PersonUniqueness({
    name: "experiencedShy",
    shy: true,
    homePersons: [
      {
        name: "dad",
        shy: true,
        curious: true,
        naughty: true,
      },
      {
        name: "mom",
        curious: true,
        diligent: true,
      },
      {
        name: "bro",
        naughty: true,
        energetic: true,
      },
    ],
    apply(kid) {
      kid.mouthVirgin = false;
      kid.mouthTraining = Math.min(100, kid.age * 9);
      if (!kid.hasPussy || kid.age < 6) {
        kid.analVirgin = false;
        kid.anusTraining = 60;
      } else {
        kid.vaginaVirgin = false;
        kid.pussyTraining = 60;
      }
    },
    appearingChance: 9,
  }),
  new PersonUniqueness({
    name: "Carrabina",
    curious: true,
    naughty: true,
    shy: true,
    diligent: true,
    homePersons: [
      {
        name: "mom",
        curious: true,
      },
      {
        name: "dad",
        diligent: true,
        energetic: true,
      },
      {
        name: "bro",
        naughty: true,
        curious: true,
        energetic: true,
      },
    ],
    apply(kid) {
      if (kid.age > 4) {
        kid.lust = 40;
        if (kid.age > 7) {
          kid.mouthVirgin = false;
          kid.mouthTraining = Math.min(100, (kid.age - 7) * 34);
          kid.lust = 60;
          if (kid.age > 8) {
            kid.analVirgin = false;
            kid.anusTraining = Math.min(80, (kid.age - 8) * 60);
          }
        }
      }
    },
    appearingChance: 10,
  }),
  new PersonUniqueness({
    name: "experiencedOrphan",
    naughty: true,
    energetic: true,
    diligent: true,
    homePersons: [
      {
        name: "uncle",
        curious: true,
        naughty: true,
      },
      {
        name: "sibling",
        naughty: true,
        energetic: true,
      },
      {
        name: "uncle's girlfriend",
        curious: true,
        naughty: true,
      },
    ],
    homeOtherNpc: [
      {
        name: "Poppy",
        species: "rabbit",
        status: "pet",
      } as Animal,
    ],
    apply(kid) {
      if (kid.age > 5) {
        if (kid.hasPussy) kid.vaginaVirgin = false;
        if(kid.hasPenis) kid.penisVirgin = false;
        if (kid.hasPussy) kid.pussyTraining = 100;
        kid.lust = 60;
        kid.mouthVirgin = false;
        kid.mouthTraining = 100;
        kid.anusTraining = 10;
      }
    },
    appearingChance: 9,
  }),
  new PersonUniqueness({
    name: "top",
    curious: true,
    energetic: true,
    homePersons: [
      {
        name: "mom",
        shy: true,
      },
      {
        name: "dad",
        shy: true,
      },
      {
        name: "sis",
        curious: true,
        energetic: true,
      },
    ],
    appearingChance: 75,
  }),
  new PersonUniqueness({
    name: "spyX",
    energetic: true,
    homePersons: [
      {
        name: "pa",
        diligent: true,
      },
      {
        name: "ma",
        curious: true,
        energetic: true,
      },
    ],
    homeOtherNpc: [
      {
        name: "Bond",
        species: "dog",
        roughSize: "big",
      } as Animal,
    ],
    appearingChance: 15,
  }),
  new PersonUniqueness({
    name: "strictParents",
    energetic: true,
    diligent: true,
    curious: true,
    homePersons: [
      {
        name: "mom",
        diligent: true,
      },
      {
        name: "dad",
        diligent: true,
      },
    ],
  }),
];
