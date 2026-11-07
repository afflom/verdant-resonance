# Verdant Resonance

A peaceful first-person garden exploration game. Wander through five acoustic
biomes, discover and attune interactive plants, and listen to a procedural
soundscape that responds to movement and the changing sky.

## Play

The game is published at <https://afflom.github.io/verdant-resonance/>.

## Run locally

Requires Node.js 22.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To validate a production build:

```sh
npm run lint
npm test
npm run build
npm run preview
```

## Controls

- **WASD / arrow keys** — move
- **Mouse drag / Q and E** — look around
- **Space** — attune to nearby flora
- **T** — touch a petal; **C** — practice stillness
- **L** — change the sky; **1–5** — travel to a biome
- **P / Escape** — open or close the field guide
- **M** — mute; **R** — restart; **H** — hide the controls dock

## Deployment

Pushing to `main` runs [the Pages workflow](.github/workflows/pages.yml). It
installs dependencies, type-checks and tests the game, builds the static site,
and deploys the artifact to GitHub Pages. The repository's Pages source must be
set to **GitHub Actions**.
