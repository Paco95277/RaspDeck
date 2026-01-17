import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout';
import { LayoutDef, ButtonDef } from '../../models/model-define';
import {ActionRunnerService} from '../../core/services/action-runner';
import { TileGridComponent } from '../tile-grid-component/tile-grid-component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TileGridComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  public layoutSrv = inject(LayoutService);
  private runner = inject(ActionRunnerService);
 
  async ngOnInit() {
    try {
      const lay = await this.layoutSrv.loadDefaultLayout();
      this.layoutSrv.layoutSwitch.set(lay);
    } catch(e) {
      console.error('loadDefaultLayout failed', e);
    }
  }

  async onPress(b: ButtonDef) {
    console.log('[PRESS]', b.title);
    await this.runner.run(b); 
  }
}

