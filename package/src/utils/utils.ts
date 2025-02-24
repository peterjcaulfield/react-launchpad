import { Command, CommandType, SearchCommand } from "../types";

export const isSearchCommand = (command: Command): command is SearchCommand =>
  (command as SearchCommand)?.type === CommandType.Search;
