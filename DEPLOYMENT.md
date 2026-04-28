Deployment and Nginx proxy example

This file shows a minimal Nginx reverse-proxy setup to deploy the client and proxy `/api` requests to the backend server running on localhost:4000.

Example Nginx server block:

```
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Serve static client (built Vite app) from /var/www/celebrationhub
    root /var/www/celebrationhub;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Optional: serve static assets under /assets (if needed)
    location /assets/ {
        alias /var/www/celebrationhub/assets/;
    }

    # Recommended: enable HTTPS (Let's Encrypt / certbot)
}
```

Notes:

- If you proxy `/api` to `http://127.0.0.1:4000`, your client can use `/api/v1/...` as the API URL (same origin), avoiding CORS notices.
- If you host client and API on separate subdomains (e.g., `app.yourdomain.com` and `api.yourdomain.com`) ensure `CLIENT_ORIGIN` and CORS allowed origins are set accordingly on the server.
