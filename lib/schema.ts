export interface FaviconTable {
  key: string;
  hostname: string;
  favicon: string;
}

export interface TabGroupTable {
  key: string;
  name: string;
  index: string;
}

export interface TabTable {
  key: string;
  tabGroupKey: string;
  faviconKey: string;
  url: string;
  name: string;
  index: string;
}
