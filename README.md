# Getting started
1. `cp .env.template .env`
2. `npm run dev`
3. `npm run db:init`
4. Copy the `secret` from stdout into the value for `FAUNADB_ATTENDEE_SECRET` in `.env`.
5. `open http://localhost:3000/`