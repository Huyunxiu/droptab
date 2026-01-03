import { defineProxyService } from "@webext-core/proxy-service";
import type { TabGroupTable } from "../schema";
import type { Database } from "../database";

export interface TabGroupService {
  getAll(): Promise<TabGroupTable[]>;
  upsert(info: TabGroupTable): Promise<void>;
}

function createTabGroupService(_db: Promise<Database>): TabGroupService {
  return {
    async getAll() {
      const db = await _db;
      return await db.getAll("tabGroup");
    },
    async upsert(info) {
      const db = await _db;
      await db.put("tabGroup", info);
    },
  };
}

export const [registerTabGroupService, getTabGroupService] = defineProxyService(
  "tabgroup-service",
  createTabGroupService,
);
