import { DBSchema, IDBPDatabase, openDB } from "idb";
import { FaviconTable, TabGroupTable, TabTable } from "./schema";

interface DatabaseSchema extends DBSchema {
  favicon: {
    key: string;
    value: FaviconTable;
  };
  tabGroup: {
    key: string;
    value: TabGroupTable;
  };
  tab: {
    key: string;
    value: TabTable;
  };
}

export type Database = IDBPDatabase<DatabaseSchema>;

export function openDatabase(): Promise<Database> {
  return openDB<DatabaseSchema>("droptab", 1, {
    upgrade(database) {
      database.createObjectStore("favicon", { keyPath: "key" });
      database.createObjectStore("tabGroup", { keyPath: "key" });
      database.createObjectStore("tab", { keyPath: "key" });
    },
  });
}
