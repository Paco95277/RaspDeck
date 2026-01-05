import { Component, inject, Output, EventEmitter } from '@angular/core';
import { switchMap, tap, distinctUntilChanged, map, shareReplay } from 'rxjs';
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

  // layout$ = this.route.paramMap.pipe(switchMap(pm => this.layoutSrv.loadCheatSheet(pm.get('sheet')!)),
  //   tap(layout => this.layoutSrv.layoutSwitch.set(layout)));

  layout$ = this.route.paramMap.pipe(
    map(pm => ({
      sheet: pm.get('sheet') ?? '',
      item: pm.get('item'),          // 可能为 null
    })),
    distinctUntilChanged((a, b) => a.sheet === b.sheet && a.item === b.item),

    switchMap(({ sheet, item }) => {
      if (!sheet) throw new Error('Missing route param: sheet');
      return item
        ? this.layoutSrv.loadSheetItems(sheet, item)
        : this.layoutSrv.loadCheatSheet(sheet);
    }),
    tap(layout => this.layoutSrv.layoutSwitch.set(layout)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  async onTilePressed(b: ButtonDef) {
    console.log('[PRESS]', b.title);
    await this.runner.run(b);
  }
}
  