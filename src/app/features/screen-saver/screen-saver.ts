import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
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
  now = new Date();
  private t = window.setInterval(() => (this.now = new Date()), 1000);
  public holidayNotice: string = "";
  wake() {
    this.idleSrv.wake();
  }

  ngOnDestroy() {
    clearInterval(this.t);
  }

 ngOnInit() {
    const currentMonth = this.now.getMonth() + 1; //Month starts from 0
    const currentDay = this.now.getDate(); // from 1 to 31
    const currentWeekday = this.now.getDay(); // from 0 to 6
    const HOLIDAYS = holidayJson.holidays;
    
    let holidayExpecting : boolean = false;
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
        this.holidayNotice = "In diesem Monat gibt es keine Feiertage mehr :(";
      }
  }
}
