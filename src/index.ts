import i18n, { type InitOptions, type TOptions } from "i18next";
import { initReactI18next, useTranslation as useReactI18nextTranslation } from "react-i18next";

import {
  DEFAULT_LOCALE,
  i18nextResources,
  supportedLocales,
  type SupportedLocale,
  isRtlLocale,
  getLocaleDirection,
  syncDocumentDirection,
} from "./locales";

const i18nextOptions: InitOptions = {
  resources: i18nextResources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: supportedLocales,
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnObjects: false,
  initAsync: false,
};

void i18n.use(initReactI18next).init(i18nextOptions).catch((error: unknown) => {
  console.error("Failed to initialize i18next", error);
});

/**
 * Translate a key with optional interpolation options.
 */
export function t(key: string, options: TOptions = {}): string {
  return i18n.t(key, options);
}

/**
 * Switch active language and automatically synchronize document direction (dir="rtl" or "ltr").
 */
export async function changeLanguage(locale: SupportedLocale): Promise<void> {
  await i18n.changeLanguage(locale);
  syncDocumentDirection(locale);
}

/**
 * Get the currently resolved active locale.
 */
export function getCurrentLanguage(): SupportedLocale {
  return (i18n.resolvedLanguage || i18n.language || DEFAULT_LOCALE) as SupportedLocale;
}

/**
 * Format date using browser-native Intl.DateTimeFormat.
 */
export function formatDate(
  date: Date | number | string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date);
  const targetLocale = locale || getCurrentLanguage();
  return new Intl.DateTimeFormat(targetLocale, options).format(d);
}

/**
 * Format number using browser-native Intl.NumberFormat.
 */
export function formatNumber(
  value: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  const targetLocale = locale || getCurrentLanguage();
  return new Intl.NumberFormat(targetLocale, options).format(value);
}

/**
 * Format currency using browser-native Intl.NumberFormat.
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale?: string
): string {
  const targetLocale = locale || getCurrentLanguage();
  return new Intl.NumberFormat(targetLocale, {
    style: "currency",
    currency,
  }).format(amount);
}

export const useTranslation = useReactI18nextTranslation;
export {
  i18n,
  DEFAULT_LOCALE,
  supportedLocales,
  type SupportedLocale,
  isRtlLocale,
  getLocaleDirection,
  syncDocumentDirection,
};
