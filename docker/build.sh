#!/usr/bin/env bash
# Build the PayPilotLabs Helpdesk image with frappe_docker's custom Containerfile (Frappe v16: Python 3.14, Node 24).
# Needs: docker and git. Public repos need no token:
#   ./docker/build.sh
# Private repos need a GitHub token with read access:
#   GITHUB_TOKEN=ghp_xxx ./docker/build.sh
# The token then ends up in the image's build history (docker history): never push that image.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -d .frappe_docker ] || git clone --depth 1 https://github.com/frappe/frappe_docker .frappe_docker
AUTH=""
if [ -n "${GITHUB_TOKEN:-}" ]; then
  AUTH="${GITHUB_TOKEN}@"
  echo "warning: GITHUB_TOKEN is stored in this image's build history; keep the image local." >&2
fi
APPS_JSON=$(sed "s#https://github.com/#https://${AUTH}github.com/#" docker/apps.json)
docker build \
  --build-arg=FRAPPE_PATH="https://${AUTH}github.com/paypilotlabs/paypilotlabs-framework.git" \
  --build-arg=FRAPPE_BRANCH=main \
  --build-arg=PYTHON_VERSION=3.14 \
  --build-arg=NODE_VERSION=24 \
  --build-arg=APPS_JSON_BASE64="$(printf '%s' "$APPS_JSON" | base64 | tr -d '\n')" \
  --tag="${IMAGE:-paypilotlabs/helpdesk}:${TAG:-latest}" \
  --file=.frappe_docker/images/custom/Containerfile \
  .frappe_docker
