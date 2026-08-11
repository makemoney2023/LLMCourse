# YouTube OAuth setup (Shorts publish)

Live publish (`npm run shorts:publish -- --live`) uses the YouTube Data API v3 resumable upload with a refresh token. Secrets stay in the environment — never commit them.

## Prerequisites

1. A Google Cloud project with **YouTube Data API v3** enabled.
2. An OAuth 2.0 **Desktop** (or installed) client.
3. A YouTube channel you can upload to (same Google account that completes the consent screen).

## Create OAuth credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Library → enable **YouTube Data API v3**.
2. APIs & Services → OAuth consent screen → configure (External is fine for a personal channel; add your Google account as a test user while the app is in Testing).
3. APIs & Services → Credentials → Create credentials → OAuth client ID → Application type **Desktop app**.
4. Download the client JSON (or copy **Client ID** and **Client secret**).

Required scope for upload:

```text
https://www.googleapis.com/auth/youtube.upload
```

(`youtube` or `youtube.force-ssl` also work if you prefer a broader scope.)

## Obtain a refresh token (one-time)

Use any OAuth installed-app flow that requests the upload scope with `access_type=offline` and `prompt=consent` so Google returns a `refresh_token`.

Example with Google’s OAuth Playground (quick path):

1. Open [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2. Gear icon → check **Use your own OAuth credentials** → paste Client ID / Client secret.
3. Select scope `https://www.googleapis.com/auth/youtube.upload` → Authorize APIs → sign in with the channel account.
4. Exchange authorization code for tokens → copy the **Refresh token**.

CLI alternative: `gcloud` auth or a tiny local script using `googleapis` / `google-auth-library` with the Desktop client — same scope and offline access.

## Environment variables (names only)

Set these in your shell or a local secrets file that is gitignored (for example `.env.local` — do not commit):

| Variable | Purpose |
|----------|---------|
| `YOUTUBE_CLIENT_ID` | OAuth client ID |
| `YOUTUBE_CLIENT_SECRET` | OAuth client secret |
| `YOUTUBE_REFRESH_TOKEN` | Long-lived refresh token from the one-time consent |

## Publish commands

Dry-run (default — no YouTube API calls; safe for CI):

```bash
npm run shorts:publish -- --batch content-studio/out/batch-YYYY-MM-DD --start-date 2026-08-12
```

Live upload + schedule (requires the three env vars above):

```bash
export YOUTUBE_CLIENT_ID=...
export YOUTUBE_CLIENT_SECRET=...
export YOUTUBE_REFRESH_TOKEN=...
npm run shorts:publish -- --batch content-studio/out/batch-YYYY-MM-DD --start-date 2026-08-12 --live
```

Behavior:

- Only ids with `approve: true` in `approval.yaml` are uploaded.
- Titles are clamped to 100 characters (YouTube limit).
- Preflight requires every approved `renders/<id>.mp4` before any upload.
- Each approved Short’s mp4 (vertical 1080×1920) is uploaded via resumable `videos.insert`.
- Metadata sets `status.privacyStatus=private` and `status.publishAt` (daily 09:00 America/New_York from `--start-date`). YouTube publishes at that time.
- Writes `publish-plan.json` always; live appends `publish-result.json` after each success and skips ids that already have a `videoId` on re-run.

## Notes

- Unverified API projects may keep uploads private until the project passes YouTube’s API audit — see Google’s videos.insert notice.
- Refresh tokens can be revoked if you reset the OAuth client or remove app access; generate a new one if refresh fails.
- Never put client secrets or refresh tokens in git, CI logs, or docs.
