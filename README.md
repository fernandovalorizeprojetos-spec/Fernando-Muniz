# Modelando Barro, Transformando Vidas II

Dashboard institucional e painel de edição do projeto de formação em cerâmica artística e inclusão social de mulheres 60+, incentivado pela Lei Federal de Incentivo à Cultura (Lei 8.313/1991).

## Estrutura

- `frontend/`: React, TypeScript e Vite; dashboard público e interface `/admin`.
- `backend/`: API REST em Node.js/Express; conexão PostgreSQL, validação do token administrativo e CORS.
- `database/schema.sql`: tabelas do projeto e estrutura persistida em PostgreSQL.
- `backend/src/seed.js`: conteúdo inicial, inserido apenas quando as tabelas correspondentes estão vazias.

## Executar localmente

Requisitos: Node.js 20+ e PostgreSQL 14+.

1. Crie um banco PostgreSQL chamado `modelando_barro`.
2. Copie `.env.example` para `.env` na raiz. Defina `DATABASE_URL`, um `ADMIN_TOKEN` longo e aleatório, `FRONTEND_ORIGIN=http://localhost:5173` e, se necessário, `PORT=3001`.
3. Na raiz, execute `npm install`.
4. Inicie a API em um terminal com `npm run start --workspace backend`. Na primeira inicialização, a API aplica `database/schema.sql` e inclui os seeds nas tabelas vazias.
5. Em outro terminal, execute `npm run dev --workspace frontend`.
6. Acesse o endereço local do Vite (normalmente `http://localhost:5173`). Abra `/admin` para editar conteúdo usando o mesmo `ADMIN_TOKEN`.
7. Para apontar o front-end a outra API local, defina `VITE_API_URL` no arquivo `frontend/.env.local`.

O backend usa `http://localhost:5173` como origem local padrão somente em desenvolvimento. Em produção, `FRONTEND_ORIGIN` é obrigatório e deve ser a origem HTTPS exata do site Vercel, sem barra ao final. O front-end lê `VITE_API_URL` durante o build. O `ADMIN_TOKEN` só existe no backend: não o adicione a variáveis `VITE_*`, ao navegador, ao repositório ou a URLs.

## Publicar

### Vercel (front-end)

1. Importe o repositório no Vercel e selecione `frontend/` como **Root Directory**.
2. Configure `VITE_API_URL` com a URL HTTPS pública do serviço backend Railway, sem barra ao final.
3. Use `npm run build` como Build Command e `dist` como Output Directory; o Vercel detecta Vite automaticamente.
4. Publique e anote a origem HTTPS atribuída (por exemplo, `https://seu-projeto.vercel.app`).

### Railway (API e PostgreSQL)

1. Crie um projeto Railway e adicione um serviço PostgreSQL. Use a variável `DATABASE_URL` fornecida pelo Railway.
2. Adicione um serviço de aplicação conectado a este repositório, com o diretório raiz do repositório como contexto para que `database/schema.sql` também esteja disponível.
3. Configure o comando de inicialização `npm run start --workspace backend`. O serviço executa as migrações SQL idempotentes e o seed no primeiro boot; o health check é `GET /api/ping`.
4. Defina no serviço backend as variáveis `DATABASE_URL`, `ADMIN_TOKEN` (um segredo forte, exclusivo e armazenado no Railway) e `FRONTEND_ORIGIN` (a origem HTTPS exata publicada pela Vercel). Defina também `NODE_ENV=production`; a porta é obtida de `PORT`, fornecida pelo Railway.
5. Gere um domínio público Railway para o serviço backend. Configure a URL HTTPS desse domínio como `VITE_API_URL` no Vercel e faça um novo deploy do front-end.
6. Confirme `GET https://<domínio-railway>/api/ping` e abra `/admin` no domínio Vercel para validar leitura e edição.

Não configure curingas no CORS. Para um domínio Vercel de preview, altere `FRONTEND_ORIGIN` explicitamente para essa origem enquanto estiver validando e depois restaure a origem de produção. Secrets e URLs de produção precisam ser fornecidos nas configurações dos provedores; não são armazenados neste repositório.

### GitHub

Este projeto já está no repositório GitHub configurado para a sessão. Faça commits na branch de trabalho após revisar as alterações e abra um pull request para incorporá-las à branch principal. Nenhum token de publicação do Vercel/Railway ou segredo de produção é necessário para desenvolver localmente.

## API

- `GET /api/ping`: verifica a conexão com o PostgreSQL.
- `GET /api/dados`: retorna projeto, indicadores, fases, equipe, módulos, metodologia, acessibilidade e decisões.
- `PUT /api/metricas`, `/api/cronograma`, `/api/equipe`, `/api/modulos`, `/api/acessibilidade` e `/api/decisoes`: substitui os registros daquela seção. Envie a lista JSON no corpo e o cabeçalho `x-admin-token: <ADMIN_TOKEN>`.

O painel público é somente leitura. A página `/admin` guarda o token apenas na sessão atual do navegador e o envia ao backend somente no cabeçalho das alterações. O token não concede acesso à interface por si só se não for configurado no serviço Railway.

## Uso do painel `/admin` em 10 passos

1. Abra `https://<domínio-vercel>/admin`.
2. Solicite ao responsável a chave administrativa configurada no Railway.
3. Digite a chave para carregar os dados atuais do projeto.
4. Localize a seção que deseja atualizar, como Métricas ou Equipe.
5. Edite o conteúdo no campo JSON da seção escolhida.
6. Preserve os nomes dos campos e use aspas duplas conforme a sintaxe JSON.
7. Para listas, mantenha os itens entre colchetes `[]` e separe-os por vírgulas.
8. Clique em **Salvar seção** e confira a mensagem de confirmação ou erro.
9. Abra o painel público em outra aba e recarregue a página para conferir a mudança.
10. Clique em **Encerrar sessão** ao terminar; a chave também é descartada ao fechar a sessão do navegador.
