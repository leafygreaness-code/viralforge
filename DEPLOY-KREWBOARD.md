# Deploy To `krewboard.com/viralforge`

This guide assumes:

- you have a Linux server or VPS already serving `krewboard.com`
- Nginx is installed
- Node.js is installed
- you have shell access to the server

## 1. Upload the backend

Copy the folder to the server, for example:

```bash
scp -r /Users/alexander/Documents/Playground/vivida-infra user@your-server:/var/www/vivida-infra
```

## 2. SSH into the server

```bash
ssh user@your-server
```

## 3. Install dependencies

```bash
cd /var/www/vivida-infra
cp .env.example .env
npm install
```

## 4. Edit `.env`

Use these values at minimum:

```bash
NODE_ENV=production
PORT=4000
API_BASE_URL=https://krewboard.com
API_PREFIX=/viralforge
DATABASE_URL=postgres://postgres:postgres@localhost:5432/vivida
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-me
WEBHOOK_SECRET=replace-me
```

## 5. Build the app

```bash
npm run build
```

## 6. Start it with PM2

Install PM2 if needed:

```bash
npm install -g pm2
```

Start the backend:

```bash
pm2 start dist/index.js --name vivida-backend
pm2 save
pm2 startup
```

## 7. Configure Nginx

Edit your site config and add:

```nginx
location /viralforge/ {
    proxy_pass http://127.0.0.1:4000/viralforge/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Then reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 8. Test it

Open:

- `https://krewboard.com/viralforge/`
- `https://krewboard.com/viralforge/health`

## 9. Connect Base44

In Base44, use:

```text
https://krewboard.com/viralforge/v1/projects
```

and the other `/v1/...` routes under the same prefix.

## What I still need from you if you want me to finish the live deploy

I need one of these:

- SSH access to the server
- hosting panel access
- Render/Railway/Fly credentials instead of self-hosting
- the current Nginx/site config if you want me to tailor the exact proxy block
