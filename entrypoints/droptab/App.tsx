import { useState, useRef, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Input } from "@/components/ui/input";
import { TabGroup } from "@/components/TabGroup";
import { getTabGroupService } from "@/lib/service/tabgroup.service";
import { getTabService } from "@/lib/service/tab.service";
import { getFaviconService } from "@/lib/service/favicon.service";
import type { TabGroupTable } from "@/lib/schema";
import type { TabTable } from "@/lib/schema";
import type { FaviconTable } from "@/lib/schema";
import "./App.css";

function App() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [tabGroups, setTabGroups] = useState<TabGroupTable[]>([]);
  const [tabs, setTabs] = useState<TabTable[]>([]);
  const [favicons, setFavicons] = useState<FaviconTable[]>([]);

  // 添加热键监听
  useHotkeys(
    "Slash",
    (e) => {
      e.preventDefault();
      searchRef.current?.focus();
    },
    [],
  );

  useEffect(() => {
    console.log("start droptab page.");
    pinCurrentTab();
    fetchData();
  }, [searchRef]);

  const fetchData = async () => {
    const tabGroupService = getTabGroupService();
    const tabService = getTabService();
    const faviconService = getFaviconService();

    const [tabGroupsData, tabsData, faviconsData] = await Promise.all([
      tabGroupService.getAll(),
      tabService.getAll(),
      faviconService.getAll(),
    ]);

    setTabGroups(tabGroupsData);
    setTabs(tabsData);
    setFavicons(faviconsData);
  };

  const pinCurrentTab = async () => {
    const currentTab = await browser.tabs.getCurrent();
    if (currentTab) {
      browser.tabs.update(currentTab.id, { pinned: true });
    }
  };

  console.log(123, favicons, tabs, tabGroups);

  return (
    <>
      <header className="w-full mx-auto px-6 py-8 grid gap-x-12 items-center max-w-6xl">
        <div></div>
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute w-10 h-full p-0 left-0 top-0 flex items-center justify-center text-xs text-muted-foreground">
              /
            </div>
            <Input ref={searchRef} className="h-10 pl-10 w-[512px]" />
          </div>
        </div>
        <div></div>
      </header>
      <main className="px-6 mt-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-x-4 sm:gap-x-8">
            <div className="swimlane">
              {tabGroups.map((tabGroup) => {
                const groupTabs = tabs
                  .filter((tab) => tab.tabGroupKey === tabGroup.key)
                  .map((tab) => ({
                    key: tab.key,
                    favicon:
                      favicons.find((f) => f.key === tab.faviconKey)?.favicon ||
                      "",
                    url: tab.url,
                    name: tab.name,
                    index: tab.index,
                  }));

                return (
                  <div key={tabGroup.key}>
                    <TabGroup
                      key={tabGroup.key}
                      name={tabGroup.name}
                      index={tabGroup.index}
                      tabs={groupTabs}
                    />
                  </div>
                );
              })}
            </div>
            <div className="swimlane"></div>
            <div className="swimlane"></div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
