Migrations
Cria a migration:
yarn sequelize migration:create --name=create-users

Persiste a tabela no db:
yarn sequelize db:migrate

Desfaz a ultima migration:
yarn sequelize db:migrate:undo

Desfaz todas as migrations
yarn sequelize db:migrate:undo:all
