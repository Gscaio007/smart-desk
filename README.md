# SmartDesk

Sistema full-stack de atendimento e gestão de chamados com controle de SLA, permissões por perfil e comentários internos.

## Stack

### Backend
- PHP
- Laravel
- Laravel Sanctum
- MySQL
- Redis
- Scheduler
- API REST

### Frontend
- React
- TypeScript
- Vite
- Axios
- React Router

## Funcionalidades da v1

- Login com token via Laravel Sanctum
- Perfis de usuário: admin, atendente e cliente
- Criação de chamados
- Listagem de chamados por perfil
- Detalhe do chamado
- Comentários em chamados
- Comentários internos para atendentes/admins
- Atendente pode assumir chamado
- Atendente pode alterar status do chamado
- Controle de SLA com vencimento automático
- Dashboard com contadores por status
- Logout com revogação de token

## Usuários de teste

```txt
Admin:
admin@smartdesk.test
password

Atendente:
agent@smartdesk.test
password

Cliente:
customer@smartdesk.test
password


## Rodar o backend:

cd smartdesk-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

## Configurar no .env:

DB_CONNECTION=mysql
DB_DATABASE=smartdesk
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=redis
CACHE_STORE=redis
REDIS_CLIENT=phpredis

## Rodar scheduler:
php artisan schedule:work


## Rodar o frontend:

cd frontend
npm install
npm run dev


##Frontend:
http://localhost:5173


##Backend:
http://127.0.0.1:8000
