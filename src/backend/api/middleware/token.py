from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("api")
app = FastAPI()

PUBLIC_PATHS = {
    "/health"    
}

# @app.middleware("http")
async def auth(request: Request, call_next):
    
    # Rotas públicas passam direto
    if request.url.path in PUBLIC_PATHS:
        return await call_next(request)
    
    token = request.headers.get("Authorization")
    if not token or token != "Bearer":
        return JSONResponse(status_code=401, content={"detail": "Não autorizado"})

    return await call_next(request)   
