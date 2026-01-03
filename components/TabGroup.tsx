import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown } from "lucide-react";

export type Tab = {
  key: string;
  favicon: string;
  url: string;
  name: string;
  index: string;
};

interface TabGroupProps {
  key: string;
  name: string;
  index: string;
  tabs?: Tab[];
}

export function TabGroup({ name, index, tabs }: TabGroupProps) {
  const [open, setOpen] = useState<boolean>(true);

  const onTabClick = (tab: Tab) => {
    window.open(tab.url, "_blank");
  };

  return (
    <Collapsible
      defaultOpen
      open={open}
      onOpenChange={(value) => setOpen(value)}
      className="mb-4"
    >
      <CollapsibleTrigger className="w-full h-8 text-xs text-left border-b solid flex items-center justify-between">
        <div className="flex items-center text-ellipsis text-xs font-semibold">
          {open ? (
            <ChevronDown className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1" />
          )}
          {name}
        </div>
        <div></div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {tabs?.map((tab) => (
          <div
            key={tab.name}
            className="h-8 flex items-center justify-between px-1"
          >
            <div
              className="h-8 flex justify-start items-center cursor-pointer"
              onClick={() => onTabClick(tab)}
            >
              {tab.favicon && (
                <img src={tab.favicon} alt="" className="mr-2 w-4 h-4" />
              )}
              <div className="flex items-center justify-start h-8 text-xs overflow-hidden whitespace-nowrap">
                {tab.name}
              </div>
            </div>
            <div></div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
