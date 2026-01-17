import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScreenSaver } from '../screen-saver/screen-saver';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterOutlet, ScreenSaver],
  template: `
    <router-outlet></router-outlet>
    <app-screen-saver></app-screen-saver>
  `,
})
export class AppShell {

}
