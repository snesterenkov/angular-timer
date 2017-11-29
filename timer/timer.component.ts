import { Component, OnDestroy } from '@angular/core';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Subscription } from 'rxjs/Subscription';
import { Constants, TimeFormat } from './common';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnDestroy {

  /**
   * curTime - current time of timer @type {TimeFormat}
   * secondsFormat - variable, that include seconds in right format
   * isValidButton - make Wait button enabled/disabled
   */
  curTime = new TimeFormat(0, 0, 0);
  secondsFormat = 0;
  clickTime = 0;
  lastClick = 0;
  waitTime = Constants.WAITING;
  isValidButton = false;
  startStopButtonName = 'Start';

  private subscriptionApp: Subscription;
  private subscriptionTimer: Subscription;

  get isRunning(): boolean {
    return Boolean(this.subscriptionTimer);
  }

  /**function startup period(Constant.PERIOD) = 10ms (can be changed at 'app/timer/common.ts') */
  start(): void {
    this.subscriptionTimer = IntervalObservable.create(Constants.PERIOD).subscribe(() => {
      this.mainTimer();
    });
  }

  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.subscriptionTimer.unsubscribe();
    this.subscriptionTimer = null;
  }

  mainTimer(): void {
    if (this.curTime.seconds < 60 - Constants.INCREMENT) {
      this.curTime.seconds += Constants.INCREMENT;
      this.secondsFormat = Math.floor(this.curTime.seconds);
    } else {
      this.curTime.seconds = 0;
      if (this.curTime.minutes < 59) {
        this.curTime.minutes += 1;
      } else {
        this.curTime.minutes = 0;
        this.curTime.hours = this.curTime.hours + 1;
      }
    }
  }

  startStopButton(): void {
    if (this.isRunning) {
      this.stop();
      this.startStopButtonName = 'Start';
      this.isValidButton = false;
    } else {
      this.start();
      this.startStopButtonName = 'Stop';
      this.isValidButton = true;
    }
  }

  waitButton(): void {
  this.clickTime = Date.now();
    if (this.clickTime - this.lastClick < Constants.WAITING * 1000) {
      this.waitTime = Constants.WAITING;
      this.stop();
      this.timeToResume();
    } else {
      this.lastClick = Date.now();
    }
  }

  timeToResume(): void {
    if (!this.subscriptionApp) {
      this.subscriptionApp = IntervalObservable.create(Constants.PERIOD).subscribe(() => {
        if (this.waitTime > 0) {
          this.waitTime -= Constants.INCREMENT;
        } else {
          this.subscriptionApp.unsubscribe();
          this.subscriptionApp = null;
          this.start();
        }
      });
    }
  }

  reset(): void {
    if (this.isRunning) {
      this.stop();
    }

    this.startStopButtonName = 'Start';
    this.isValidButton = false;
    this.secondsFormat = 0;
    this.curTime.reset();
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
