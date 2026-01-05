import { Component, OnInit, inject, signal, computed, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout';
import { LayoutDef, ButtonDef } from '../../models/model-define';
import {TileEvent} from '../../models/tile-event';

@Component({
  selector: 'app-tile-grid-component',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './tile-grid-component.html',
  styleUrl: './tile-grid-component.scss',
})
export class TileGridComponent {
  @Output() pressed = new EventEmitter<ButtonDef>();
  layoutSrv = inject(LayoutService); 

  tiles = computed<ButtonDef[]>(() => {
    const l = this.layoutSrv.layoutSwitch();
    if (!l) return [];
    return this.normalizeTiles(l);
  });

  normalizeTiles(layout: LayoutDef): ButtonDef[] {
    const total = layout.rows * layout.cols;
    const out: ButtonDef[] = [];
    for (let i = 0; i < total; i++) {
      const b = layout.buttons[i];
      out.push(b ?? { id: `empty-${i}`, title: '', icon: '⬛', action: { type: 'none' } });
    }
    return out;
  }
}
