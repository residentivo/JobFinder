from time import time
from urllib import response

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("api")
app = FastAPI()

PUBLIC_PATHS = {
    "/health",
    "/health/detailed",

}

@app.middleware("http")
async def log(request: Request, call_next):
    # Log de entrada
    logger.info(f"→ {request.method} {request.url.path}")
    start = time.perf_counter()

    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{time.perf_counter() - start:.4f}"

    # Log de saída
    logger.info(f"← {response.status_code} {request.url.path} {time.perf_counter() - start:.4f}")
    return response