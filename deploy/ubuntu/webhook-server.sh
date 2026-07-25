#!/usr/bin/env bash
# Minimal webhook listener: POST /hooks/deploy with header X-Deploy-Secret
# Triggers portfolio-auto-update so pushes can update the Ubuntu host immediately.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/portfolio}"
PORT="${WEBHOOK_PORT:-9000}"
HOST="${WEBHOOK_HOST:-0.0.0.0}"

if [[ -f "${APP_DIR}/shared/deploy.env" ]]; then
  # shellcheck disable=SC1091
  source "${APP_DIR}/shared/deploy.env"
fi

SECRET="${WEBHOOK_SECRET:-}"
if [[ -z "$SECRET" ]]; then
  echo "WEBHOOK_SECRET not set in ${APP_DIR}/shared/deploy.env" >&2
  exit 1
fi

echo "Portfolio webhook listening on ${HOST}:${PORT}"

# Busybox/nc-style loop using bash /dev/tcp is fragile; use python3 if available.
if command -v python3 >/dev/null 2>&1; then
  export APP_DIR PORT HOST SECRET
  exec python3 - <<'PY'
import hmac, os, subprocess, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

APP_DIR = os.environ["APP_DIR"]
SECRET = os.environ["SECRET"].encode()
PORT = int(os.environ["PORT"])
HOST = os.environ["HOST"]

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))

    def _unauthorized(self):
        self.send_response(401)
        self.end_headers()
        self.wfile.write(b"unauthorized\n")

    def _ok(self, body=b"ok\n"):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path in ("/health", "/hooks/health"):
            self._ok(b"healthy\n")
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path not in ("/hooks/deploy", "/deploy"):
            self.send_response(404)
            self.end_headers()
            return
        provided = self.headers.get("X-Deploy-Secret", "")
        if not hmac.compare_digest(provided, SECRET.decode()):
            self._unauthorized()
            return
        length = int(self.headers.get("Content-Length", 0))
        if length:
            self.rfile.read(length)

        def run():
            env = os.environ.copy()
            env["APP_DIR"] = APP_DIR
            subprocess.run(
                ["/usr/local/bin/portfolio-auto-update"],
                env=env,
                check=False,
            )

        threading.Thread(target=run, daemon=True).start()
        self._ok(b"deploy started\n")

ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
PY
fi

echo "python3 required for webhook server" >&2
exit 1
