import { FuzzyResult } from "@nozbe/microfuzz";
import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import { useEffect, useState } from "react";
import { Command, CommandType, LaunchPadProps } from "../../types";

const mapResultItem = (result: FuzzyResult<Command>) => result.item;
const getText = (result: Command) => [result.text];

export const useResults = ({
  commands,
  initialCommands,
  onChange,
  onSearchSelect,
  search,
}: Pick<LaunchPadProps, "commands" | "initialCommands" | "onChange" | "onSearchSelect"> & { search: string }) => {


  const [innerCommands, setInnerCommands] = useState<Command[]>([]);
  const filteredCommands = useFuzzySearchList({
    list: onChange ? [] : commands,
    queryText: onChange ? "" : search,
    getText,
    mapResultItem,
  });
  // When onChange is provided, items are filtered externally
  const baseCommands = onChange ? commands : filteredCommands;


  useEffect(() => {
    if (!search && initialCommands.length) {
      console.log('setting inner commands')
      setInnerCommands(initialCommands);
      return;
    }

    // If there is no filtered result that matches the current search text, add a search entry
    // if we have an onSearchSelect prop defined
    const formattedSearch = search.toLowerCase();
    if (
      onSearchSelect && search &&
      !baseCommands.find((result) => result.text.toLowerCase() === formattedSearch)
    ) {
      const searchEntry: Command = {
        text: search,
        type: CommandType.Search,
      };
      setInnerCommands([searchEntry, ...baseCommands]);
    } else {
      setInnerCommands(baseCommands);
    }
  }, [initialCommands, search, onSearchSelect, baseCommands]);

  return innerCommands;
};
