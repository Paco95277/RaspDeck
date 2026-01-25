import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard';
import {CheatsheetComponent } from './features/cheatsheet-component/cheatsheet-component';
import { AppShell } from './features/app-shell/app-shell';
  
export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', component: DashboardPage },
      { path: 'cheatsheet/:sheet', component: CheatsheetComponent },
      { path: 'cheatsheet/:sheet/:item', component: CheatsheetComponent },
    ],
  },
];