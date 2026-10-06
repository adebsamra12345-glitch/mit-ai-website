FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev libpq-dev && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt


# Gunicorn acts as the production server

RUN pip install gunicorn
COPY . .
EXPOSE 8000
CMD ["sh", "-c", "mkdir -p \"$(dirname \"${DB_PATH:-/app/db.sqlite3}\")\" && python manage.py migrate --noinput && exec gunicorn --bind 0.0.0.0:8000 --timeout 60 mit_backend.wsgi:application"]
