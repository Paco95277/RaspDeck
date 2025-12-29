export type ActionDef =
  | { type: 'open_url'; url: string }
  | { type: 'shell'; cmd: string }
  | { type: 'insert'; text: string }
  | { type: 'ws'; topic: string; payload?: unknown }
  | { type: 'http'; path: string; method?: 'GET' | 'POST'; body?: unknown }
  | { type: 'nav'; route: string }
  | { type: 'none' };

export interface ButtonDef {
  id: string;
  title: string;
  icon?: string;
  action: ActionDef;
}

export interface LayoutDef {
  rows: number;
  cols: number;
  buttons: ButtonDef[];
}
