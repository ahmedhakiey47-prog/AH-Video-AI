# AH Video AI

نسخة أولية لموقع توليد فيديو بالذكاء الاصطناعي.

## التشغيل
1. ثبّت Node.js 20 أو أحدث.
2. افتح المجلد في Terminal.
3. نفّذ:
   npm install
4. انسخ `.env.example` إلى `.env`.
5. ضع بيانات Higgsfield API في:
   HF_CREDENTIALS=KEY_ID:KEY_SECRET
6. شغّل:
   npm start
7. افتح:
   http://localhost:3000

مهم: لا تضع مفتاح API داخل ملفات `public` أو داخل JavaScript الذي يصل للمتصفح.
