# Getting started

1. `cp .env.template .env`
2. `npx web-push generate-vapid-keys`
3. `dotenv > .envrc && direnv allow` to be able to run other scripts that require these values passed as options.
   1. Note further setup is required in VS Code to allow direnv to load env vars for Tasks.
4. `npm run dev`
5. `npm run db:init`
6. Copy the `secret` from stdout into the value for `FAUNADB_INVITEE_SECRET` in `.env`.
7. `open http://localhost:6602/`
