#!/usr/bin/env bash
set -euo pipefail

if [ -n "${PREFIX:-}" ]; then
    TMP="$PREFIX/tmp"
else
    TMP="/tmp"
fi

mkdir -p "$TMP"

required=(
 index.html
 assets/css/style.css
 assets/js/app.js
 assets/js/config.js
 manifest.webmanifest
 service-worker.js
 blog/index.html
 status/index.html
 .github/workflows/pages.yml
)

echo
echo "=== MIKIS13 EDGEHUB SELF TEST ==="

for FILE in "${required[@]}"
do

    if [ -f "$FILE" ]; then
        echo "✅ $FILE"
    else
        echo "❌ $FILE"
        exit 1
    fi

done

node --check \
  assets/js/app.js

node --check \
  service-worker.js

TESTPORT=8097

python \
  -m http.server "$TESTPORT" \
  --bind 127.0.0.1 \
  >"$TMP/mikis13-edgehub-test.log" \
  2>&1 &

PID=$!

cleanup(){
    kill "$PID" \
      2>/dev/null || true
}

trap cleanup EXIT

sleep 2

for PATHNAME in \
  "/" \
  "/blog/" \
  "/status/" \
  "/assets/css/style.css" \
  "/assets/js/app.js" \
  "/manifest.webmanifest"
do

    CODE="$(
      curl \
        -s \
        -o /dev/null \
        -w '%{http_code}' \
        "http://127.0.0.1:$TESTPORT$PATHNAME"
    )"

    if [ "$CODE" = "200" ]; then
        echo "✅ $PATHNAME HTTP 200"
    else
        echo "❌ $PATHNAME HTTP $CODE"
        exit 1
    fi

done

cleanup
trap - EXIT

echo
echo "✅ EDGEHUB SELF TEST GESLAAGD"
