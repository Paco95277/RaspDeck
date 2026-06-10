import { Component, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { IdleService } from '../../core/services/idle-service';

@Component({
  selector: 'app-screen-saver',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './screen-saver.html',
  styleUrl: './screen-saver.scss',
})
export class ScreenSaver implements OnDestroy, OnInit {
  private idleSrv = inject(IdleService);
  idle$ = this.idleSrv.idle$;
  public currentTime = signal(new Date());
  private d!: number; //Container for the ID of the Date object

  
  private hpState = inject(IdleService);
  availableHP = this.hpState.availableHP;
  private timeoutOnePersent_Ms = 315_000; //One persent takes 315s, so 100 persent takes 315s*100=31500s=8.75h
  private h!: number; //Container for the ID of the timer object

  wake() {;
    this.idleSrv.wake();
  }
 
  ngOnDestroy() {
    clearInterval(this.d);
    clearInterval(this.h);
  }

 ngOnInit() {
    this.d = window.setInterval(() => {this.currentTime.set(new Date());}, 10000);
    this.h = window.setInterval(() => {this.availableHP.update(v => Math.max(0, v-1));}, this.timeoutOnePersent_Ms);

  }

}
