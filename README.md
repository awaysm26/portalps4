# PS4 Portal

Firmware-aware, offline-first static portal intended for GitHub Pages.

## Current build

This repository contains a firmware-aware portal and a local snapshot of the public PSX8 host assets. The firmware folders are intentionally preserved because their AppCache manifests reference exact relative paths.

## Production flow

PS4 Browser -> GitHub Pages -> firmware router -> firmware-specific host -> compatible GoldHEN -> payload catalog

## Important

The official GoldHEN release page currently lists v2.4b18 as the latest release found while this project was generated. GoldHEN's release notes list supported firmware separately; do not assume one binary applies to all firmware.

PSX8 is used as an architectural reference for firmware-specific routing and AppCache/offline operation.

## GitHub Pages

1. Create a GitHub repository.
2. Copy this project into the repository.
3. Commit and push.
4. Enable GitHub Pages from the repository's Pages settings using the desired branch/folder.
5. Open the generated HTTPS URL in the PS4 browser.

## Artwork

Copy the existing project image to:

assets/images/portal-image.png

The UI will automatically display it.

## Debug

Open:

?debug=1

## License

The portal shell is original. Third-party binaries, exploit code and assets retain their own licenses and attribution requirements.
