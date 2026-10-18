from dataclasses import dataclass
from typing import List
from uuid import UUID

@dataclass(frozen=True)
class Vaga:
    """Entidade de domínio representando uma vaga."""
    id: UUID
    empresa: str
    nome: str
    stack: List[str]
    localizacao_cidade: str
    localizacao_estado: str
    nivel: str
    remoto: bool
    salario: float