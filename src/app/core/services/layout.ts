import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LayoutDef } from '../../models/model_1';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private http = inject(HttpClient);

  loadDefaultLayout(): Promise<LayoutDef> {
    return firstValueFrom(this.http.get<LayoutDef>('assets/default-layout.json'));
  }

  loadCheatSheet(sheet: string) :Promise<LayoutDef> {
    return firstValueFrom(this.http.get<LayoutDef>(`assets/cheatsheets/${sheet.toLocaleLowerCase()}.json`));
  } 
}