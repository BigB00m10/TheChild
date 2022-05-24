abstract class Npc {
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
  children: Npc[] = [];
  mom: Npc | Player = null;
  dad: Npc | Player = null;
  aroused: boolean = false;
  hunger: number = 0;
  fear: number = 50;
  love: number = 0;
  obedience: number = 25;
  lust: number = 0;
  freedomWish: number = 75;
  genitals: string;
}
class Person extends Npc {
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
    person.genitals =
      person.gender != "male" ? (person.age < 15 ? "cunny" : "pussy") : "penis";
    person.name = (person.gender != "male" ? femaleNames : maleNames).random();
    person.skin = genGen.skins.random();
    person.hairColor = [
      "black",
      "dark brown",
      "brown",
      "light brown",
      "dirty blonde",
      "blonde",
      "red",
      "auburn",
    ].random();
    person.hairLength =
      person.age == 0
        ? "short"
        : person.age == 1
        ? ["short", "medium"].random()
        : ["short", "medium", "long"].random();
    person.hairStyle = ["curly", "wavey", "straight"].random();
    person.eyeColor = ["green", "blue", "brown", "hazel"].random();
    return person;
  }
}
$(document).on(":passagestart", () => {
  //TODO: temporary event to fix lack of compatibility with older saves
  let variables = Variables();
  let slaves = Variables().slaves as Person[];
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
    if (variables.settings.anal == undefined) variables.settings.anal = true;
  }
});
interface GenderGeneration {
  fromAge: number;
  toAge: number;
  skins: string[];
}
class PersonGeneration {
  females: GenderGeneration = {
    fromAge: 1,
    toAge: 15,
    skins: ["tanned", "brown", "black", "white", "pale", "olive"],
  };
  males: GenderGeneration = {
    fromAge: 1,
    toAge: 15,
    skins: ["tanned", "brown", "black", "white", "pale", "olive"],
  };
  femalePercentage: number = 50;
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
