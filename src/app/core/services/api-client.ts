import { Injectable, inject} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config';

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  /** query string */
  query?: Record<string, QueryValue>;
  /** extra headers */
  headers?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private http = inject(HttpClient);
  private cfg = inject(ConfigService);

  /** Make sure we never end with "/" */
  private get baseUrl(): string {
    const raw = this.cfg.config.apiBaseUrl ?? '/api';
    return raw.replace(/\/+$/, '');
  }

  private buildUrl(path: string): string {
    // allow absolute url if you really want
    if (/^https?:\/\//i.test(path)) return path;

    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${p}`;
  }

  private buildParams(query?: Record<string, QueryValue>): HttpParams | undefined {
    if (!query) return undefined;

    let params = new HttpParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === null || v === undefined) continue;
      params = params.set(k, String(v));
    }
    return params;
  }

  private buildHeaders(extra?: Record<string, string>): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        headers = headers.set(k, v);
      }
    }
    return headers;
  }

  private async handle<T>(obs: any): Promise<T> {
    try {
      return await firstValueFrom(obs);
    } catch (e) {
      throw this.normalizeError(e);
    }
  }

  private normalizeError(e: unknown): Error {
    if (e instanceof HttpErrorResponse) {
      const status = e.status;
      // 后端有时会把具体错误放在 error 字段里（string/object）
      const detail =
        typeof e.error === 'string'
          ? e.error
          : e.error?.detail ?? e.message;

      return new Error(`[API ${status}] ${detail}`);
    }
    if (e instanceof Error) return e;
    return new Error(String(e));
  }

  // ---------- Public APIs ----------

  get<T>(path: string, opt: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const params = this.buildParams(opt.query);
    const headers = this.buildHeaders(opt.headers);
    return this.handle<T>(this.http.get<T>(url, { params, headers }));
  }

  post<T>(path: string, body: unknown, opt: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const params = this.buildParams(opt.query);
    const headers = this.buildHeaders(opt.headers);
    return this.handle<T>(this.http.post<T>(url, body, { params, headers }));
  }

  put<T>(path: string, body: unknown, opt: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const params = this.buildParams(opt.query);
    const headers = this.buildHeaders(opt.headers);
    return this.handle<T>(this.http.put<T>(url, body, { params, headers }));
  }

  delete<T>(path: string, opt: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path);
    const params = this.buildParams(opt.query);
    const headers = this.buildHeaders(opt.headers);
    return this.handle<T>(this.http.delete<T>(url, { params, headers }));
  }
}