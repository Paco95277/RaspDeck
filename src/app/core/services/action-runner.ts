import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionDef } from '../../models/model_1';

@Injectable({ providedIn: 'root' })
export class ActionRunnerService {
  private router = inject(Router);

  async run(action: ActionDef): Promise<void> {
    switch (action.type) {
      case 'open_url': {
        window.open(action.url, '_blank', 'noopener,noreferrer');
        return;
      }

      case 'nav': {
        await this.router.navigateByUrl(action.route);
        return;
      }

      case 'none': {
        return;
      }

      case 'ws':
      case 'http':
      case 'shell':
      case 'key': {
        console.log('[ActionRunner] not implemented yet:', action);
        return;
      }

      default: {
        // TS 理论上不会进来，但加一层保护
        console.warn('[ActionRunner] unknown action:', action);
        return;
      }
    }
  }
}
