import { registerFaviconService } from "@/lib/service/favicon.service";
import { registerTabService } from "@/lib/service/tab.service";
import { registerTabGroupService } from "@/lib/service/tabgroup.service";
import { openDatabase } from "@/lib/database";

export default defineBackground(() => {
  const db = openDatabase();

  registerFaviconService(db);
  registerTabService(db);
  registerTabGroupService(db);

  console.log('Hello background!', { id: browser.runtime.id });
});
