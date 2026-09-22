"""Calibrated Decisions — visual playground for the Pollinations typed-decisions API.

Deploy: modal deploy modal_app_calibrated.py
Serve:  https://jonakss--calibrated-decisions-app-page.modal.run (GET, public)
App:    index.html (this repo, embedded into the image at build time; BYOP = the
        caller's key via browser straight to the gateway, CORS * verified on /alpha/decisions).
"""
import modal
from pathlib import Path

_APP_HTML = Path(__file__).resolve().parent / "index.html"

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install("fastapi")
    .add_local_file(str(_APP_HTML), "/app/index.html")  # el file viaja con la imagen
)

app = modal.App("calibrated-decisions")


@app.function(image=image, scaledown_window=300, max_containers=1)
@modal.fastapi_endpoint(method="GET")
def app_page():
    from pathlib import Path as _P

    from fastapi.responses import HTMLResponse

    return HTMLResponse(_P("/app/index.html").read_text())
