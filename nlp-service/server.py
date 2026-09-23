import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from nlp_engine import NLPEvaluator

PORT = int(os.environ.get("PORT", 8081))

class NLPRequestHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            resp = {
                "status": "UP",
                "service": "Python NLP Feedback Engine",
                "port": PORT,
                "features": [
                    "Technical Terminology Analysis",
                    "Complexity Big-O Extraction",
                    "STAR Method Structural Coherence",
                    "Verbal Filler & Fluency Detection",
                    "Actionable Interview Guidance"
                ]
            }
            self.wfile.write(json.dumps(resp).encode("utf-8"))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"error": "Route not found"}')

    def do_POST(self):
        if self.path == "/nlp/evaluate":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body) if body else {}
                transcript = data.get("transcript", "")
                problem_context = data.get("problemContext", "")
                code = data.get("code", "")
                time_taken = data.get("timeTakenSeconds", 0)

                result = NLPEvaluator.evaluate(
                    transcript=transcript,
                    problem_context=problem_context,
                    code=code,
                    time_taken_seconds=time_taken
                )

                self.send_response(200)
                self._send_cors_headers()
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(result).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self._send_cors_headers()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"error": "Route not found"}')

    def log_message(self, format, *args):
        # Override to suppress noisy default console logging
        sys.stdout.write(f"[NLP-Service] {self.address_string()} - {format%args}\n")
        sys.stdout.flush()

def run():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, NLPRequestHandler)
    print("=================================================")
    print(f"  Python NLP Feedback Engine Running on Port {PORT}")
    print("  Communication Scorer: Active")
    print("  STAR Method & Big-O Analyzer: Active")
    print("=================================================")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
