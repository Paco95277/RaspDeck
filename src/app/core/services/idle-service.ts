import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private timeoutMs = 10_000; 
  private timer?: any;

  public idle$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const reset = () => this.resetTimer();

    ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(ev =>
      window.addEventListener(ev, reset, { passive: true })
    );

    this.resetTimer();
    }

  public resetTimer() {
    clearTimeout(this.timer);
    this.idle$.next(false);

    this.timer = setTimeout(() => {
      this.idle$.next(true);
    }, this.timeoutMs);
  }

  public wake() {
    this.resetTimer();
  }
}
