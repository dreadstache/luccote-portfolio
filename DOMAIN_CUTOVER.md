# `www.luccote.com` Cutover Runbook

This repository is ready for the domain move, but the domain is not activated here yet.
As of August 13, 2026, `www.luccote.com` still points to Google Sites and the apex domain
still uses its previous host. Keeping those records in place preserves the current site
until the final handoff window.

## Intended destination

- Canonical public address: `https://www.luccote.com/`
- GitHub Pages fallback: `https://dreadstache.github.io/luccote-portfolio/`
- GitHub Pages source: `main` branch, repository root

## Safe handoff order

1. In GitHub account settings, verify `luccote.com` with the TXT record GitHub provides.
   Keep that TXT record after verification.
2. In this repository, rename `CNAME.example` to `CNAME`, then replace every canonical,
   `og:url`, and `og:image` GitHub Pages URL with the matching `https://www.luccote.com/`
   URL. Merge and let the Pages deployment finish.
3. In the DNS provider, change `www` from `ghs.googlehosted.com` to the CNAME target
   `dreadstache.github.io` (do not include `/luccote-portfolio`).
4. Point the apex domain to GitHub Pages using all four recommended A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
5. Wait for DNS propagation and GitHub's TLS certificate. Then enable **Enforce HTTPS**.
6. Verify all four addresses before disconnecting or deleting the old Google Site:
   - `https://www.luccote.com/`
   - `https://luccote.com/`
   - `https://dreadstache.github.io/luccote-portfolio/`
   - a deliberately missing URL, to confirm the custom `404.html`
7. Recheck the Games/3D, Music, résumé, LinkedIn, GitHub, and case-study links from the
   custom domain. Keep the old Google Site available for at least 48 hours as rollback.

## Rollback

If the custom domain fails before DNS has fully propagated, restore the previous `www`
CNAME and apex records at the DNS provider. The GitHub Pages fallback remains available.
Do not remove the repository, Pages configuration, or previous Google Site during the
handoff window.
