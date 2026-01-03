import { defineProxyService } from "@webext-core/proxy-service";
import type { TabTable } from "../schema";
import type { Database } from "../database";

export interface TabService {
  getAll(): Promise<TabTable[]>;
  upsert(info: TabTable): Promise<void>;
}

function createTabService(_db: Promise<Database>): TabService {
  return {
    async getAll() {
      const db = await _db;
      return await db.getAll("tab");
    },
    async upsert(info) {
      const db = await _db;
      await db.put("tab", info);
    },
  };
}

export const [registerTabService, getTabService] = defineProxyService(
  "tab-service",
  createTabService,
);
