from fastapi import APIRouter, Depends, FastAPI
from fastapi_health import health
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.sessions import  SessionMiddleware

from api.routes import vagas_router
from config import settings
    
from contextlib import asynccontextmanager

from elasticsearch import AsyncElasticsearch
from fastapi import FastAPI

from api.routes.vagas_router import router as vagas_router
from config import settings
from infrastructure.repositories.elastic_vaga_repository import (
    ElasticVagaRepository,
)

from elasticsearch import Elasticsearch

@asynccontextmanager
async def lifespan(app: FastAPI):
    basic_auth = None
    if settings.elastic_user:
        basic_auth = (settings.elastic_user, settings.elastic_password)

    client = AsyncElasticsearch(
        hosts=[settings.elastic_url],
        basic_auth=basic_auth,
    )

    app.state.elastic_client = client
    app.state.vaga_repository = ElasticVagaRepository(client)

    yield

    await client.close()

app = FastAPI(title="API Busca Vagas", lifespan=lifespan)
public_router = APIRouter()

@public_router.get("/health")
async def healthy_simple():
    return True

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.public_base_url+":"+str(settings.port), "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compressão GZIP
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Restringe Hosts
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1"])

# Sessões (cookies assinados)
app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)

app.include_router(public_router)

app.include_router(vagas_router)    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app",
        host= f"{settings.host}",
        port= f"{settings.port}",
        reload=not  f"{settings.is_prod}",
        proxy_headers=True,
        forwarded_allow_ips="127.0.0.1",
    )
    
    
