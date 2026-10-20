from abc import ABC, abstractmethod
from typing import List

from domain.entities.vaga import Vaga


class VagaRepository(ABC):
    """Contrato do repositório. O domínio define O QUE precisa, não COMO."""

    @abstractmethod
    async def buscar(self, termo: str = None, salario_minimo: float = None, salario_maximo: float = None, page: int = 1, total: int = 20, sort: str = None, order: str = None) -> tuple[List[Vaga], int]:
        ...