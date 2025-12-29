import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionDef, ButtonDef } from '../../models/model-define';
import {UartService} from './uart-service';

@Injectable({ providedIn: 'root' })
export class ActionRunnerService {
  private router = inject(Router);
  private uartSrv = inject(UartService);

  async run(button: ButtonDef): Promise<void> {
    switch (button.action.type) {
      case 'open_url': {
        // window.open(action.url, '_blank', 'noopener,noreferrer');
        return;
      }
      case 'nav': {
        await this.router.navigateByUrl(button.action.route);
        return;
      }
      case 'insert': {
        console.log('Inserting...');
        this.uartSrv.send(`${button.action.text}`).subscribe();
        return;
      }
      // case 'ws':
      // case 'http':
      // case 'shell':

      default: {
        // TS 理论上不会进来，但加一层保护
        // console.warn('[ActionRunner] unknown action:', action);
        return;
      }
    }
  }
}
