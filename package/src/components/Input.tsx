"use client";

import { useLaunchPadContext } from "../context";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Icon } from "./Icon";

export const SearchInput = () => {
  const { search, onSearchChange, setSearchInputRef, theme, searchPlaceholderText } =
    useLaunchPadContext();
  return (
    <div className={theme.search.root}>
      <div className="rlp-mt-[4px]">
        <Icon>
          <MagnifyingGlassIcon />
        </Icon>
      </div>
      <input
        ref={setSearchInputRef}
        value={search}
        onChange={onSearchChange}
        className={theme.search.input.root}
        placeholder={searchPlaceholderText}
        autoComplete="off"
        name="search"
      />
    </div>
  );
};
