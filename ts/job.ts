interface Job {
  name: string;
  pay: number;
  enterTime: string;
  workHours: number;
}

let Jobs: Record<string, Job> = {
  garbageCollector: {
    name: "garbage collector",
    pay: 37.38,
    enterTime: "8:30 AM",
    workHours: 8,
  },
  teacher: {
    name: "Teacher",
    pay: 45.67,
    enterTime: "9:00 AM",
    workHours: 7,
  },
};
 