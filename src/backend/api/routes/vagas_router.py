from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from application.services.vaga_service import  VagaService
from api.dependencies import  get_vagas_service 


router = APIRouter(prefix="/api/vagas", tags=["vagas"])


class VagaResponse(BaseModel):
    id: UUID
    empresa: str
    nome: str
    stack: List[str]
    localizacao_cidade: str
    localizacao_estado: str
    nivel: str
    remoto: bool
    salario: float


@router.get("/buscar", response_model=List[VagaResponse])
async def buscar_vagas(
    q: str = Query(..., min_length=1, description="Termo de busca"),
    service: VagaService = Depends(get_vagas_service),
):
    try:
        vagas = await service.pesquisar(q)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return [
        VagaResponse(id=v.id, nome=v.nome, sobrenome=v.sobrenome)
        for v in vagas
    ]