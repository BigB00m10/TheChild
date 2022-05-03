class Now {
  date: Date = new Date(2022, 3, 4, 7);
  private getCurrentDate(): Date {
    return Variables().now.date;
  }
  private dateFromTimeString(timeString: string, ref?: Date): Date {
    if (!ref) ref = this.getCurrentDate();
    return new Date(
      ref.toLocaleString("en-us", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }) +
        " " +
        timeString
    );
  }
  isEqualOrLaterThan(timeString: string, currentDate?: Date): boolean {
    if (!currentDate) currentDate = this.getCurrentDate();
    return (
      currentDate.getTime() >=
      this.dateFromTimeString(timeString, currentDate).getTime()
    );
  }
  isEqualOrEarlierThan(timeString: string, currentDate?: Date): boolean {
    if (!currentDate) currentDate = this.getCurrentDate();
    return (
      currentDate.getTime() <=
      this.dateFromTimeString(timeString, currentDate).getTime()
    );
  }
  isBetween(fromTimeString: string, toTimeString: string): boolean {
    var currentDate = this.getCurrentDate();
    var currentTimeStamp = currentDate.getTime();
    var fromTimeStamp = this.dateFromTimeString(
      fromTimeString,
      currentDate
    ).getTime();
    var toTimeStamp = this.dateFromTimeString(
      toTimeString,
      currentDate
    ).getTime();
    if (fromTimeStamp < toTimeStamp)
      return (
        currentTimeStamp >= fromTimeStamp && currentTimeStamp <= toTimeStamp
      );
    if (currentDate.getHours() < 12) return currentTimeStamp <= toTimeStamp;
    return currentTimeStamp >= fromTimeStamp;
  }
  readonly onDaysPassed = new LiteEvent<number>();
  daysPassed(amount: number) {
    if (amount < 1) return;
    let variables = SugarCube.State.variables as any;
    (variables.player as Player).workedToday = false;
    let slaves = variables.slaves as Person[];
    for (let index = 0; index < amount; index++) {
      slaves.forEach((slave) => {
        slave.fear = Math.max(0, slave.fear - 5);
        slave.hunger = Math.min(100, slave.hunger + 10);
      });
    }
    this.onDaysPassed.trigger(amount);
  }
  addHours(amount: number) {
    var currentDate = this.getCurrentDate();
    var originalDay = currentDate.getDay();
    currentDate.setHours(currentDate.getHours() + amount);
    this.daysPassed(currentDate.getDay() - originalDay);
  }
  skipTo(timeString: string) {
    let currentDate = this.getCurrentDate();
    let target = this.dateFromTimeString(timeString, currentDate);
    if (target.getTime() < currentDate.getTime()) {
      target.setDate(target.getDate() + 1);
      this.daysPassed(1);
    }
    currentDate.setTime(target.getTime());
  }
  addMinutes(amount: number) {
    var currentDate = this.getCurrentDate();
    var originalDay = currentDate.getDay();
    currentDate.setMinutes(currentDate.getMinutes() + amount);
    this.daysPassed(currentDate.getDay() - originalDay);
  }
  getWeekDay(): string {
    return this.getCurrentDate().toLocaleString("en-us", { weekday: "long" });
  }
  getTime(): string {
    return this.getCurrentDate().toLocaleString("en-us", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
}
