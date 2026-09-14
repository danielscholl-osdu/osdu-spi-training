# Posters

Two kinds of file live here.

- **Supplied originals** (`borrow-prove-restore.png`, `backing-environment.png`, `architecture-of-permanent-cloud-fork.png`, `continuous-forking-engineering-system-overview.png`) are reference artifacts kept verbatim. They are not served; the retired ones resolve through `retiredGuides` in the router.
- **Site-built posters** keep a self-contained HTML source beside the PNG it renders to (`one-request`, `credentials`, `inside-the-cluster`, `borrow-prove-restore-site`, `backing-environment-site`). Edit the HTML and re-render; never edit the PNG.

`borrow-prove-restore-site` and `backing-environment-site` replace the learner-facing web copies of the two supplied posters of the same subject. The supplied originals stay beside them; each site-built source names the documents it was checked against and the month its status was reviewed.

## Render

From the repository root, with Chrome installed:

```sh
SCALE=2 bash ~/.claude/skills/infographic/scripts/render.sh \
  docs/reference/posters/<id>-site.html docs/reference/posters/<id>-site.png 1800x1200
sips -Z 2000 -s format jpeg -s formatOptions 85 \
  docs/reference/posters/<id>-site.png --out public/posters/<id>.jpg
```

The render is 3600x2400 and the web copy 2000x1333, which is the `width` and `height` the entry in `src/content/posters.js` declares. Rendered September 2026.
