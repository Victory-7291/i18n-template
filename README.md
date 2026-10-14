# i18n-template

A type-safe internationalization (i18n) starter template for React, Vite, Next.js, and monorepos. Built on top of `i18next` and `react-i18next`, this template provides 40 locale dictionaries, automated structural parity checks, placeholder consistency checks, payload sanitization, automatic RTL layout direction switching, and browser-native number and date formatters.

## Architecture and validation gates

Frontend localization often degrades as applications grow. Common issues include missing keys in secondary languages, altered interpolation variables that crash components, and accidental script tags or phishing links inside translation files.

This template uses three validation mechanisms in `src/locale-validation.ts` to prevent these issues:

1. Structural parity
   `en.json` serves as the baseline reference. The test suite recursively compares all 40 locale files against English. If any locale has missing keys or defines keys absent from `en.json`, the validation fails and reports the exact key path.

2. Interpolation and payload validation
   - Placeholder consistency: Every `{{variable}}` token must match the name and count defined in `en.json`. If a translator drops or renames a variable, the test fails.
   - Payload filtering: Translation values are scanned for unsafe content. The validator blocks `<script>` tags, inline event handler attributes like `onclick` or `onmouseover`, `javascript:` protocols, `data:` URLs, and unexpected external URLs not present in the English source.
   - Length limits: Localized strings have a length ceiling proportional to the English source text, preventing excessive text expansion from breaking interface layouts.

3. Bidirectional text and RTL layout
   The template recognizes right-to-left languages including Arabic (`ar`), Persian (`fa`), Hebrew (`he`), and Urdu (`ur`). When you switch to an RTL locale, `changeLanguage` updates `document.documentElement.dir` to `rtl` and sets the `lang` attribute. Pair this with CSS logical properties so interfaces mirror without extra CSS overrides.

## Project structure

```text
.
├── .changeset/                    # Changeset configuration for versioning
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated quality gate and test workflow
│       └── release.yml            # Automated release and tagging workflow
├── package.json                   # Package configuration and dependency definitions
├── tsconfig.json                  # Strict TypeScript configuration with @/* path aliases
├── vitest.config.ts               # Vitest runner configuration
├── README.md                      # Documentation and usage guide
├── CHANGELOG.md                   # Version history
└── src/
    ├── index.ts                   # Public API exports (t, useTranslation, changeLanguage, formatters)
    ├── locales.ts                 # Dynamic locale loader, RTL mappings, and DOM direction synchronization
    ├── locale-validation.ts       # Structural parity, placeholder, and payload security validators
    ├── locale-validation.test.ts  # Vitest test suite covering all 40 locale dictionaries
    ├── vite-env.d.ts              # Type declarations for import.meta.glob
    └── locales/                   # 40 locale dictionary files
        ├── en.json                # English reference dictionary
        ├── zh-CN.json             # Simplified Chinese
        ├── zh-TW.json             # Traditional Chinese
        ├── ja.json                # Japanese
        ├── ko.json                # Korean
        ├── ar.json                # Arabic (RTL)
        ├── he.json                # Hebrew (RTL)
        └── ...                    # 33 additional locale files
```

## Available commands

Run the test suite against all 40 locale files:

```bash
bun run test
```

Run TypeScript compiler type checks:

```bash
bun run typecheck
```

Run both test and typecheck gates:

```bash
bun run check
```

Run the build step:

```bash
bun run build
```

## Quick start

### React integration

Use the `useTranslation` hook inside React components, or use the top-level `t()` function in non-React utilities:

```tsx
import { useTranslation, changeLanguage } from "i18n-template";

export function OrganizationBanner() {
  const { t } = useTranslation();

  return (
    <section className="p-4 rounded-lg bg-card text-card-foreground">
      <h2 className="text-lg font-semibold">{t("app.noCompanies.title")}</h2>
      <p className="text-sm text-muted-foreground">{t("app.noCompanies.description")}</p>
      <button
        type="button"
        className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        {t("app.noCompanies.newCompany")}
      </button>
    </section>
  );
}
```

### Language switching and RTL support

Calling `changeLanguage` updates the active dictionary in memory and sets `document.documentElement.dir` to `rtl` or `ltr` along with the matching `lang` attribute:

```tsx
import { changeLanguage, supportedLocales, type SupportedLocale } from "i18n-template";

export function LanguageSelector() {
  return (
    <select
      onChange={(e) => void changeLanguage(e.target.value as SupportedLocale)}
      className="border rounded p-1"
      defaultValue="en"
    >
      <option value="en">English</option>
      <option value="zh-CN">简体中文</option>
      <option value="ar">العربية (RTL)</option>
      <option value="ja">日本語</option>
    </select>
  );
}
```

To support bidirectional layouts, use CSS logical properties instead of physical left and right values:

```tsx
/* Recommended: CSS logical properties mirror automatically under RTL */
<div className="ps-4 pe-2 ms-auto">
  <span className="me-2 inline-block">•</span>
  <span>Content</span>
</div>

/* Avoid: physical direction properties do not mirror in RTL locales */
/* <div className="pl-4 pr-2 ml-auto mr-2"> */
```

### Number, currency, and date formatting

The template wraps browser-native `Intl` APIs into utility functions that read the current active locale by default:

```tsx
import { formatDate, formatNumber, formatCurrency } from "i18n-template";

// Format date according to local conventions (e.g. 10/15/2026 or 15/10/2026)
const dateText = formatDate(new Date(), undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

// Format numbers with local group separators (e.g. 123,456.78)
const numberText = formatNumber(123456.78);

// Format currency with standard symbol placement and precision
const priceText = formatCurrency(99.9, "USD");
```

## Adding and updating translation keys

1. Add the new key to `src/locales/en.json`:

   ```json
   {
     "app": {
       "dashboard": {
         "welcome": "Welcome back, {{name}}!",
         "quickActions": "Quick Actions"
       }
     }
   }
   ```

2. Add corresponding keys to other locale files (such as `src/locales/zh-CN.json`):

   ```json
   {
     "app": {
       "dashboard": {
         "welcome": "欢迎回来，{{name}}！",
         "quickActions": "快捷操作"
       }
     }
   }
   ```

3. Run the validation gate:

   ```bash
   bun run test
   ```

   If any locale omits a key, alters the `{{name}}` variable token, or includes disallowed HTML tags, Vitest reports the exact file and key path.
