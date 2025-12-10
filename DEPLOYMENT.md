# Deployment Guide

## Current Setup

Your Flask application is deployed on **AWS Lightsail** using:
- **Jenkins** for CI/CD pipeline
- **Nginx** as reverse proxy
- **Systemd** for service management

## Deployment Process

### Manual Deployment (Current Method)

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Trigger Jenkins Pipeline:**
   - Log into your Jenkins server (usually at `http://your-lightsail-ip:8080` or your Jenkins URL)
   - Find your Flask deployment pipeline job
   - Click **"Build Now"** or **"Build with Parameters"**
   - Wait for the pipeline to complete (usually 2-5 minutes)

3. **Verify Deployment:**
   - Check Jenkins console output for success
   - Visit `https://zanganehai.com` and verify changes are live
   - Clear browser cache if needed (Ctrl+Shift+R or Cmd+Shift+R)

### What the Jenkins Pipeline Does

1. **Checkout** - Pulls latest code from GitHub
2. **Backup** - Creates backup of current deployment
3. **Stop Service** - Stops Flask service
4. **Update Code** - Copies new files to `/home/ubuntu/flask_ml_website`
5. **Install Dependencies** - Updates Python packages
6. **Database Migration** - Runs database migrations
7. **Run Tests** - Performs health check
8. **Start Service** - Restarts Flask service
9. **Verify** - Confirms service is running

## Setting Up Automatic Deployment

### Option 1: GitHub Webhook (Recommended)

1. **In Jenkins:**
   - Go to your pipeline job → **Configure**
   - Under **"Build Triggers"**, check **"GitHub hook trigger for GITScm polling"**
   - Save

2. **In GitHub:**
   - Go to your repository → **Settings** → **Webhooks**
   - Click **"Add webhook"**
   - Payload URL: `http://your-jenkins-ip:8080/github-webhook/`
   - Content type: `application/json`
   - Events: Select **"Just the push event"**
   - Save

Now every push to `main` branch will automatically trigger deployment.

### Option 2: Polling SCM

1. **In Jenkins:**
   - Go to your pipeline job → **Configure**
   - Under **"Build Triggers"**, check **"Poll SCM"**
   - Schedule: `H/5 * * * *` (checks every 5 minutes)
   - Save

## Troubleshooting

### Changes Not Appearing on Production

1. **Check if Jenkins pipeline ran:**
   - Log into Jenkins and check build history
   - Look for recent builds after your git push

2. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or use incognito/private browsing mode

3. **Check Nginx cache:**
   - SSH into your Lightsail instance
   - Check Nginx cache settings (usually in `/etc/nginx/nginx.conf`)
   - Restart Nginx: `sudo systemctl restart nginx`

4. **Verify files on server:**
   ```bash
   ssh ubuntu@your-lightsail-ip
   ls -la /home/ubuntu/flask_ml_website/templates/tutorials/rag/
   # Check if your updated files are there
   ```

5. **Check Flask service status:**
   ```bash
   sudo systemctl status flask-ml
   sudo journalctl -u flask-ml -n 50  # View recent logs
   ```

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
- [ ] Jenkins pipeline triggered and completed successfully
- [ ] Flask service is running (`sudo systemctl status flask-ml`)
- [ ] Nginx is running (`sudo systemctl status nginx`)
- [ ] Changes visible on production (clear cache if needed)
- [ ] No errors in logs (`sudo journalctl -u flask-ml`)

## Server Access

- **SSH:** `ssh ubuntu@your-lightsail-ip`
- **Jenkins:** `http://your-lightsail-ip:8080` (or your Jenkins URL)
- **Production URL:** `https://zanganehai.com`

## Notes

- The Jenkins pipeline automatically backs up the previous version before deploying
- If deployment fails, the pipeline will attempt to rollback to the backup
- Keep only the last 3 backups (older ones are automatically cleaned up)
