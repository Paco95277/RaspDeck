import { Injectable, Signal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LayoutDef } from '../../models/model-define';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private http = inject(HttpClient);
  layoutSwitch = signal<LayoutDef | null>(null);

  constructor() {
    console.log('LayoutService constructor', this);
  }

  loadDefaultLayout(): Promise<LayoutDef> {
    return firstValueFrom(this.http.get<LayoutDef>('assets/default-layout.json'));
  }

  loadCheatSheet(sheet: string) :Promise<LayoutDef> {
    return firstValueFrom(this.http.get<LayoutDef>(`assets/cheatsheets/${sheet.toLocaleLowerCase()}.json`));
  } 
}