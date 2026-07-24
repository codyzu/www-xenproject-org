# Screenshot comparison

`npm run screenshots` captures the core redesigned page family at deterministic desktop, tablet, and mobile viewports.

## Default pages

- Homepage
- Embedded & Automotive
- Cloud & Infrastructure
- Safety-Critical Systems
- Become a Member
- Project Members

The default run stores a settled `cookieConsent=false` value before navigation so the membership banner does not obscure ordinary design comparisons. It also requests reduced motion, waits for fonts and images, disables animation and transition timing, returns to the top of the page, and writes stable route-based filenames.

Output is grouped by timestamp and viewport under `screenshots/<timestamp>/`.

## Optional captures

Capture the default set plus the internal design system, About, and Governance:

```sh
npm run screenshots -- --extended
```

Capture the membership page with the consent banner forced through its development-only test mode:

```sh
npm run screenshots -- --cookie-banner
```

Capture one local route or one complete URL:

```sh
npm run screenshots -- /about/become-a-member/
npm run screenshots -- https://beta.xenproject.org/about/project-members/
```

The development-only `?show-cookie-banner=1` query parameter is compiled out of production behavior. First-visit, accepted, rejected, persisted, and malformed storage states remain covered by focused browser tests.
