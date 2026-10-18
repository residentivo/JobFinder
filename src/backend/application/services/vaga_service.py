from typing import List

from domain.entities.vaga import Vaga
from domain.repositories.vaga_repository import VagaRepository


class VagaService:
    def __init__(self, repository: VagaRepository):
        self._repository = repository

    async def pesquisar(self, termo: str) -> List[Vaga]:
        if not termo or not termo.strip():
            raise ValueError("O termo de busca não pode ser vazio.")

        if len(termo.strip()) < 2:
            raise ValueError("O termo de busca deve ter ao menos 2 caracteres.")

        return await self._repository.buscar(termo.strip())