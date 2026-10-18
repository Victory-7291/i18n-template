# i18n-template

## 2.0.0

### Major Changes

- Harden the template: derive `SupportedLocale` as a real literal union from static dictionary imports (removes the Vite-only `import.meta.glob` loader, enabling webpack/Next.js), require React 19 as a peer dependency, tighten the `data:` URL and event-handler security checks against natural-language false positives, skip import-time validation in production bundles, drop the unused `react-dom` peer, and remove the no-op `build` script.

## 1.0.0

### Major Changes

- Initial release of the production-ready internationalization (i18n) starter template.
  - Type-safe i18n setup built on `i18next` and `react-i18next`.
  - 40 bundled production locale dictionaries with recursive structural parity validation.
  - Security gates for interpolation placeholder verification and malicious XSS payload filtering (`<script>`, event handlers, `javascript:`, `data:` URLs, unauthorized links).
  - Native RTL direction detection (`ar`, `fa`, `he`, `ur`) and document attribute synchronization.
  - Browser-native `Intl` formatting helpers for dates, numbers, and currencies.
  - Automated quality validation suite and CI/CD workflows for GitHub releases.
