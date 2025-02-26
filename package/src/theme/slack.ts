import { Theme } from "../types";

export const theme: Theme = {
  icon: "rlp-h-4 rlp-w-4",
  modal: {
    root: "rlp-bg-[var(--rlp-color-bg)] rlp-min-w-[40rem] rlp-border rlp-border-[var(--rlp-color-border)]",
  },
  results: {
    root: "rlp-relative rlp-max-h-[324px] rlp-overflow-auto rlp-flex rlp-flex-col rlp-mt-[1px]",
  },
  loading: {
    root: "rlp-text-[var(--rlp-color-loading)] rlp-absolute rlp-top-1/2 rlp-left-1/2 rlp--translate-x-1/2 rlp--translate-y-1/2 rlp-z-20",
  },
  search: {
    root:
      "rlp-flex rlp-flex-start rlp-gap-2 rlp-items-center rlp-pl-3 rlp-border rlp-border-t-0 rlp-border-l-0 rlp-border-r-0 rlp-border-b-0.5 rlp-border-[rgba(53,55,59,1)] rlp-focus:border-t-0 rlp-focus:border-l-0 rlp-focus:border-r-0 rlp-focus:border-b-0.5 rlp-focus:border-[rgba(53,55,59,1)] rlp-text-[var(--rlp-color-input-text)]",
    input: {
      root:
        "rlp-bg-[var(--rlp-color-bg)] rlp-text-[var(--rlp-color-input-text)] rlp-placeholder:text-[var(--rlp-color-input-placeholder-text)] rlp-block rlp-w-full rlp-pt-3 rlp-pb-2 rlp-pr-3 rlp-text-sm rlp-rounded-none rlp-focus:ring-0 rlp-outline-none rlp-focus:outline-0",
    },
  },
  command: {
    root: "rlp-text-[var(--rlp-color-command-text)] rlp-cursor-pointer rlp-w-full rlp-text-left rlp-py-2 rlp-px-6 rlp-font-semibold rlp-text-sm",
    active: "rlp-bg-[var(--rlp-color-command-active-bg)] rlp-text-[var(--rlp-color-command-active-text)]",
    wrapper: "rlp-flex rlp-gap-2 rlp-items-center",
  },
  error: {
    root: "rlp-text-[var(--rlp-color-error-text)] rlp-w-full rlp-text-left rlp-min-h-[36px] rlp-box-border rlp-py-2 rlp-px-12 rlp-font-medium rlp-text-sm",
  },
  footer: {
    root: "rlp-bg-[var(--rlp-color-footer-bg)] rlp-text-[var(--rlp-color-footer-text)] rlp-py-3 rlp-px-6 rlp-text-xs rlp-flex rlp-justify-end",
  },
};
