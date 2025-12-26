import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard';
import {CheatsheetComponent } from './features/cheatsheet-component/cheatsheet-component';
import { TileGridComponent } from './features/tile-grid-component/tile-grid-component';

export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'cheatsheet/:sheet', component: CheatsheetComponent},
];
  
