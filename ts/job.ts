interface Job {
  name: string;
  pay: number;
  enterTime: string;//Not exactly the enter time but the time that the player absolutely needs to go. Forced by unlessEmergency widget.
}
let Jobs: Record<string, Job> = {
  garbageCollector: {
    name: "garbage collector",
    pay: Math.round((800 / 21.74) * 100) / 100,
    enterTime: "8:30 AM",
  },
};
