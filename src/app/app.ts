import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiClient } from './core/services/api-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('macroPanel');
}
