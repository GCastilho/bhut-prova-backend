# Desafio backend

Este repositório contém o desafio backend para a BHTU

## Instalação

Para rodar o código é necessário ter docker e docker-compose instalado na máquina. Para rodar o sistema em produção é necessário apenas executar o arquivo docker-compose.yml que está localizado na pasta root do projeto

Uma vez executado "docker-compose up" o compose irá se encarregar de instalar as dependências do typescript e executar a compilação. O compose irá então subir um container com mongodb e outro com o servidor do backend nodejs para executar a aplicação

O processo estará acessível na porta 3000 da sua máquina local (e outras, se o seu docker permitir) para ser acessado livremente

## Utilização
A API consiste de 3 entrypoints `/user`, `/authentication` e `/cars`, todas aceitam payload apenas no formato JSON que _deve_ conter um HEADER com "Content-type" adequado

A assinatura dos entrypoints é a seguinte:

Um POST em `/user` com `email` e `password` cria um novo usuário
```
curl http://localhost:3000/user \
  -X POST \
  -H "Content-type: application/json" \
  -d '{"email":"email@example.com","password":12345}'
```

Um POST em `/authentication`, com `email` e `password` autentica um novo usuário
```
curl http://localhost:3000/authentication \
  -X POST \
  -H "Content-type: application/json" \
  -d '{"email":"email@example.com","password":12345}'
```
O request irá retornar um JSON no formato `{"authorization":"<string>"}`, essa string é a chave de autorização de um usuário, e deve ser enviada em um header "Authorization" nos requests seguintes

Os requests documentados a seguir necessitam de um usuário devidamente autenticado para serem executados com sucesso, no caso de uma falha de autenticação a API erá retornar status 401 com o seguinte JSON como resposta:
`{"error":"NotAuthorized","message":"A valid 'Authorization' header is required to perform this operation"}`

Um DELETE em `/authentication` deleta uma sessão de autenticação
```
curl http://localhost:3000/authentication \
  -X DELETE \
  -H "Authorization: <auth_key>"
```
O request irá retornar um JSON no formato `{"message":"Success"}` no caso bem sucedido. Após esses request a chave de autenticação não é mais válida e o usuário deve autenticar-se novamente para poder fazer outros requests

Um POST em `/cars` cria um novo carro
```
curl http://localhost:3000/cars \
  -X POST \
  -H "Authorization: <auth_key>" \
  -H "Content-type: application/json" \
  -d '{
    "marca": "Volkswagen",
    "modelo": "Gol",
    "ano": 1997,
    "combustivel": "Gasolina",
    "cor": "Verde",
    "preco": 15000000
  }'
```
Todos os campos do JSON são obrigatórios. O request irá retornar um JSON no formato `{"message":"Success"}` no caso bem sucedido

Um GET em `/cars` consulta os carros cadastrados. Parâmetros passados na URL no formato urlencoded _são opcionais_ e serão utilizados para filtro. Esse request não precisa de autenticação
```
curl http://localhost:3000/cars?ano=1997 \
  -X GET
```
O request irá retornar um array com os carros que correspondem ao filtro informado (ou todos, caso nenhum filtro seja passado). Se não houver nenhum carro cadastrado ou o filtro não corresponder a nenhum carro cadastrado, o array estará vazio

Um PATCH em `/cars` realiza alterações em um carro cadastrado. Parâmetros passados na URL serão utilizados para filtrar os documentos em que a alteração deve ser feita e o objeto enviado no body do request será utilizado para substituir os campos dos referidos objetos. Caso nenhum filtro for passado as alterações serão feitas em todos os documentos
```
curl http://localhost:3000/cars?ano=1997 \
  -X PATCH \
  -H "Authorization: <auth_key>" \
  -H "Content-type: application/json" \
  -d '{
    "preco": 5700.65
  }'
```
O request acima procura por todos os carros com "ano" igual a 1997 e altera seus preços para 5700.65. O request retorna um objeto `{"n":0,"nModified":0,"ok":1}`, sendo `n` os objetos que foram encontrados pelo filtro e `nModified` os objetos que foram alterados

Um DELETE em `/cars` remove entradas de carros do banco. Parâmetros passados na URL serão utilizados para filtrar os documentos que devem ser removidos. Caso nenhum filtro seja passado todos os carros cadastrados serão removidos
```
curl http://localhost:3000/cars \
  -X DELETE \
  -H "Authorization: <auth_key>"
```
## Desenvolvimento
Para instalar as dependências de desenvolvimento é necessário rodar o script `npm install`

Para iniciar o modo dev, o script é `npm run dev`, ficando disponível também na porta 3000

Para compilar, `npm run build`, que compila o typescript e o coloca na pasta "build"

Para iniciar um servidor em produção: `npm run start` ou `npm start`

***

Projeto desenvolvido por Gabriel Castilho https://github.com/GCastilho
