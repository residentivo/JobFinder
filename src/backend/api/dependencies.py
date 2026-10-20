from fastapi import Depends, Request

from application.services.vaga_service import VagaService,   VagaService, VagaService


def get_vagas_service(request: Request) -> VagaService:
    # O repositório é criado uma vez no startup e guardado em app.state
    return VagaService(repository=request.app.state.vaga_repository)