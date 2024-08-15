//This interface uses the window DOM object to share objects between back end and front end.
//Every object hooked to the window object will also be directly available in the browser console.
//You'll typically want to use only the functions on the class instances that are hooked to the window.
//Class instance properties are reset every time the game is loaded, so in practice you only can use them if they are constant or temporary.
interface Window {
  Person: Person;
  PersonGeneration: PersonGeneration;
  PersonUniquenessPresets: PersonUniqueness[];
  testPerson: Person;
}
window.Person = new Person();
window.PersonGeneration = new PersonGeneration();
window.PersonUniquenessPresets = personUniquenessPresets;
