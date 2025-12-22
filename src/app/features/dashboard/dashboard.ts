import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout';
import { LayoutDef, ButtonDef } from '../../models/model_1';
import {ActionRunnerService} from '../../core/services/action-runner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  private layoutSvc = inject(LayoutService);
  private runner = inject(ActionRunnerService);
  layout = signal<LayoutDef | null>(null);

  tiles = computed<ButtonDef[]>(() => {
    const l = this.layout();
    if (!l) return [];
    return this.normalizeTiles(l);
  });

  async ngOnInit() {
    const l = await this.layoutSvc.loadDefaultLayout();
    this.layout.set(l);
  }

  async onPress(b: ButtonDef) {
    console.log('[PRESS]', b);
    await this.runner.run(b.action);
  }
  private normalizeTiles(layout: LayoutDef): ButtonDef[] {
    const total = layout.rows * layout.cols;
    const out: ButtonDef[] = [];
    for (let i = 0; i < total; i++) {
      const b = layout.buttons[i];
      out.push(b ?? { id: `empty-${i}`, title: '', icon: '⬛', action: { type: 'none' } });
    }
    return out;
  }
}
