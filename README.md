# PayPilotLabs Helpdesk

A customer service desk: your customers send questions, your team answers them, and nothing gets lost on the way.

By [PayPilotLabs](https://paypilotlabs.com). Support and requests: https://paypilotlabs.com/roadmap/

## What it does

- **Tickets**: every customer email or portal request becomes a ticket with a status, priority, type and owner.
- **Agent workspace**: one screen per ticket with the full conversation, internal comments, saved replies and the customer's details.
- **Customer portal**: customers log in, raise tickets and follow their progress themselves.
- **Service levels (SLAs)**: response and resolution deadlines per priority, with working hours and holidays.
- **Assignment**: teams, assignment rules and round-robin, so new tickets reach the right person.
- **Knowledge base**: help articles grouped in categories, shown to customers before they raise a ticket.
- **Email**: connect your support mailbox; replies go out as normal emails and come back into the same ticket.
- **Reports**: a dashboard of ticket volume, response times and SLA performance.
- **Phone calls (optional)**: install PayPilotLabs Telephony to call customers from a ticket and keep call logs.

## How it helps your business

- No request is forgotten: every message has an owner and a status until it is closed.
- Customers get answers on time, because deadlines are tracked and late tickets stand out.
- Fewer repeat questions: customers find answers in the knowledge base on their own.
- Agents answer faster with saved replies and the whole history on one screen.
- You can see where support is slow and fix it, instead of guessing.

## How it fits with other PayPilotLabs products

- Runs on **paypilotlabs-framework**, which provides users, permissions, email and the database.
- **paypilotlabs-telephony** is optional. Without it, the call features stay hidden. To add it, put the telephony repo in `docker/apps.json` and add `--install-app telephony` before `--install-app helpdesk` in `docker/docker-compose.yml`.
- It does not need any other PayPilotLabs product.

## Run it

PayPilotLabs Helpdesk runs as a PayPilotLabs framework v16 site in Docker: MariaDB 11.8, Redis, and one image holding the framework and Helpdesk.

1. Build the image: `./docker/build.sh`. It tags `paypilotlabshelpdesk:<git commit>` (push that one to ECR) and `paypilotlabshelpdesk:latest`. If the repos are private, run `GITHUB_TOKEN=<token with read access> ./docker/build.sh`; the token is then stored in the image's build history, so never push that image.
2. Start it: `docker compose -f docker/docker-compose.yml up -d`
3. Watch the first-run setup: `docker compose -f docker/docker-compose.yml logs -f create-site` (wait for it to exit 0).
4. Open http://helpdesk.localhost:8080 and log in as `Administrator` / `admin`. Change the password straight away.

Stop with `docker compose -f docker/docker-compose.yml down` (add `-v` to delete the data).

## Licence

AGPL-3.0, see [LICENSE](LICENSE). Based on open-source work by others; see [NOTICE.md](NOTICE.md) for credits.
