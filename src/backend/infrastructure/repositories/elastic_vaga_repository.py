import logging
from typing import List
from urllib import response

from elasticsearch import AsyncElasticsearch

from domain.entities.vaga import Vaga
from domain.repositories.vaga_repository import VagaRepository


class ElasticVagaRepository(VagaRepository):
    """Implementação do repositório usando Elasticsearch."""

    INDEX_NAME = "vagas"

    def __init__(self, client: AsyncElasticsearch):
        self._client = client

    async def buscar(self, termo: str, salario_minimo: float = None,salario_maximo: float = None,page: int = 1, total: int = 20) -> tuple[List[Vaga], int]:
        
        campos = ["nome", "empresa", "stack", "localizacao_cidade", "localizacao_estado","nivel", "modalidade"]
        termos = termo.split()
        
        must = []
        for termo in termos:
            should = [
                {"wildcard": {campo: {"value": f"*{termo}*", "case_insensitive": True}}}
                for campo in campos
            ]
            must.append({
                "bool": {
                    "should": should,
                    "minimum_should_match": 1
                }
            })

        if not termo or not termo.strip():
            query = {
                "match_all": {},
                "filter": []
            }
        else:
            query = {
                "bool": {
                    "must": must,
                    "filter": [] 
                }
            }

        if salario_minimo is not None or salario_maximo is not None:
            salary_range = {}
            if salario_minimo is not None:
                salary_range["gte"] = salario_minimo
            if salario_maximo is not None:
                salary_range["lte"] = salario_maximo

            query["bool"]["filter"].append({"range": {"salario": salary_range}})

        response = await self._client.search(
            index=self.INDEX_NAME,
            query=query,
            size=total,
            from_=(page - 1) * total
        )
        
        total_hits = response["hits"]["total"]["value"]

        return [
            Vaga(
                id=hit["_source"]["id"],
                nome=hit["_source"]["nome"],
                empresa=hit["_source"]["empresa"],
                stack=hit["_source"]["stack"],
                localizacao_cidade=hit["_source"]["localizacao_cidade"],
                localizacao_estado=hit["_source"]["localizacao_estado"],
                nivel=hit["_source"]["nivel"],
                modalidade=hit["_source"]["modalidade"],
                salario=hit["_source"]["salario"],
            )
            for hit in response["hits"]["hits"]
        ], total_hits 