import { defineRouting } from "next-intl/routing";
import { Locale } from "./types";

const locales: Locale[] = ["en-US", "zh-TW"];

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "zh-TW",
});
