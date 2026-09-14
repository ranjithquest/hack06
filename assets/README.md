# Asset sources and notices

- `fonts/DMMono-*.ttf`: DM Mono by Colophon Foundry, distributed under the SIL
  Open Font License. The license is retained in `fonts/DMMono-OFL.txt`.
  Upstream: https://github.com/google/fonts/tree/main/ofl/dmmono.
- `mobile-assets/fluent-*.svg`: Microsoft Fluent UI System Icons, MIT licensed.
  The license is retained in `mobile-assets/fluent-icons-LICENSE`.
  Upstream: https://github.com/microsoft/fluentui-system-icons.
- MAI illustrations and imagery are project-provided assets drawn from
  https://microsoft.ai/. The public source URLs retained during preparation are
  listed in `mobile-assets/mai-site/source-urls.txt`; the app uses `thinking-1.png`
  from that collection, along with prepared `mai-phone.png`, `mai-people.png`,
  and `mai-water.png` assets.
- `cover-ink-sketch.png`, `cover-colour-study.png`, and `cover-landscape.png` are
  project-provided cover artwork.

The font and icon licenses do not license the other artwork. Copyright and
trademark rights remain with their respective owners; this project does not
grant additional rights to redistribute those images. Only artwork needed by
the app is tracked. Other local visual studies are not part of the publication.

Production builds copy these notices into `licenses/`; standalone HTML exports
embed them in an inert `asset-notices` template without changing the slides.
