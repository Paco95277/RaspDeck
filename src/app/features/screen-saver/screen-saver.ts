import { Component, inject, signal, OnDestroy } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { IdleService } from '../../core/services/idle-service';

@Component({
  selector: 'app-screen-saver',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './screen-saver.html',
  styleUrl: './screen-saver.scss',
})
export class ScreenSaver implements OnDestroy {
  private idleSrv = inject(IdleService);
  idle$ = this.idleSrv.idle$;
  now = new Date();
  private t = window.setInterval(() => (this.now = new Date()), 1000);

  wake() {
    this.idleSrv.wake();
  }

  ngOnDestroy() {
    clearInterval(this.t);
  }
}
