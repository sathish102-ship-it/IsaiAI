# IsaiAI Mobile v5

Mobile-first PWA for personal AI music generation.

## What changed from v4
- Generate Song no longer redirects to ACE Music.
- Direct MusicAPI Sonic integration.
- Custom lyrics mode with title, style tags, vocal gender and target duration.
- Async task polling with progress/status.
- MP3 player and open/download link.
- API key is stored only in this browser's local storage.
- No fake/demo audio.

## Free trial
MusicAPI currently advertises 75 free trial credits for new accounts with no card required. Sonic generation costs 20 credits per call, so the trial is enough for several test generations. Verify current terms before use.

## Important security note
This GitHub Pages version is for personal testing. The API key is entered on your phone and stored in browser local storage. Do not publish the key in GitHub files or share the key.

## If browser CORS blocks direct API calls
Use the included `backend/` Cloudflare Worker as a proxy. The worker keeps the API key server-side. Deploy it to a serverless provider and put the worker URL into the app in a future configuration update.
