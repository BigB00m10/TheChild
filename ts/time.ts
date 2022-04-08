class Now {
  date: Date = new Date(2022, 3, 4, 7);
  private getCurrentDate(): Date {
    return SugarCube.State
      ? ((SugarCube.State.variables as any).now as Now).date
      : this.date;
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
  addHours(amount: number) {
    var currentDate = this.getCurrentDate();
    var originalDay = currentDate.getDay();
    currentDate.setHours(currentDate.getHours() + amount);
    if (currentDate.getDay() != originalDay)
      ((SugarCube.State.variables as any).player as Player).workedToday = false;
  }
  skipTo(timeString: string) {
    var currentDate = this.getCurrentDate();
    var target = this.dateFromTimeString(timeString, currentDate);
    if (target.getTime() < currentDate.getTime()) {
      target.setDate(target.getDate() + 1);
      ((SugarCube.State.variables as any).player as Player).workedToday = false;
    }
    currentDate.setTime(target.getTime());
  }
  addMinutes(amount: number) {
    var currentDate = this.getCurrentDate();
    var originalDay = currentDate.getDay();
    currentDate.setMinutes(currentDate.getMinutes() + amount);
    if (currentDate.getDay() != originalDay)
      ((SugarCube.State.variables as any).player as Player).workedToday = false;
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
