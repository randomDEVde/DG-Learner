from fastapi import FastAPI

app = FastAPI(title="DG Learner API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/info")
def info() -> dict[str, str]:
    return {
        "message": "Backend-Grundgeruest fuer spaetere zentrale Datenpflege und API-Erweiterungen."
    }
