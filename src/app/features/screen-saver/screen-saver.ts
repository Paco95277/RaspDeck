import { Component, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { IdleService } from '../../core/services/idle-service';
import holidayJson from '../../../assets/holidays.json';

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
  public holidayNotice: string = "";
  public scheduleNotice = computed(() => {
    const h = this.currentTime().getHours();
    if (h < 11) return "Noch genug Zeit zum Chillen";
    if (h < 12) return "Zeit, die Kantine zu checken";
    if (h < 17) return "Nicht immer arbeiten, Kaffee nicht vergessen";
    return "Zeit für Feierabend!";
  });
  
  private hpState = inject(IdleService);
  availableHP = this.hpState.availableHP;
  numOfBlocks = computed(() => {const n = this.availableHP(); return Array.from({length: n})});
  private timeoutForOneHP_Ms = 900_000; //The time taken to reduce one HP. Total HP = 35, so reducing all HP to zero wil take 8.45 hours
  private h!: number; //Container for the ID of the timer object

  wake() {
    this.idleSrv.wake();
  }
 
  ngOnDestroy() {
    clearInterval(this.d);
    clearInterval(this.h);
  }

 ngOnInit() {
    const currentMonth = this.currentTime().getMonth() + 1; //Month starts from 0
    const currentDay = this.currentTime().getDate(); // from 1 to 31
    const currentWeekday = this.currentTime().getDay(); // from 0 to 6
    const HOLIDAYS = holidayJson.holidays;
    let holidayExpecting : boolean = false;

    this.d = window.setInterval(() => {this.currentTime.set(new Date());}, 10000);
    this.h = window.setInterval(() => {this.availableHP.update(v => Math.max(0, v-1));}, this.timeoutForOneHP_Ms);


    for (let i = 0; i < HOLIDAYS.length; i++) {
      if (currentMonth === HOLIDAYS[i].month && currentDay <= HOLIDAYS[i].day) {
        //console.log(`Next holiday is in ${HOLIDAYS[i].day - currentDay} day(s)`);
        this.holidayNotice = `Nächster Feiertag ${HOLIDAYS[i].name} kommt in ${HOLIDAYS[i].day - currentDay} Tag(e)`;
        holidayExpecting = true;
        break;
      }
    }
    if (holidayExpecting === false) {
        //console.log('There is no holiday in the rest of this month')
        this.holidayNotice = "";
    }
  }

}
