import { Injectable } from '@angular/core';

export interface RuntimeConfig {
  apiBaseUrl: string; // e.g. "/api" or "http://pi:8000/api"
  wsUrl: string;      // e.g. "/ws"  or "ws://pi:8000/ws"
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _config: RuntimeConfig | null = null;

  /** Default values if runtime-config.json is missing */
  private readonly defaults: RuntimeConfig = {
    apiBaseUrl: '/api',
    wsUrl: '/ws',
  };

  get config(): RuntimeConfig {
    return this._config ?? this.defaults;
  }

  /** Call once at app startup */
  async load(): Promise<void> {
    try {
      const res = await fetch('assets/runtime-config.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = (await res.json()) as Partial<RuntimeConfig>;

      this._config = {
        apiBaseUrl: (json.apiBaseUrl ?? this.defaults.apiBaseUrl).replace(/\/+$/, ''),
        wsUrl: (json.wsUrl ?? this.defaults.wsUrl).replace(/\/+$/, ''),
      };

      console.log('[Config] loaded:', this._config);
    } catch (err) {
      // Fallback to defaults (important for first run / missing file)
      this._config = this.defaults;
      console.warn('[Config] failed to load runtime-config.json, using defaults.', err);
    }
  }
}