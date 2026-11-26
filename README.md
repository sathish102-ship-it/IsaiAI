# IsaiAI Mobile v4

Phone-only PWA for IsaiKuviyal.

## Current behavior

1. Enter Tamil/other-language lyrics.
2. Choose vocal, BPM, duration and style.
3. Tap Generate Song.
4. If a real cloud generation endpoint is configured, IsaiAI calls it and plays the returned MP3.
5. If no endpoint is configured, IsaiAI copies the complete prompt and opens hosted ACE-Step in the phone browser.
6. Generated audio URLs are saved in My Songs.

## No laptop required

The app itself is static and mobile-first. It does not require a local GPU, Python installation or local server.

## Important limitation

There is currently no verified free public ACE Music API endpoint that we can safely embed. ACE Music's official help currently says new API-key sign-ups are paused. ACE-Step 1.5 has an official REST API, but it is for an ACE-Step service you run. So v4 deliberately keeps the cloud provider swappable.

## Deployment

Host the static files on a static host and open the URL on Android. PWA installation is supported by compatible browsers.
