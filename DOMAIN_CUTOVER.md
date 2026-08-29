# `www.luccote.com` Domain Status

The custom-domain cutover is complete. GitHub Pages serves the main portfolio over HTTPS.

## Current destination

- Canonical public address: `https://www.luccote.com/`
- GitHub Pages source: `main` branch, repository root

Connected portfolio addresses:

- Games, Film & 3D: `https://games.luccote.com/`
- Earlier-work Archive: `https://games.luccote.com/archive.html`
- Résumé Library: `https://resume.luccote.com/`
- Music: `https://music.luccote.com/`

Keep the GitHub domain-verification TXT record, the `www` CNAME, the apex A records, and
the repository `CNAME` file in place. Recheck the connected subdomains after any DNS or
GitHub Pages configuration change.

## Rollback

If the custom domain fails, inspect DNS and the Pages certificate before changing source.
The underlying repository and GitHub Pages deployment remain the rollback foundation.
