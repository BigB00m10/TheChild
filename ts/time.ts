class TimedEvent {
  //The minimum number of hours to pass in order to trigger this event.
  timeoutHours: number;
  //The action to execute when this event is triggered, stored in a string so it can be stored in SugarCube history and save.
  action: string;
  //Optional reference to identify this event and modify or delete it
  ref?: any;
  constructor(timeoutHours: number, action: () => void, ref?: any) {
    this.timeoutHours = timeoutHours;
    this.action = action.toString();
    if (ref) this.ref = ref;
  }
}
class Now {
  //The game has a full date/time and this is the date/time where the game starts.
  //It's also the Monday of the week when this was implemented.
  //This property will always have this value, the current game date/time is stored in $now.date
  date: Date = new Date(2022, 3, 4, 7);
  getCurrentDate(): Date {
    return Variables().now.date;
  }
  //Converts a time string to a Javascript Date object assuming the time is within the current day or the one passed as a reference (ref optional parameter)
  //The string should be something like "7:30 PM"
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
  //Checks if the current date/time is equal or later than the provided time string that will be considered on the same day as currentDate.
  //If currentDate is not provided Now.getCurrentDate() will be used instead.
  //Example: if currentDate is on 11:59 PM Now.isEqualOrLaterThan('7:30 PM') will return true, but false if currentDate is on 12:00 AM (first hour of day)
  isEqualOrLaterThan(timeString: string, currentDate?: Date): boolean {
    if (!currentDate) currentDate = this.getCurrentDate();
    return (
      currentDate.getTime() >=
      this.dateFromTimeString(timeString, currentDate).getTime()
    );
  }
  //Same as isEqualOrLaterThan but it will check if it's earlier instead.
  //12:00 AM will always return true since it's the start of the day.
  isEqualOrEarlierThan(timeString: string, currentDate?: Date): boolean {
    if (!currentDate) currentDate = this.getCurrentDate();
    return (
      currentDate.getTime() <=
      this.dateFromTimeString(timeString, currentDate).getTime()
    );
  }
  //Checks if currentDate time it's between the two provided time strings.
  //It works even if from is in the evening and to is in the morning to check a period in the night time.
  //If currentDate is not provided Now.getCurrentDate() will be used instead.
  isBetween(
    fromTimeString: string,
    toTimeString: string,
    currentDate?: Date
  ): boolean {
    if (!currentDate) currentDate = this.getCurrentDate();
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
  //Checks if now it's exactly the time specified
  is(timeString: string): boolean {
    var currentDate = this.getCurrentDate();
    return (
      currentDate.getTime() ==
      this.dateFromTimeString(timeString, currentDate).getTime()
    );
  }
  //This action is used like an event. Every time a day or more passes this action should be called.
  daysPassed(amount: number): void {
    if (amount < 1) return;
    let variables = Variables();
    let player = variables.player as Player;
    player.workedToday = false;
    let slaves = variables.slaves as Person[];
    for (let index = 0; index < amount; index++) {
      slaves.forEach((slave) => {
        slave.aroused = false;
        slave.lubricatedAss = false;
        slave.lubricatedPussy = false;
        slave.fear = Math.max(0, slave.fear - 10);
        slave.hunger = Math.min(100, slave.hunger + 10);
        slave.freedomWish = Math.max(0, slave.freedomWish - 5);
        slave.lust = Math.max(0, slave.lust - 1);
        if (slave.hunger >= 90)
          slave.love = Math.max(0, slave.love - (slave.hunger - 80));
        if (slave.punishments.includes("naked")) {
          if (slave.obedience < 60)
            slave.obedience += Math.round((61 - slave.obedience) * 0.25);
          else slave.punishments.delete("naked");
        } else slave.obedience = Math.max(0, slave.obedience - 1);
        window.Person.removeAchievement("howAreYou", slave);
      });
      player.lust = Math.min(100, player.lust + 10);
    }
  }
  //Same as above but with hours, also to be used with minutes by giving hour fractions.
  //This event it's independent of daysPassed if hours pass and day changes both events must be called.
  hoursPassed(amount: number): void {
    window.Player.manageEnergy(amount);
    let timedEvents = Variables().timedEvents as TimedEvent[];
    if (timedEvents) {
      for (
        let index = timedEvents.length - 1;
        index < timedEvents.length;
        index++
      ) {
        const element = timedEvents[index];
        element.timeoutHours -= amount;
        if (element.timeoutHours <= 0) {
          eval(element.action);
          timedEvents.splice(index);
        }
      }
      if (!timedEvents.length) Variables().timedEvents = undefined;
    }
  }
  //Adds a timed event that triggers after the specified number of hours (or fraction of hours) has passed. See TimedEvent class for details.
  addTimedEvent(timeoutHours: number, action: () => void, ref?: any): void {
    if (!Variables().timedEvents) Variables().timedEvents = [];
    Variables().timedEvents.push(new TimedEvent(timeoutHours, action));
  }
  extendTimedEvent(ref: any, addHours: number) {
    let timedEvents = Variables().timedEvents;
    if (!timedEvents) return;
    let event = <TimedEvent>(
      timedEvents.firstOrDefault((e: TimedEvent) => e.ref === ref)
    );
    if (!event) return;
    event.timeoutHours += addHours;
  }
  //Makes the specified number of hours pass in the game.
  addHours(amount: number): void {
    var currentDate = this.getCurrentDate();
    var originalDay = currentDate.getDay();
    currentDate.setHours(currentDate.getHours() + amount);
    Npc.updateLocations(currentDate);
    this.hoursPassed(amount);
    this.daysPassed(currentDate.getDay() - originalDay);
  }
  //Skip time until the specified time of the day is reached (Even if it's on the next day).
  skipTo(timeString: string): void {
    let currentDate = this.getCurrentDate();
    let target = this.dateFromTimeString(timeString, currentDate);
    if (target.getTime() <= currentDate.getTime()) {
      target.setDate(target.getDate() + 1);
      this.daysPassed(1);
    }
    this.hoursPassed(Math.abs(target.getTime() - currentDate.getTime()) / 36e5);
    currentDate.setTime(target.getTime());
    Npc.updateLocations(currentDate);
  }
  //Makes the specified number of minutes pass in the game.
  addMinutes(amount: number): void {
    var currentDate = this.getCurrentDate();
    var originalDay = currentDate.getDay();
    currentDate.setMinutes(currentDate.getMinutes() + amount);
    Npc.updateLocations(currentDate);
    this.hoursPassed(amount / 60);
    this.daysPassed(currentDate.getDay() - originalDay);
  }
  //Returns the name of the current weekday in English
  getWeekDay(): string {
    return this.getCurrentDate().toLocaleString("en-us", { weekday: "long" });
  }
  //Returns the current time string in English format. Something like 7:30 PM
  getTime(): string {
    return this.getCurrentDate().toLocaleString("en-us", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  //Checks if the game date is currently on a weekend.
  isWeekend(): boolean {
    var weekDay = this.getCurrentDate().getDay();
    return weekDay == 0 || weekDay == 6;
  }
}
