import type { Resource } from "i18next";

import { assertValidLocaleMessages } from "./locale-validation";

import ar from "./locales/ar.json";
import bn from "./locales/bn.json";
import cs from "./locales/cs.json";
import da from "./locales/da.json";
import de from "./locales/de.json";
import el from "./locales/el.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fa from "./locales/fa.json";
import fi from "./locales/fi.json";
import fil from "./locales/fil.json";
import fr from "./locales/fr.json";
import he from "./locales/he.json";
import hi from "./locales/hi.json";
import hu from "./locales/hu.json";
import id from "./locales/id.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import mr from "./locales/mr.json";
import ms from "./locales/ms.json";
import nb from "./locales/nb.json";
import nl from "./locales/nl.json";
import pa from "./locales/pa.json";
import pl from "./locales/pl.json";
import ptBR from "./locales/pt-BR.json";
import ptPT from "./locales/pt-PT.json";
import ro from "./locales/ro.json";
import ru from "./locales/ru.json";
import sv from "./locales/sv.json";
import sw from "./locales/sw.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import th from "./locales/th.json";
import tr from "./locales/tr.json";
import uk from "./locales/uk.json";
import ur from "./locales/ur.json";
import vi from "./locales/vi.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

// Explicit static imports (rather than a glob) keep this table portable across
// bundlers and let TypeScript derive SupportedLocale as a literal union, so an
// unknown locale code is a compile-time error.
export const localeMessages = {
  ar,
  bn,
  cs,
  da,
  de,
  el,
  en,
  es,
  fa,
  fi,
  fil,
  fr,
  he,
  hi,
  hu,
  id,
  it,
  ja,
  ko,
  mr,
  ms,
  nb,
  nl,
  pa,
  pl,
  "pt-BR": ptBR,
  "pt-PT": ptPT,
  ro,
  ru,
  sv,
  sw,
  ta,
  te,
  th,
  tr,
  uk,
  ur,
  vi,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export type SupportedLocale = keyof typeof localeMessages;

// `satisfies` keeps the literal "en" type while guaranteeing at compile time
// that the default locale is present in the table above.
export const DEFAULT_LOCALE = "en" satisfies SupportedLocale;

// The validation gates are enforced by the test suite and CI. Re-running them
// on every import would add startup cost to production bundles and turn any
// dictionary defect into an import-time crash, so they only run outside
// production (tests, local dev, dev SSR).
const isProduction =
  typeof process !== "undefined" && process.env?.NODE_ENV === "production";

if (!isProduction) {
  for (const [locale, messages] of Object.entries(localeMessages)) {
    try {
      assertValidLocaleMessages(messages);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid ${locale} locale messages: ${message}`);
    }
  }
}

export const supportedLocales = Object.keys(localeMessages) as SupportedLocale[];

export const i18nextResources: Resource = Object.fromEntries(
  Object.entries(localeMessages).map(([locale, messages]) => [locale, { translation: messages }]),
) as Resource;

export const RTL_LOCALES = new Set(["ar", "fa", "he", "ur"]);

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.has(locale.toLowerCase().split("-")[0]);
}

export function getLocaleDirection(locale: string): "rtl" | "ltr" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}

export function syncDocumentDirection(locale: string): void {
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dir = getLocaleDirection(locale);
    document.documentElement.lang = locale;
  }
}
