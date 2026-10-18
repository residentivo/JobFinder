from abc import ABC, abstractmethod
from typing import List

from domain.entities.vaga import Vaga


class VagaRepository(ABC):
    """Contrato do repositório. O domínio define O QUE precisa, não COMO."""

    @abstractmethod
    async def buscar(self, termo: str) -> List[Vaga]:
        ...