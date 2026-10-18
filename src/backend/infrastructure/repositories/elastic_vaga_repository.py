from typing import List

from elasticsearch import AsyncElasticsearch

from domain.entities.vaga import Vaga
from domain.repositories.vaga_repository import VagaRepository


class ElasticVagaRepository(VagaRepository):
    """Implementação do repositório usando Elasticsearch."""

    INDEX_NAME = "vagas"

    def __init__(self, client: AsyncElasticsearch):
        self._client = client

    async def buscar(self, termo: str) -> List[Vaga]:
        if not termo or not termo.strip():
            return []

        # Multi-match: busca o termo nos campos "nome" e "sobrenome"
        query = {
            "multi_match": {
                "query": termo,
                "fields": ["nome", "empresa", "stack", "localizacao_cidade", "localizacao_estado"],
                "type": "best_fields",
                "fuzziness": "AUTO",  # tolerância a erros de digitação
            }
        }

        response = await self._client.search(
            index=self.INDEX_NAME,
            query=query,
            size=20,
        )

        return [
            Vaga(
                id=hit["_source"]["id"],
                nome=hit["_source"]["nome"],
                empresa=hit["_source"]["empresa"],
                stack=hit["_source"]["stack"],
                localizacao_cidade=hit["_source"]["localizacao_cidade"],
                localizacao_estado=hit["_source"]["localizacao_estado"],
                nivel=hit["_source"]["nivel"],
                remoto=hit["_source"]["remoto"],
            )
            for hit in response["hits"]["hits"]
        ]