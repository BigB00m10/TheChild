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
  gender: Gender;
  hasPussy: boolean;
  hasPenis: boolean;
  lubricatedAss: boolean;
  lubricatedPussy: boolean;
  pussyTraining: number = 0;
  anusTraining: number = 0;
  mouthTraining: number = 0;
  genitalVirgin: boolean = true;
  analVirgin: boolean = true;
  mouthVirgin: boolean = true;
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
  genitals: Genitals;
  status: NpcStatus = "citizen";
  need: string;
  index: undefined;
  achievements: string[] = [];
  punishments: string[] = [];
  location: string = "unknown";
  uniqueness: PersonUniqueness;
  hasAchievement(achievement: string, npc?: Npc): boolean {
    if (!npc) npc = Variables().npc;
    return npc.achievements.includes(achievement);
  }
  setAchievement(achievement: string, npc?: Npc): void {
    if (!npc) npc = Variables().npc;
    if (!this.hasAchievement(achievement, npc))
      npc.achievements.push(achievement);
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
      if (npc.genitalVirgin) value.virginType = "virgin " + npc.genitals;
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
    //let sleepTime = window.Now.isBetween("10:00 PM", "7:00 AM", currentDate);
    let homeSpaces = variables.player.home.spaces.filter(
      (space: string) => space != "basement"
    );
    let baseSeed = currentDate.getTime() - 1649048400000;
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
  generate(gen?: PersonGeneration): Person {
    if (gen === undefined) gen = new PersonGeneration();
    let person = new Person();
    person.gender =
      Math.random() * 100 + 1 < gen.femalePercentage ? "female" : "male";
    person.title = person.gender != "male" ? "girl" : "boy";
    person.pronoun = person.gender != "male" ? "her" : "him";
    person.GenPronoun = person.gender != "male" ? "She" : "He";
    person.genPronoun = person.gender != "male" ? "she" : "he";
    person.possessive = person.gender != "male" ? "her" : "his";
    person.Possessive = person.gender != "male" ? "Her" : "His";
    person.hasPussy = person.gender == "female";
    person.hasPenis = person.gender == "male";
    let genGen: GenderGeneration =
      person.gender != "male" ? gen.females : gen.males;
    person.age =
      Math.floor(Math.random() * (genGen.toAge - genGen.fromAge)) +
      genGen.fromAge;
    if (person.age < 6)
      person.freedomWish -= ((6 - person.age) / 6) * person.freedomWish;
    person.genitals =
      person.gender != "male" ? (person.age < 15 ? "cunny" : "pussy") : "penis";
    person.name = (person.gender != "male" ? femaleNames : maleNames).random();
    person.skin = gen.skins.random();
    person.hairColor = gen.hairColors.random();
    person.hairLength =
      person.age == 0
        ? "short"
        : person.age == 1
        ? ["short", "medium"].random()
        : ["short", "medium", "long"].random();
    let hairStyles = gen.hairStyles;
    if (person.gender == "male")
      hairStyles.delete("pig tails", "twin tails", "ponytail");
    person.hairStyle = hairStyles.random();
    person.eyeColor = gen.eyeColors.random();
    person.uid = getUid();
    return person;
  }
  getWandering(): Person[] {
    let variables = Variables();
    return variables.slaves.filter(
      (slave: Person) => slave.location == variables.scenery
    );
  }
  getWanderingPhrase(): string {
    let names = this.getWandering().map((slave: Person) => slave.name);
    if (names.length == 0) return "";
    if (names.length == 1) return names[0] + " is here.\n";
    let last = names.pop();
    return names.join(", ") + " and " + last + " are here.\n";
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
  femalePercentage: number = 50;
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
class PersonUniqueness {
  name: string;
  curious: boolean;
  naughty: boolean;
  energetic: boolean;
  shy: boolean;
  nerd: boolean;
  homePersons: PersonUniqueness[];
  homeOtherNpc: Npc[];
  apply: (person: Person) => void;
  appearingChance: number;
}
