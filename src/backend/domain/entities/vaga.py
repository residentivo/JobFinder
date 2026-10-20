from dataclasses import dataclass
from typing import List

@dataclass(frozen=True)
class Vaga:
    """Entidade de domínio representando uma vaga."""
    id: float
    empresa: str
    nome: str
    stack: str
    localizacao_cidade: str
    localizacao_estado: str
    nivel: str
    modalidade: str
    salario: float