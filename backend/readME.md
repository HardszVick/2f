Recursos necessários:

Node 26.10.0

# TLTR
Crie uma .env com um "DATABASE_URL" valido de postgres, pode ser do próprio supabase
rode o comando "yarn db:migrate" e depois execute com "yarn dev"




# Detalhes
Caso você utilize o NVM só dar "nvm use" 
como foi dito que futuramente iria ser passado um desafio contendo SQL
a persistência utiliza PostgreSQL com Drizzle ORM

Configure o arquivo .env com base no .env.example. A variável DATABASE_URL é
obrigatória; PORT e URL_FRONT possuem valores locais padrão.
caso você queira acessar com o swagger só utilizar <url>/docs

Banco de dados:
A conexão com o PostgreSQL deve ser informada pela variável DATABASE_URL.
As migrações pendentes são aplicadas automaticamente ao iniciar a API.

Comandos disponíveis:
yarn db:generate - gera uma migração após alterações no schema
yarn db:migrate - aplica as migrações manualmente
yarn db:studio - abre o Drizzle Studio

Hooks adicionados
cors
helmet
swagger

Em produção obviamente o CORS e o HELMET deveriam ser mais precisos.
