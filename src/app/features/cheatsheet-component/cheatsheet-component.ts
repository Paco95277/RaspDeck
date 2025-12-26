import { Component, inject, Output, EventEmitter } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../core/services/layout';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TileGridComponent } from "../tile-grid-component/tile-grid-component";
import {TileEvent} from '../../models/tile-event';
import { LayoutDef, ButtonDef } from '../../models/model-define';
import {ActionRunnerService} from '../../core/services/action-runner';

@Component({
  selector: 'app-cheatsheet-component',
  imports: [AsyncPipe, TileGridComponent],
  standalone: true,
  templateUrl: './cheatsheet-component.html',
  styleUrl: './cheatsheet-component.scss',
})
export class CheatsheetComponent {
  private route = inject(ActivatedRoute);
  private layoutSrv = inject(LayoutService);
  private runner = inject(ActionRunnerService);
  @Output() pressed = new EventEmitter<ButtonDef>();

  layout$ = this.route.paramMap.pipe(switchMap(pm => this.layoutSrv.loadCheatSheet(pm.get('sheet')!)),
    tap(layout => this.layoutSrv.layoutSwitch.set(layout))
  );

  async onTilePressed(b: ButtonDef) {
    console.log('[PRESS]', b);
    await this.runner.run(b);
    // this.pressed.emit(b);
  }
  // sheet$ = this.route.paramMap.pipe(
  // map(pm => pm.get('sheet')),
  // filter((s): s is string => !!s),
  // distinctUntilChanged(),
  // tap(s => console.log('Sheet is:', s)),
  // switchMap(s => this.layoutSrv.loadCheatSheet(s))
  // );
  // // sheet$ = this.route.paramMap.pipe(tap(pm => console.log('Sheet is: ', pm.get('sheet'))),
  //   switchMap(pm => this.layoutSrv.loadCheatSheet(pm.get('sheet')!))
  // );
}
  