#!/usr/bin/env python3
"""
هم‌مسیر (HamMasir) - Standalone Backend Server & REST API
Zero external dependencies, runs using Python standard library.
Provides:
  1. Static file serving (HTML, CSS, JS)
  2. REST API endpoints:
     - POST /api/generate-roadmap
     - POST /api/diagnose-and-replan
     - GET  /api/health
"""

import json
import os
import sys
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

PORT = int(os.environ.get("PORT", 8085))
WEB_ROOT = os.path.dirname(os.path.abspath(__file__))


class HamMasirHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_ROOT, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self._send_json({"status": "ok", "app": "HamMasir", "version": "1.0.0"})
            return
        
        # Default static file handler
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_length)

        try:
            data = json.loads(post_body.decode("utf-8")) if post_body else {}
        except json.JSONDecodeError:
            self._send_json({"error": "Invalid JSON payload"}, status=HTTPStatus.BAD_REQUEST)
            return

        if parsed.path == "/api/generate-roadmap":
            response = self._handle_generate_roadmap(data)
            self._send_json(response)
        elif parsed.path == "/api/diagnose-and-replan":
            response = self._handle_replan(data)
            self._send_json(response)
        else:
            self._send_json({"error": "Endpoint not found"}, status=HTTPStatus.NOT_FOUND)

    def _handle_generate_roadmap(self, data):
        goal = data.get("goal", "پیشرفت شخصی و کاری")
        timeframe = data.get("timeframe", 60)
        daily_hours = data.get("daily_hours", 2)
        buffer_days = data.get("buffer_days", 2)

        return {
            "success": True,
            "version": 1.0,
            "goal": goal,
            "timeframe": timeframe,
            "daily_hours": daily_hours,
            "buffer_days": buffer_days,
            "message": "نقشه راه با موفقیت تولید شد و روزهای ضربه‌گیر لحاظ شدند.",
            "buffer_strategy": f"{buffer_days} روز در هفته به عنوان بافر برای جلوگیری از فرسودگی ذخیره شد."
        }

    def _handle_replan(self, data):
        reason = data.get("reason", "burnout")
        note = data.get("note", "")

        responses = {
            "burnout": {
                "headline": "تشخیص فرسودگی ذهنی و خستگی (Burnout)",
                "strategy": "تزریق فاز ریکاوری و کاهش بار شناختی به وظایف ۱۵ دقیقه‌ای",
                "buffer_action": "فعال‌سازی ۲ روز استراحت مطلق"
            },
            "ambiguity": {
                "headline": "تشخیص ابهام و بزرگی بیش از حد تسک",
                "strategy": "شکستن وظیفه جاری به ۳ ریزگام ۵ دقیقه‌ای فوق‌شفاف",
                "buffer_action": "حذف مقاومت ذهنی با گام‌های بدون زحمت"
            },
            "life_event": {
                "headline": "تشخیص رخدادهای پیش‌بینی‌نشده زندگی",
                "strategy": "به‌کارگیری ذخیره روزهای ضربه‌گیر و تمدید مهلت بدون حس عقب‌ماندگی",
                "buffer_action": "شیفت زمانی ۳ روزه بدون تغییر هدف نهایی"
            },
            "time_estimate": {
                "headline": "تشخیص خطای تخمین زمان و حجم کار",
                "strategy": "افزایش ضریب تخمین به ۱.۴ برابر برای آرامش کاربر",
                "buffer_action": "هموارسازی بار وظایف روزانه"
            }
        }

        resolution = responses.get(reason, responses["burnout"])

        return {
            "success": True,
            "new_version": 1.1,
            "resolution": resolution,
            "compassionate_message": "هیچ تقصیری متوجه شما نیست؛ مسیر مطابق شرایط واقعی شما بازطراحی شد."
        }

    def _send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)


def run_server():
    server_address = ("127.0.0.1", PORT)
    httpd = ThreadingHTTPServer(server_address, HamMasirHandler)
    print(f"=====================================================")
    print(f"🚀 سرور هم‌مسیر (HamMasir) با موفقیت اجرا شد:")
    print(f"🔗 آدرس دسترسی در مرورگر: http://127.0.0.1:{PORT}")
    print(f"📁 پوشه برنامه: {WEB_ROOT}")
    print(f"=====================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nسرور متوقف شد.")
        httpd.server_close()


if __name__ == "__main__":
    run_server()
