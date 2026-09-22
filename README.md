# Calibrated Decisions

A visual playground for the **Pollinations Jev typed-decisions API** (`POST /alpha/decisions`) — write a decision state, build typed questions, and see the calibrated probability of every answer as bar charts with confidence, legend and routing metadata.

Live: https://jonakss--calibrated-decisions-app-page.modal.run

## What it does

- **State textarea** — the facts the decision is made on.
- **Typed question builder** — `choice` (record of named options), `score` (ordered rungs array), `noul` (yes/no with optional true/false criteria).
- **Calibrated display** — every answer shows P(option), confidence, legend and routing metadata from the gateway.
- **Three presets** — support triage, PR-review gate, churn risk.
- **Guided UX for the classic 400** — sending choice criteria as an array instead of a record is the most common mistake with this API; the app turns the error into a hint linking the canonical tip in [pollinations/collective-memory](https://github.com/pollinations/collective-memory).

## Bring your own key

The app calls the gateway straight from the browser with **your** API key (entered in memory, never stored: no localStorage, no sessionStorage, no cookies). Requests are BYOP — usage and cost belong to the caller.

## Run locally

```bash
# any static server works
python3 -m http.server 8080
# open http://localhost:8080
```

## Tests

```bash
npm test   # 8 checks: presets, endpoint contract, BYOP no-persistence, typed shapes, guided error, Pollinations credit
```

## Deploy (optional)

Any static host works. One way is a tiny Modal app that serves `index.html`:

```python
import modal
from pathlib import Path

image = (modal.Image.debian_slim(python_version="3.12")
         .add_local_file(Path("index.html").resolve(), "/app/index.html"))

app = modal.App("calibrated-decisions")

@app.function(image=image)
@modal.fastapi_endpoint(label="app-page")
def app_page():
    from pathlib import Path
    from fastapi.responses import HTMLResponse
    return HTMLResponse(Path("/app/index.html").read_text())
```

Note: module-level file reads re-execute inside the container — embed files in the image with `add_local_file` and read the embedded path at runtime.

## Credits

Powered by [Pollinations](https://pollinations.ai) — Jev typed decisions via `gen.pollinations.ai`.

## License

MIT
