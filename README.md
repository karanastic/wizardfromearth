# wizardfromearth

Official one-page music archive for **wizardfromearth**.

## Concept

The site is designed as an **orbital transmission archive**: part listening room,
part spacecraft instrument, and part independent artist document. Music is the
primary experience, while the biography, photography, and contact form appear as
connected coordinates inside the same interface.

The visual system uses black, warm bone, and phosphor green; thin orbital lines;
technical labels; oversized geometric type; and non-destructive monochrome photo
treatments. Raw photos can be replaced by final edited WebP files later without
changing the layout.

## Local workflow

1. Add WAV masters to `music/`.
2. Run `./prepare-media.sh` to create matching MP3 streaming files.
3. Run `python3 build.py` whenever tracks are added or renamed.

To change which releases appear under the **New** filter, edit
`NEW_TRACK_SLUGS` near the top of `build.py`, then run the build again. Remove
older slugs and add the slugs for the current release group; the filter count
and track badges update automatically.
4. Preview the folder with any local static web server.

The builder discovers every WAV file automatically. Each track receives a play
control plus MP3 and WAV downloads; no individual artwork is required.

Recordings placed in `music/featuring-karanastic/` appear in a dedicated
cross-signal collection below the solo archive and link listeners to
`karanastic.com`.

Web-ready merchandise images belong in `merch/`. Editable source artwork and
full-resolution originals belong in `original-dontaddtogithub/`, which stays
local and is excluded from Git.

## Production workflow

- GitHub stores the site code, text, logo, and web-sized photography.
- `deploy.sh` publishes the site shell to S3 and invalidates CloudFront.
- `deploy-media.sh` publishes WAV and MP3 files separately so the large audio
  archive stays out of Git.

The deployment defaults assume `wizardfromearth.com`. Set `S3_BUCKET` and
`CLOUDFRONT_DISTRIBUTION_ID` in GitHub Actions before the first production deploy.
The deployment scripts accept either the plain AWS resource names/IDs or their
full ARNs.
