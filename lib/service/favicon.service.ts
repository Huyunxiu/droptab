import { defineProxyService } from "@webext-core/proxy-service";
import type { FaviconTable } from "../schema";
import type { Database } from "../database";

export interface FaviconService {
  getAll(): Promise<FaviconTable[]>;
  upsert(info: FaviconTable): Promise<void>;
}

function createFaviconService(_db: Promise<Database>): FaviconService {
  return {
    async getAll() {
      // Can't await promises inside the background's main function, so instead
      // we await the promise inside the service:
      const db = await _db;
      return await db.getAll("favicon");
    },
    async upsert(info) {
      const db = await _db;
      await db.put("favicon", info);
    },
  };
}

export const [registerFaviconService, getFaviconService] = defineProxyService(
  "favicon-service",
  createFaviconService,
);
