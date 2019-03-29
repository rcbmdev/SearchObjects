# Search Objects
Aplicação web que busca objetos em imagens usando Rekognition e ElasticSearch.

## Introdução

Para executar a aplicação web, siga algumas instruções abaixo:

### Prerequisites

Você deve criar duas funções em Python 3.6 na AWS Lambda e subir os arquivos indexa.zip e pesquisa.zip respectivamente.

```
Esse arquivo vai disparar um evento automático para que toda vez que uma imagem seja carregada na aplicação, os objetos contidos 
na imagem seja armazenado no ElasticSearch.
```

### Configuração

Na aplicação usamos um Bucket S3 para o armazenamento de imagens. Além de provisionarmos um serviço do ElasticSearch na AWS. Para saber mais detalhes acesse o artigo abaixo:

https://medium.com/ensina-ai/busca-por-objetos-em-imagens-com-amazon-rekognition-e-elasticsearch-38c988e653b


## Execução da aplicação
Após a configuração de todos os passos acima, basta abrir o diretório site e navegar pelo arquivo index.html. Como é um site estático, ele pode ser colocado em produção num Bucket S3.

Segue uma demonstração da Aplicação:

![](SearchObjects.gif)
