from typing import List

from domain.entities.vaga import Vaga
from domain.repositories.vaga_repository import VagaRepository


class VagaService:
    def __init__(self, repository: VagaRepository):
        self._repository = repository

    async def pesquisar(self, termo: str=None, salario_minimo: float = None, salario_maximo: float = None, page: int = 1, total: int = 20, sort: str = None, order: str = None) -> tuple[List[Vaga], int]:
        if not termo or not termo.strip():
            raise ValueError("O termo de busca não pode ser vazio.")

        if len(termo.strip()) < 2:
            raise ValueError("O termo de busca deve ter ao menos 2 caracteres.")

        vagas, total = await self._repository.buscar(termo.strip(), salario_minimo, salario_maximo, page, total, sort, order)
        return vagas, total