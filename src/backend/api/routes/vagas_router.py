from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from application.services.vaga_service import  VagaService
from api.dependencies import  get_vagas_service 


router = APIRouter(prefix="/api/vagas", tags=["vagas"])

class VagaResponseItem(BaseModel):
    id: float
    empresa: str
    nome: str
    stack: str
    localizacao_cidade: str
    localizacao_estado: str
    nivel: str
    modalidade: str
    salario: float
    
class VagaResponse(BaseModel):
    vagas: List[VagaResponseItem]
    total: int

@router.get("/buscar", response_model=List[VagaResponse])
async def buscar_vagas(
    q: str = Query(None, min_length=1, description="Termo de busca"),
    sm: float = Query(None, description="Salário mínimo"),
    sx: float = Query(None, description="Salário máximo"),
    page: int = Query(1, ge=1, description="Número da página"),
    total: int = Query(20, ge=1, le=100, description="Total de resultados por página"),
    sort: str = Query(None, description="Critério de ordenação"),
    order: str = Query(None, description="Ordem de ordenação: 'asc' ou 'desc'"),
    service: VagaService = Depends(get_vagas_service),
):
    try:
        vagas = await service.pesquisar(q, salario_minimo=sm, salario_maximo=sx, page=page, total=total, sort=sort, order=order)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    return [
        VagaResponse(vagas=[
            VagaResponseItem(id=v.id, 
                        empresa=v.empresa, 
                        nome=v.nome, 
                        stack=v.stack, 
                        localizacao_cidade=v.localizacao_cidade, 
                        localizacao_estado=v.localizacao_estado, 
                        nivel=v.nivel, 
                        modalidade=v.modalidade, 
                        salario=v.salario)
            for v in vagas[0]
        ], total=vagas[1])
    ]       