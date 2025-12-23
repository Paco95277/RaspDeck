import { Component, inject } from '@angular/core';
import { switchMap, tap, concat } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../core/services/layout';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-cheatsheet-component',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './cheatsheet-component.html',
  styleUrl: './cheatsheet-component.scss',
})
export class CheatsheetComponent {
  private route = inject(ActivatedRoute);
  private layoutSrv = inject(LayoutService);

  sheet$ = this.route.paramMap.pipe(tap(pm => console.log('Sheet is: ', pm.get('sheet'))),
      switchMap(pm => this.layoutSrv.loadCheatSheet(pm.get('sheet')!))
  );
  // sheet$ = this.route.paramMap.pipe(switchMap(pm => this.layoutSrv.loadCheatSheet(pm.get('sheet')!)));
  // topic$ = this.route.paramMap.pipe(tap((pm) => {console.log('Topic is: ', pm.get('topic'))}))
}
  