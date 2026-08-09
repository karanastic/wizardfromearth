#!/usr/bin/env python3
"""Build the wizardfromearth one-page music archive from local WAV files."""

import datetime
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
MUSIC_DIR = ROOT / "music"
TRACKS_FILE = ROOT / "tracks.json"
SITE_URL = "https://wizardfromearth.com"

TITLE_OVERRIDES = {
    "it-helps_Masterchannel": "It Helps",
    "loving-you-is-never-enough": "Loving You (Is Never Enough)",
    "oh_starling": "Oh, Starling",
    "sams-song": "Sam's Song",
}


def title_from_stem(stem):
    if stem in TITLE_OVERRIDES:
        return TITLE_OVERRIDES[stem]
    cleaned = re.sub(r"[-_]+", " ", stem).strip()
    return cleaned.title()


def slug_from_stem(stem):
    slug = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    return slug or "track"


def esc(value):
    return html.escape(str(value or ""), quote=True)


def load_tracks():
    tracks = []
    for number, wav_path in enumerate(sorted(MUSIC_DIR.glob("*.wav")), 1):
        stem = wav_path.stem
        tracks.append(
            {
                "number": f"{number:02d}",
                "title": title_from_stem(stem),
                "slug": slug_from_stem(stem),
                "stream": f"music/{stem}.mp3",
                "mp3": f"music/{stem}.mp3",
                "wav": f"music/{wav_path.name}",
                "collection": "solo",
            }
        )
    featured_dir = MUSIC_DIR / "featuring-karanastic"
    for number, wav_path in enumerate(sorted(featured_dir.glob("*.wav")), 1):
        stem = wav_path.stem
        tracks.append(
            {
                "number": f"K{number:02d}",
                "title": title_from_stem(stem),
                "slug": f"karanastic-{slug_from_stem(stem)}",
                "stream": f"music/featuring-karanastic/{stem}.mp3",
                "mp3": f"music/featuring-karanastic/{stem}.mp3",
                "wav": f"music/featuring-karanastic/{wav_path.name}",
                "collection": "karanastic",
            }
        )
    if tracks:
        TRACKS_FILE.write_text(
            json.dumps(tracks, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        return tracks
    if TRACKS_FILE.exists():
        return json.loads(TRACKS_FILE.read_text(encoding="utf-8"))
    return tracks


def render_track(track, index):
    bars = "".join('<span aria-hidden="true"></span>' for _ in range(7))
    return f'''<article class="track" id="track-{esc(track['slug'])}" data-index="{index}" data-search="{esc(track['title'].lower())}">
      <button class="track__play" type="button" data-play="{index}" aria-label="Play {esc(track['title'])}">
        <span class="track__play-idle" aria-hidden="true">▶</span>
        <span class="track__play-live" aria-hidden="true">Ⅱ</span>
      </button>
      <div class="track__number"><span>TX</span>{esc(track['number'])}</div>
      <div class="track__signal">{bars}</div>
      <h3>{esc(track['title'])}</h3>
      <div class="track__actions">
        <button type="button" data-play="{index}">Stream</button>
        <a href="{esc(track['wav'])}" download>WAV</a>
        <a href="{esc(track['mp3'])}" download>MP3</a>
      </div>
    </article>'''


def structured_data(tracks):
    recordings = []
    for track in tracks:
        recording = {
                "@type": "MusicRecording",
                "name": track["title"],
                "url": f"{SITE_URL}/#track-{track['slug']}",
                "byArtist": {"@id": f"{SITE_URL}/#artist"},
                "audio": {
                    "@type": "AudioObject",
                    "contentUrl": f"{SITE_URL}/{track['stream']}",
                    "encodingFormat": "audio/mpeg",
                },
            }
        if track.get("collection") == "karanastic":
            recording["byArtist"] = [
                {"@id": f"{SITE_URL}/#artist"},
                {"@type": "Person", "name": "Karanastic", "url": "https://karanastic.com/"},
            ]
        recordings.append(recording)
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "MusicGroup",
                "@id": f"{SITE_URL}/#artist",
                "name": "wizardfromearth",
                "url": SITE_URL,
                "logo": f"{SITE_URL}/logo/wizardfromearth-logo-blk.webp",
                "genre": ["Experimental", "Indie", "Ambient", "Rap", "Rock"],
                "foundingLocation": {"@type": "Place", "name": "Providence"},
                "location": {"@type": "Place", "name": "Palm Bay, Florida"},
                "subjectOf": recordings,
            },
            {
                "@type": "WebSite",
                "url": SITE_URL,
                "name": "wizardfromearth — Official Site",
                "inLanguage": "en-US",
            },
        ],
    }


def main():
    tracks = load_tracks()
    if not tracks:
        raise SystemExit("No WAV files found in music/.")

    template = (ROOT / "template.html").read_text(encoding="utf-8")
    solo_tracks = [(i, track) for i, track in enumerate(tracks) if track.get("collection", "solo") == "solo"]
    featured_tracks = [(i, track) for i, track in enumerate(tracks) if track.get("collection") == "karanastic"]
    output = template.replace("<!--__TRACKS__-->", "\n".join(render_track(track, i) for i, track in solo_tracks))
    output = output.replace("<!--__FEATURED_TRACKS__-->", "\n".join(render_track(track, i) for i, track in featured_tracks))
    output = output.replace("/*__TRACK_DATA__*/[]", json.dumps(tracks, ensure_ascii=False))
    output = output.replace("/*__STRUCTURED_DATA__*/{}", json.dumps(structured_data(tracks), ensure_ascii=False, indent=2))
    output = output.replace("__TRACK_COUNT__", str(len(tracks)))
    output = output.replace("__SOLO_COUNT__", str(len(solo_tracks)))
    output = output.replace("__FEATURE_COUNT__", str(len(featured_tracks)))
    output = output.replace("__YEAR__", str(datetime.date.today().year))
    output = "\n".join(line.rstrip() for line in output.splitlines()) + "\n"
    (ROOT / "index.html").write_text(output, encoding="utf-8")

    today = datetime.date.today().isoformat()
    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{SITE_URL}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
'''
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    print(f"Built index.html from {len(solo_tracks)} solo and {len(featured_tracks)} Karanastic transmissions.")


if __name__ == "__main__":
    main()
