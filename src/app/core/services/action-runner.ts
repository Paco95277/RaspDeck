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
