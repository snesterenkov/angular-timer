export class Constants {
  /**
   * PERIOD - timer period
   * INCREMENT - number by which the timer increases
   */
  static PERIOD = 10;
  static WAITING = 0.3;
  static INCREMENT = Constants.PERIOD / 1000;
}

export class TimeFormat {
  hours: number;
  minutes: number;
  seconds: number;

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  reset () {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }
}
