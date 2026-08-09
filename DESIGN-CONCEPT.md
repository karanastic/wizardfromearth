# Orbital Transmission Archive

## Core idea

The wizardfromearth site behaves like a receiver intercepting music from an
unmapped coordinate. It is not a streaming-service clone, fantasy wizard site,
or conventional artist portfolio. The interface combines the precision of a
spacecraft instrument with the independence and humanity of a personal music
archive.

The tension is intentional: ordinary Palm Bay photography sits inside rigid
orbital geometry, while an unusually broad catalog is presented as a sequence
of transmissions rather than releases competing for attention.

## Visual language

- **Near black — `#090b0a`:** archive, player, primary type, and deep sections.
- **Warm bone — `#f0eee5`:** the terrestrial surface and primary reading field.
- **Phosphor signal — `#d9ff43`:** live state, focus, reception, and interaction.
- Hairline grids, partial circles, dashed orbits, signal meters, coordinate
  labels, and asymmetric technical framing.
- Large, low, geometric headlines paired with restrained monospaced system copy.
- No purple, glossy science-fiction effects, galaxy photography, bevels, or
  generic neon gradients.

## Music archive

The archive is the largest part of the page. Every song is treated equally and
does not require artwork. Each row contains:

1. A play/pause receiver control.
2. A transmission number and animated signal meter.
3. The song title.
4. Stream, WAV, and MP3 controls.

The persistent player rises from the bottom only after a song is selected. It
supports previous/next, play/pause, seeking, elapsed time, and MP3 download.
Search filters the catalog immediately without reloading the page.

Collaborations with Karanastic occupy a separate phosphor-framed “cross-signal”
collection beneath the solo catalog. They remain part of the same player queue
without being mistaken for solo wizardfromearth releases.

## Photography direction

The finished `wfe-*.webp` photos are used non-destructively through CSS. Any
future edited images should follow this system:

- High-contrast monochrome base with retained skin and fabric texture.
- One phosphor-green graphic interaction, never a full neon wash.
- Crops should feel observational and slightly confrontational, not polished
  celebrity portraiture.
- Use hard polygonal or elliptical masks, orbital lines, coordinate ticks, and
  small registration marks around the subject.
- Preserve recognizable facial identity and the grounded Palm Bay environment.
- Avoid star fields, wizard costumes, AI fantasy scenery, heavy glitch filters,
  and cyberpunk purple/blue color grading.

The lower origin artifact slot randomly selects either `wfe-04.webp` or
`wfe-05.webp` at page load. Only the selected image is requested, and the full
image is preserved without crop-heavy side-by-side framing.

The social card in `og.png` is the clearest reference for the eventual photo
treatment and campaign assets.

## Page sequence

1. **Intercept / hero:** logo, Palm Bay coordinates, portrait, and invitation.
2. **Signal archive:** the complete searchable music catalog and player.
3. **Origin:** expanded biography, image fragments, and artist facts.
4. **Uplink:** Web3Forms submission channel.

## Motion

Motion should communicate reception, not decoration: slow orbital rotation,
subtle reveal transitions, a live receiver pulse, and animated signal meters
only while audio is playing. On initial page load, the hero words rise through
a staggered blur and technical skew before locking cleanly into position. All
motion is disabled or reduced when the visitor prefers reduced motion.
