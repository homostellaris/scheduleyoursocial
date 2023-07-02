# Getting started

1. `cp .env.template .env`
2. `dootenv > .envrc && direnv allow` to be able to run other scripts that require these values passed as options.
   1. Note further setup is required in VS Code to allow direnv to load env vars for Tasks.
3. `npm run dev`
4. `npm run db:init`
5. Copy the `secret` from stdout into the value for `FAUNADB_INVITEE_SECRET` in `.env`.
6. `open http://localhost:3000/`
