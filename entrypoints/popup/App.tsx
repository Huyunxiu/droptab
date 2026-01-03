import fractionalIndex from "fractional-index";
import { getFaviconService } from "@/lib/service/favicon.service";
import { getTabService } from "@/lib/service/tab.service";
import { getTabGroupService } from "@/lib/service/tabgroup.service";
import { Button } from "@/components/ui/button";
import { customAlphabet } from "nanoid";
import "./App.css";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10,
);

/**
 * Converts an image URL to a Base64 Data URL string.
 * @param {string} url The URL of the image to convert.
 * @returns {Promise<string>} A promise that resolves with the Base64 data URL.
 */
async function getBase64ImageFromUrl(url: string) {
  // 1. Fetch the image data from the URL
  const response = await fetch(url);

  // 2. Get the response body as a Blob
  const blob = await response.blob();

  // 3. Convert the Blob to a Base64 Data URL using FileReader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function App() {
  const handleDroptab = async () => {
    const [currentTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!currentTab) return;

    const url = new URL(currentTab.url || "");
    const hostname = url.hostname;
    console.log(111, currentTab);

    const faviconService = getFaviconService();
    const tabService = getTabService();
    const tabGroupService = getTabGroupService();

    const faviconKey = hostname;
    const tabGroupKey = `tabgroup:default`;
    const tabKey = nanoid();

    const tabGroups = await tabGroupService.getAll();
    const tabs = await tabService.getAll();

    const maxTabGroupIndex = tabGroups.reduce((max, tg) => {
      return tg.index > max ? tg.index : max;
    }, "a0");

    const maxTabIndex = tabs.reduce((max, t) => {
      return t.index > max ? t.index : max;
    }, "a0");

    const newTabGroupIndex = fractionalIndex(maxTabGroupIndex, null);
    const newTabIndex = fractionalIndex(maxTabIndex, null);

    // console.log(888, currentTab.favIconUrl);
    // if (currentTab.favIconUrl) {
    //   const base64 = await getBase64ImageFromUrl(currentTab.favIconUrl);
    //   console.log(999, base64);
    // }

    await faviconService.upsert({
      key: faviconKey,
      hostname,
      favicon: currentTab.favIconUrl || "",
    });

    await tabGroupService.upsert({
      key: tabGroupKey,
      name: "RECENT",
      index: newTabGroupIndex,
    });

    await tabService.upsert({
      key: tabKey,
      tabGroupKey,
      faviconKey: faviconKey,
      url: currentTab.url || "",
      name: currentTab.title || "",
      index: newTabIndex,
    });

    console.log(123);

    window.open(browser.runtime.getURL("/droptab.html"));
  };

  return (
    <>
      <div className="p-4">
        <Button onClick={handleDroptab}>Droptab</Button>
      </div>
    </>
  );
}

export default App;
