// uart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UartService {
  // private baseUrl = 'http://192.168.0.119:8001/api/uart';
  private baseUrl ='/api/uart';

  constructor(private http: HttpClient) {}

  send(data: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${this.baseUrl}/send`, { data });
  }

  sendRead(data: string): Observable<{ ok: boolean; resp: string }> {
    return this.http.post<{ ok: boolean; resp: string }>(`${this.baseUrl}/send_read`, {
      data,
      read_bytes: 200,
    });
  }
}
