# i18n-template

## 1.0.0

### Major Changes

- Initial release of the production-ready internationalization (i18n) starter template.
  - Type-safe i18n setup built on `i18next` and `react-i18next`.
  - 40 bundled production locale dictionaries with recursive structural parity validation.
  - Security gates for interpolation placeholder verification and malicious XSS payload filtering (`<script>`, event handlers, `javascript:`, `data:` URLs, unauthorized links).
  - Native RTL direction detection (`ar`, `fa`, `he`, `ur`) and document attribute synchronization.
  - Browser-native `Intl` formatting helpers for dates, numbers, and currencies.
  - Automated quality validation suite and CI/CD workflows for GitHub releases.
