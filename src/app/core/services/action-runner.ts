import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionDef, ButtonDef } from '../../models/model-define';
import {UartService} from './uart-service';
import { IdleService } from './idle-service';

@Injectable({ providedIn: 'root' })
export class ActionRunnerService {
  private router = inject(Router);
  private uartSrv = inject(UartService);
  private hpState = inject(IdleService);

  
  async run(button: ButtonDef): Promise<void> {
    switch (button.action.type) {
      case 'execute': {
        if (button.action.cmd === 'resetHP') {
          this.hpState.resetHP();
        }
        return;
      }
      case 'nav': {
        await this.router.navigateByUrl(button.action.route);
        return;
      }
      case 'insert': {
        this.uartSrv.send(`${button.action.text}`).subscribe();
        return;
      }
      // case 'http':

      default: {
        return;
      }
    }
  }
}
