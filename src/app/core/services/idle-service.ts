import { Injectable, inject, signal, computed , effect, EffectRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private timeoutMs = 60_000; 
  private timer?: any;
  public idle$ = new BehaviorSubject<boolean>(false);

  private readonly localStorage = inject(DOCUMENT)?.defaultView?.localStorage;
  private readonly DEFAULT_HP = 35;
  private readonly HP_KEY = 'availableHP_key';
  public availableHP = signal<number>(this.loadHPFromStorage());
  
  constructor() {
    const reset = () => this.resetTimer();
    ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(ev =>
      window.addEventListener(ev, reset, { passive: true })
    );
    this.resetTimer();
    
    //If availableHP changes, it will be recorded into localstorage automatically
    effect(() => {
      this.localStorage?.setItem(this.HP_KEY, String(this.availableHP()));
    });

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

  private loadHPFromStorage(): number {
    const raw = this.localStorage?.getItem(this.HP_KEY);
    if (raw == null) return this.DEFAULT_HP;

    const n = Number(raw);
    if (!Number.isFinite(n)) return this.DEFAULT_HP;
    return Math.min(this.DEFAULT_HP, Math.max(0, Math.trunc(n)));
  }

  public resetHP(): void {
    console.log('Reset HP');
    this.availableHP.set(this.DEFAULT_HP);
  }
}
