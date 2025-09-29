# Ink & Wall Co. — Ready-to-Deploy Site

This package includes your full website, images, and Netlify function.
Follow these steps to put it on GitHub and connect to Netlify.

## Files
See the structure below:
- index.html — main page (uses images/logo.png, includes gallery grid)
- style.css — styles (includes mobile spacing + gallery)
- thankyou.html — post-form page
- favicon.png — generated from your logo
- images/ — logo + 4 placeholder gallery images
- netlify.toml — Netlify config
- netlify/functions/auto-reply.js — SendGrid autoresponder

## Upload to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Ink & Wall Co."
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inkandwall-site.git
git push -u origin main
```

## Connect Netlify to GitHub
1. Netlify → Add new site → Import an existing project
2. Choose GitHub and select your repo
3. Build command: (leave empty)
4. Publish directory: .
5. Deploy

## Enable Autoresponder
Set environment variables in Netlify:
- SENDGRID_API_KEY
- REPLY_FROM (e.g. hello@inkandwall.co)
- REPLY_NAME (Ink & Wall Co.)
- BCC_EMAIL (optional)

That’s it—push updates to GitHub and Netlify will auto-deploy.
