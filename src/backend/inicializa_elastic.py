from config import settings

import csv
from elasticsearch import Elasticsearch, helpers

def importar_csv(caminho_arquivo, index_name):
    with open(caminho_arquivo, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        # Gera as ações para o bulk
        actions = ({
            "_index": index_name,
            "_source": row
        } for row in reader)
        
        # Executa a importação em lote
        sucesso, erros = helpers.bulk(es, actions, raise_on_error=False)
        print(f"Importados: {sucesso} documentos. Erros: {len(erros)}")


es = Elasticsearch(
        hosts=[settings.elastic_url],
        basic_auth=(settings.elastic_user, settings.elastic_password),
        )

index_name = "vagas"

# Definição do mapping com o normalizer
mapping = {
    "settings": {
        "analysis": {
            "normalizer": {
                "fold_normalizer": {
                    "type": "custom",
                    "filter": ["lowercase", "asciifolding"]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "empresa": {
                "type": "keyword", "normalizer": "fold_normalizer"
            },
            "id": {
                "type": "long"
            },
            "localizacao_cidade": {
                "type": "keyword", "normalizer": "fold_normalizer"
            },
            "localizacao_estado": {
                "type": "keyword"
            },
            "modalidade": {
                "type": "keyword"
            },
            "nivel": {
                "type": "keyword"
            },
            "nome": {
                "type": "keyword", "normalizer": "fold_normalizer"
            },
            "salario": {
                "type": "long"
            },
            "stack": {
                "type": "keyword"
            }
        }
    }
}

# Cria o índice (se ainda não existir)
if not es.indices.exists(index=index_name):
    es.indices.create(index=index_name, body=mapping)


# Chame a função
importar_csv("..\\..\\dataset\\vagas.txt", "vagas")