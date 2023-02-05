interface Job {
  name: string;
  pay: number;
  enterTime: string; //Not exactly the enter time but the time that the player absolutely needs to go. Forced by unlessEmergency widget.
  workHours: number; //How many hours this job will take. More hours means more energy depleted too.
}
let Jobs: Record<string, Job> = {
  garbageCollector: {
    name: "garbage collector",
    pay: 37.38, //Math.round((800 / 21.74) * 100) / 100, //800 a month divided by the average days per month with two decimal places
    enterTime: "8:30 AM",
    workHours: 8,
  },
  //Teacher: {
  //  name: "Teacher shool",
  //  pay: Math.round((1000 / 11.14) * 100) / 100,
  //  enterTime: "8:00 AM",
  //},
};
