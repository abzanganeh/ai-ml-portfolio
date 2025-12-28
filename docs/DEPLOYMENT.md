# Deployment Guide

## Current Setup

Your Flask application is deployed on **AWS Lightsail** using:
- **GitHub Actions** for CI/CD pipeline
- **Nginx** as reverse proxy
- **Systemd** for service management

## Deployment Process

### Automatic Deployment

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **GitHub Actions automatically:**
   - Triggers on push to `main` branch
   - Runs tests (Playwright)
   - Deploys to production server
   - Restarts Flask service

3. **Verify Deployment:**
   - Check GitHub Actions tab for workflow status
   - Visit `https://zanganehai.com` and verify changes are live
   - **Important:** Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R) or use incognito mode

### What the GitHub Actions Workflow Does

1. **Checkout** - Pulls latest code from GitHub
2. **Run Tests** - Executes Playwright tests
3. **Deploy** - Syncs files to Lightsail server
4. **Install Dependencies** - Updates Python packages (if needed)
5. **Restart Service** - Restarts Flask service
6. **Verify** - Confirms service is running

## Troubleshooting

### Changes Not Appearing on Production

1. **Check if GitHub Actions workflow ran:**
   - Go to your repository → **Actions** tab
   - Look for recent workflow runs after your git push
   - Check if the workflow completed successfully (green checkmark)
   - If it failed (red X), click on it to see error details

2. **Clear browser cache (Most Common Issue):**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or use incognito/private browsing mode to test
   - Clear site data: Browser Settings → Clear browsing data → Cached images and files

3. **Check Nginx cache:**
   - SSH into your Lightsail instance
   - Check Nginx cache settings (usually in `/etc/nginx/nginx.conf` or `/etc/nginx/sites-available/`)
   - Clear Nginx cache if configured: `sudo rm -rf /var/cache/nginx/*`
   - Restart Nginx: `sudo systemctl restart nginx`

4. **Verify files on server:**
   ```bash
   ssh ubuntu@your-lightsail-ip
   ls -la /home/ubuntu/flask_ml_website/templates/tutorials/rag/
   # Check if your updated files are there with recent timestamps
   cat /home/ubuntu/flask_ml_website/templates/tutorials/rag/chapter1.html | grep "rag.css"
   # Should show: ?v=3 (cache busting version)
   ```

5. **Check Flask service status:**
   ```bash
   sudo systemctl status flask-ml
   sudo journalctl -u flask-ml -n 50  # View recent logs
   sudo systemctl restart flask-ml    # Restart if needed
   ```

6. **Check static file serving:**
   - Static files (CSS/JS) now have cache-busting version parameters (`?v=2`, `?v=3`)
   - If you see old content, the browser is likely caching
   - Try accessing directly: `https://zanganehai.com/static/css/tutorials/rag/rag.css?v=3`

### Service Not Starting

```bash
# Check service status
sudo systemctl status flask-ml

# View error logs
sudo journalctl -u flask-ml -n 100

# Restart service manually
sudo systemctl restart flask-ml
```

### Permission Issues

```bash
# Fix file permissions
sudo chown -R ubuntu:www-data /home/ubuntu/flask_ml_website
sudo chmod -R 755 /home/ubuntu/flask_ml_website
```

## Cache Busting

Static files (CSS, JS) now include version parameters to prevent browser caching:
- CSS: `?v=2`
- JS: `?v=2`

When you update static files, increment the version number in templates.

## Quick Deployment Checklist

- [ ] Code pushed to GitHub `main` branch
- [ ] GitHub Actions "Deploy to Lightsail" workflow triggered
- [ ] Deployment workflow completed successfully (green checkmark)
- [ ] Flask service is running (`sudo systemctl status flask-ml`)
- [ ] Nginx is running (`sudo systemctl status nginx`)
- [ ] Changes visible on production (clear cache if needed)
- [ ] No errors in logs (`sudo journalctl -u flask-ml`)

## Alternative: Manual Deployment

If GitHub Actions is not configured, you can deploy manually:

```bash
# 1. SSH into Lightsail
ssh ubuntu@your-lightsail-ip

# 2. Navigate to app directory
cd /home/ubuntu/flask_ml_website

# 3. Pull latest changes
git pull origin main

# 4. Activate virtual environment
source flask_env/bin/activate  # or: source venv/bin/activate

# 5. Install dependencies
pip install -r requirements.txt

# 6. Run database migrations
python3 -c "from app import app, db; app.app_context().push(); db.create_all()"

# 7. Restart Flask service
sudo systemctl restart flask-ml

# 8. Verify service is running
sudo systemctl status flask-ml
```

## Server Access

- **SSH:** `ssh ubuntu@your-lightsail-ip`
- **GitHub Actions:** Repository → **Actions** tab
- **Production URL:** `https://zanganehai.com`

## Cache Busting

Static files (CSS, JS) now include version parameters to prevent browser caching:
- CSS: `?v=2` or `?v=3`
- JS: `?v=2`

When you update static files, increment the version number in templates. This forces browsers to fetch the new version instead of using cached files.

## Notes

- **GitHub Actions** automatically runs on every push to `main` branch
- The deployment workflow creates automatic backups before updating
- If deployment fails, check the Actions tab for error details
- Browser caching is the most common reason changes don't appear immediately
- **Jenkins** (jenkinsfile) is available as an alternative deployment method if you have Jenkins set up on your Lightsail server

## Setting Up GitHub Actions Deployment (First Time)

If you haven't set up automatic deployment yet:

1. **Generate SSH key pair** (if you don't have one):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"
   # Save as: ~/.ssh/github_actions_deploy
   ```

2. **Add public key to Lightsail:**
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions_deploy.pub ubuntu@your-lightsail-ip
   ```

3. **Add secrets to GitHub:**
   - Go to: https://github.com/abzanganeh/flask_ml_website/settings/secrets/actions
   - Click "New repository secret"
   - Add `LIGHTSAIL_SSH_KEY`: Copy content of `~/.ssh/github_actions_deploy` (private key)
   - Add `LIGHTSAIL_HOST`: Your Lightsail IP address (e.g., `3.123.45.67`)

4. **Test deployment:**
   ```bash
   git push origin main
   # Check GitHub Actions tab to see deployment workflow run
   ```
