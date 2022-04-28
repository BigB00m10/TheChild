interface Window {
  Now: Now;
  Homes: Record<string, Home>;
  Jobs: Record<string, Job>;
  Player: Player;
  Person: Person;
  PersonGeneration: PersonGeneration;
  Basement: Basement;
  OnlineStore: OnlineStore;
}
window.Now = new Now();
window.Homes = Homes;
window.Jobs = Jobs;
window.Player = new Player();
window.Person = new Person();
window.OnlineStore = new OnlineStore();
window.Basement = new Basement();
