"use client";

import { useSearchModal } from "@/hooks/use-search-modal";
import { cn } from "@/lib/utils";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  CommandCategoriesList,
  ItemsLines,
  ItemsLinesHoverCard,
  Trending,
} from "@/components/command-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect } from "react";
import { categoriesCommand } from "@/lib/_data";

export function SearchCommandDialog() {
  const searchModal = useSearchModal();
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("trending");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchModal.onOpen();
      }

      if (searchModal.isOpen) {
        if (e.key === "Tab") {
          e.preventDefault();
          const currentIndex = categoriesCommand.findIndex(
            (item) => item.key === category
          );
          const nextIndex = (currentIndex + 1) % categoriesCommand.length;
          setCategory(categoriesCommand[nextIndex].key);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchModal, category]);

  return (
    <CommandDialog
      open={searchModal.isOpen}
      onOpenChange={searchModal.onClose}
      className={cn(
        "max-w-full h-full md:max-h-[calc(100vh-8px)] md:h-[720px] sm:max-w-[816px] !rounded-none md:!rounded-3xl md:top-[41.5%]",
        "data-[state=closed]:max-md:!slide-out-to-bottom-5 data-[state=open]:max-md:!slide-in-from-bottom-5",
        "data-[state=closed]:max-md:!zoom-out-100 data-[state=open]:max-md:!zoom-in-100",
        "search-command pt-3"
      )}
    >
      <CommandInput
        placeholder="Search on iOS..."
        autoFocus
        value={search}
        onValueChange={setSearch}
      />

      <section className="flex pl-3 pt-2 size-full overflow-hidden">
        {!search ? (
          <>
            <CommandCategoriesList
              category={category}
              setCategory={setCategory}
            />

            <ScrollArea className="w-full">
              <CommandList className="relative size-full !max-h-none pr-2 md:px-3 pb-10">
                <CommandItem className="absolute inset-0 z-0 !bg-transparent !text-transparent">
                  hidden item
                </CommandItem>

                {category === "trending" && <Trending />}

                {category === "screens" && (
                  <ItemsLinesHoverCard title="Screens -- Hover Card" />
                )}

                {category === "ui-elements" && (
                  <ItemsLinesHoverCard title="UI Elements -- Hover Card" />
                )}

                {category === "flows" && (
                  <ItemsLines title="Flows -- NOT Hover Card" />
                )}
              </CommandList>
            </ScrollArea>
          </>
        ) : (
          <>
            <span>search list</span>
            <CommandEmpty>No results found.</CommandEmpty>
          </>
        )}
      </section>
    </CommandDialog>
  );
}
