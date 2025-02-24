import { Theme } from "../types";

export const theme: Theme = {
  icon: "h-4 w-4",
  modal: {
    root: `bg-[var(--color-bg)] min-w-[40rem] border border-[var(--color-border)]`,
  },
  results: {
    root: "relative max-h-[324px] overflow-auto flex flex-col -mt-[1px]",
  },
  loading: {
    root: 'text-[var(--color-loading)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'

  },
  search: {
    root: "flex flex-start gap-2 items-center pl-3 border border-t-0 border-l-0 border-r-0 border-b-0.5 border-[rgba(53,55,59,1)] focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-0.5 focus:border-[rgba(53,55,59,1)] text-[var(--color-input-text)]",
    input: {
      root: "bg-[var(--color-bg)] text-[var(--color-input-text)] placeholder:text-[var(--color-input-placeholder-text)] block w-full pt-3 pb-2 pr-3 text-sm rounded-none focus:ring-0 outline-none focus:outline-0",
    },
  },
  command: {
    root: "text-[var(--color-command-text)] cursor-pointer w-full text-left py-2 px-6 font-semibold text-sm",
    active:
      "bg-[var(--color-command-active-bg)] text-[var(--color-command-active-text)]",
    wrapper: "flex gap-2 items-center"
  },
  error: {
    root: "text-[var(--color-error-text)] w-full text-left min-h-[36px] box-border py-2 px-12 font-medium text-sm",
  },
  footer: {
    root: "bg-[var(--color-footer-bg)] text-[var(--color-footer-text)] py-3 px-6 text-xs flex justify-end",
  },
};
