# Google API access for deutschtest-ueben.de

One-time setup, done in the browser in the Google account that owns the Search Console property.
This site has its own Cloud project and service account; nothing is shared with the Dutch sites.

1. **Project:** https://console.cloud.google.com/projectcreate → name `deutschtest-seo` → Create, then select it.
2. **API:** enable the Search Console API with the project selected:
   https://console.cloud.google.com/apis/library/searchconsole.googleapis.com → Enable.
   (Optional, for Core Web Vitals: Chrome UX Report API, same library.)
3. **Service account:** https://console.cloud.google.com/iam-admin/serviceaccounts → Create service account →
   name `claude-seo-reader` → Create and continue → skip the role → Done.
   Address: `claude-seo-reader@deutschtest-seo.iam.gserviceaccount.com`.
4. **Key:** open the account → Keys → Add key → Create new key → JSON. The file downloads once.
   Store it outside the repo, e.g. `~/.config/google/deutschtest-seo.json`. Never commit it.
5. **Search Console:** https://search.google.com/search-console → property `deutschtest-ueben.de`
   (add it as a Domain property and verify via DNS if it is not there yet) → Settings → Users and
   permissions → Add user → paste the service-account address → permission Full.
6. **GitHub secret:** repo → Settings → Secrets and variables → Actions → New repository secret →
   `GSC_SA_JSON` = the whole contents of the JSON file (not the path).
7. **Vercel:** project → Settings → Environment Variables → `GSC_SA_JSON`, same value, Production.
   Redeploy once; `/admin/seo` then reads Search Console live.
8. **Check:** GitHub → Actions → "SEO snapshot (Friday evening)" → Run workflow with backfill ticked.
   `seo-agent/data/<week>/gsc.json` on main must contain rows, not `skipped`.
