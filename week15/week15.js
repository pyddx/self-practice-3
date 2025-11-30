// // # สร้างโฟลเดอร์
mkdir -p nginx/ssl

// // # สร้าง self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout front/nginx/ssl/private.key \
  -out front/nginx/ssl/certificate.crt \
  -subj "/C=TH/ST=Bangkok/L=Bangkok/O=KMUTT/CN=ip25or3.sit.kmutt.ac.th"

//docker-compose.yml เพิ่ม mount SSL
web:
    image: nginx
    container_name: intproj25_web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./front/web/dist/:/var/www/html/
      - ./front/default:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl:/etc/nginx/ssl:ro  # ⭐ เพิ่มบรรทัดนี้
    depends_on:
      - back
    networks:
      - myNetwork

// front-web/default (เพิ่ม HTTPS server block)
# Redirect HTTP to HTTPS
server {
    listen 80 default_server;
    server_name ip25or3.sit.kmutt.ac.th;
    
    # Redirect ทุก request ไป HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name ip25or3.sit.kmutt.ac.th;

    # SSL Certificate
    ssl_certificate /etc/nginx/ssl/certificate.crt;
    ssl_certificate_key /etc/nginx/ssl/private.key;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    location / {
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "*" always;
        add_header Access-Control-Allow-Headers "*" always;

        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "*";
            add_header Access-Control-Allow-Headers "*";
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }

        try_files $uri $uri/ =404;
    }
    
    location /intproj25/or3/itb-ecors/keycloak/ {
        proxy_pass https://bscit.sit.kmutt.ac.th/intproj25/ft/keycloak/;
        proxy_set_header Host bscit.sit.kmutt.ac.th;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "*" always;
        add_header Access-Control-Allow-Headers "*" always;
    }

    location /intproj25/or3/itb-ecors/ {
        alias /var/www/html/;
        add_header Access-Control-Allow-Origin *;
        try_files $uri $uri/ =404;
    }	

    location /intproj25/or3/itb-ecors/api/v1/ {
        proxy_pass http://back:3000/itb-ecors/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header Access-Control-Allow-Origin *;
    }
}

// แก้ไข front-web/keycloak-auth.js (เปลี่ยน HTTP → HTTPS)
const BASE_URL = 'https://bscit.sit.kmutt.ac.th/intproj25/or3/itb-ecors/';  // ⭐ เปลี่ยนเป็น https

// แก้ไข front-web/reserve.js (เปลี่ยน HTTP → HTTPS)
const API_BASE_URL = 'https://bscit.sit.kmutt.ac.th/intproj25/or3/itb-ecors/api/v1';
const BASE_URL = 'https://bscit.sit.kmutt.ac.th/intproj25/or3/itb-ecors/';