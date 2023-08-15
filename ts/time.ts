class TimedEvent {
  //The minimum number of hours to pass in order to trigger this event.
  timeoutHours: number;
  //The action to execute when this event is triggered, stored in a string so it can be stored in SugarCube history and save.
  action: string;
  //Reference to identify this event and modify or delete it.
  ref: any;
  //If a reference is not provided the contents of the action will be used as reference instead.
  constructor(timeoutHours: number, javascript: string, ref?: any);
  constructor(timeoutHours: number, action: () => void, ref?: any);
  constructor(
    timeoutHours: number,
    actionOrJavascript: (() => void) | string,
    ref?: any
  ) {
    this.timeoutHours = timeoutHours;
    this.action = actionOrJavascript.toString();
    if (ref) this.ref = ref;
    else this.ref = this.action;
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
  dateFromTimeString(timeString: string, ref?: Date): Date {
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
    let agingIgDays = variables.settings.agingIgDays ?? 365.25;
    let ageUp = (slave: Person) => {
      slave.ageProgress = 0;
      slave.age++;
      if (!variables.agedUpNpc) variables.agedUpNpc = new Set<number>();
      (<Set<number>>variables.agedUpNpc).add(slave.uid);
      window.Person.adjustPubescence(true, slave);
    };
    let manageAging =
      agingIgDays == 365.25
        ? (slave: Person) => {
            if (slave.stopAging) return;
            let currentDate = this.getCurrentDate();
            let nextBirthDay = new Date(currentDate); //Date object to calculate next birthday. Starting with current date.
            nextBirthDay.setDate(nextBirthDay.getDate() - ++slave.ageProgress); //First, increase progress and go to last birthday
            nextBirthDay.setFullYear(nextBirthDay.getFullYear() + 1); //Then advance a year
            if (currentDate >= nextBirthDay) ageUp(slave);
          }
        : agingIgDays > 0
        ? (slave: Person) => {
            if (!slave.stopAging && ++slave.ageProgress >= agingIgDays)
              ageUp(slave);
          }
        : () => {};
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
        manageAging(slave);
        if (slave.pregnantDays != undefined) slave.pregnantDays++;
      });
      player.lust = Math.min(100, player.lust + 10);
      if (player.pregnantDays != undefined) player.pregnantDays++;
    }
  }
  //Same as above but with hours, also to be used with minutes by giving hour fractions.
  //This event it's independent of daysPassed if hours pass and day changes both events must be called.
  hoursPassed(amount: number): void {
    window.Player.manageEnergy(amount);
    const timedEvents = Variables().timedEvents as TimedEvent[];
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
  //Providing a reference object or value to the event it's optional. But necessary if you need to modify or check the event afterwards.
  //If a reference is not provided the contents of the action will be used as reference instead.
  //If a timed event with the same reference exist, that event timeout will be extended instead of creating a new one.
  addTimedEvent(timeoutHours: number, action: () => void, ref?: any): void;
  addTimedEvent(timeoutHours: number, javascript: string, ref?: any): void;
  addTimedEvent(
    timeoutHours: number,
    actionOrJavascript: (() => void) | string,
    ref?: any
  ): void {
    if (!Variables().timedEvents) Variables().timedEvents = [];
    const javascript = actionOrJavascript.toString();
    if (!ref) ref = javascript;
    const existing = this.getTimedEventByRef(ref);
    if (existing) {
      existing.timeoutHours = timeoutHours;
      return;
    }
    Variables().timedEvents.push(new TimedEvent(timeoutHours, javascript, ref));
  }
  //Gets a timed event by its reference.
  getTimedEventByRef(ref: any): TimedEvent {
    const timedEvents = Variables().timedEvents;
    if (!timedEvents) return null;
    return timedEvents.firstOrDefault((e: TimedEvent) => e.ref === ref);
  }
  //Extend a specific timed event (with the provided reference) by the specified hours (adds hours to the timeout)
  extendTimedEvent(ref: any, addHours: number): void {
    const event = this.getTimedEventByRef(ref);
    if (!event) return;
    event.timeoutHours += addHours;
  }
  //Erases the first timed event with the specified reference
  removeTimedEvent(ref: any): void {
    const timedEvents: TimedEvent[] = Variables().timedEvents;
    if (!timedEvents) return;
    for (let index = 0; index < timedEvents.length; index++)
      if (timedEvents[index].ref === ref) {
        timedEvents.splice(index);
        break;
      }
    if (!timedEvents.length) Variables().timedEvents = undefined;
  }
  //Makes sure that a specific timed event (with the provided reference) has at least the hours specified.
  assertTimedEvent(ref: any, hours: number): void {
    const event = this.getTimedEventByRef(ref);
    if (!event) return;
    event.timeoutHours = Math.max(event.timeoutHours, hours);
  }
  //Should be called when current game time changes.
  timeChanged(currentDate: Date) {
    Npc.updateLocations(currentDate);
    let variables = Variables();
    let cook = variables.settings.cook;
    if (!cook || !cook.npc) return;
    let today =
      currentDate.getFullYear() * 1e4 +
      currentDate.getMonth() * 1e2 +
      currentDate.getDate();
    for (let index = 0; index < cook.feedTimes.length; index++)
      if (!cook.lastFeedings[index] || cook.lastFeedings[index] < today)
        if (this.isEqualOrLaterThan(cook.feedTimes[index], currentDate)) {
          for (let slave of variables.slaves) {
            let config =
              cook.exceptions.firstOrDefault((e: any) => e.npc == slave.uid) ??
              cook;
            if (!config.feedEnabled) continue;
            if (slave.hunger >= config.feedAtHunger)
              slave.hunger -= Math.max(5, slave.hunger - config.feedAtHunger);
          }
          cook.lastFeedings[index] = today;
        }
  }
  //Makes the specified number of hours pass in the game.
  addHours(amount: number): void {
    let currentDate = this.getCurrentDate();
    let originalDay = currentDate.getDay();
    currentDate.setHours(currentDate.getHours() + amount);
    this.daysPassed(currentDate.getDay() - originalDay);
    this.hoursPassed(amount);
    this.timeChanged(currentDate);
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
    this.timeChanged(currentDate);
  }
  //Makes the specified number of minutes pass in the game.
  addMinutes(amount: number): void {
    let currentDate = this.getCurrentDate();
    let originalDay = currentDate.getDay();
    currentDate.setMinutes(currentDate.getMinutes() + amount);
    this.daysPassed(currentDate.getDay() - originalDay);
    this.hoursPassed(amount / 60);
    this.timeChanged(currentDate);
  }
  //Fasts forwards the number of specified days while triggering all that would happen on them and ending up in the same time and player energy as before calling the function
  skipDays(amount: number): void {
    let variables = Variables();
    let currentDate = variables.now.date;
    let player = <Player>variables.player;
    let oEnergy = player.energy;
    let oTime = this.getTime();
    if (variables.cook?.npc)
      currentDate.setTime(
        this.dateFromTimeString(variables.cook.feedTimes[0], currentDate)
      ); //If there's a cook, set the time to the first feed time so the feed triggers on the timeChanged event
    this.hoursPassed(amount * 24);
    let advanceDay = () => {
      currentDate.setDate(currentDate.getDate() + 1);
      this.daysPassed(1);
      this.timeChanged(currentDate);
    };
    for (let index = 0; index < amount - 1; index++) {
      //Trigger all events on all days except the last one
      advanceDay();
      if (player.job && !this.isWeekend(currentDate))
        player.cash += player.job.pay;
    }
    //Last day to advance will be executed on the original hour instead of the first feed time
    currentDate.setTime(this.dateFromTimeString(oTime, currentDate));
    advanceDay();
    if (
      player.job &&
      !this.isWeekend(currentDate) &&
      this.isEqualOrLaterThan(player.job.enterTime, currentDate)
    ) {
      player.cash += player.job.pay;
      player.workedToday = true;
    }
    player.energy = oEnergy;
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
  //Return the current in-game date in English format.
  getDateString(): string {
    return this.getCurrentDate().toLocaleString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  //Checks if the game date is currently on a weekend.
  isWeekend(currentDate?: Date): boolean {
    var weekDay = (currentDate ?? this.getCurrentDate()).getDay();
    return weekDay == 0 || weekDay == 6;
  }
}
