interface Job {
  name: string;
  pay: number;
  enterTime: string;
}
let Jobs: Record<string, Job> = {
  garbageCollector: {
    name: "garbage collector",
    pay: Math.round((800 / 21.74) * 100) / 100,
    enterTime: "8:30 AM",
  },
};
