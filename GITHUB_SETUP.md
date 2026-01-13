# 🚀 GitHub Setup & Deployment Instructions

This guide will help you upload your Family Tree website to GitHub and publish it using GitHub Pages (free website hosting).

## 📋 Prerequisites

1. **GitHub Account**: If you don't have one, sign up at [github.com](https://github.com)
2. **Git**: Already installed (we just used it!)

---

## 📤 Step 1: Create a New Repository on GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `family-tree` (or any name you like)
   - **Description**: "Interactive Family Tree Website" (optional)
   - **Visibility**: Choose **Public** (required for free GitHub Pages) or **Private** (you can still use Pages, but it requires GitHub Pro)
   - **DO NOT** check "Initialize this repository with a README" (we already have files)
5. Click **"Create repository"**

---

## 🔗 Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

### Option A: Using HTTPS (Easier for beginners)

1. Open PowerShell or Command Prompt in your project folder:
   ```
   cd "C:\Users\e0775081\Downloads\Family Tree"
   ```

2. Copy the repository URL from GitHub (it looks like: `https://github.com/YOUR-USERNAME/family-tree.git`)

3. Add the remote repository:
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/family-tree.git
   ```
   *(Replace YOUR-USERNAME with your actual GitHub username)*

4. Push your code to GitHub:
   ```powershell
   git branch -M main
   git push -u origin main
   ```

5. **Enter your GitHub credentials** when prompted:
   - Username: Your GitHub username
   - Password: Use a **Personal Access Token** (see below if you get an error)

### Option B: Using GitHub Desktop (Easiest GUI method)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in with your GitHub account
3. Click **"File" → "Add Local Repository"**
4. Navigate to: `C:\Users\e0775081\Downloads\Family Tree`
5. Click **"Publish repository"**
6. Enter repository name and click **"Publish Repository"**

---

## 🔑 Personal Access Token (if password doesn't work)

GitHub requires a Personal Access Token instead of your password:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Give it a name like "Family Tree Project"
4. Select scope: **repo** (check the box)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

---

## 🌐 Step 3: Enable GitHub Pages

Once your code is on GitHub:

1. Go to your repository on GitHub
2. Click on **"Settings"** tab (top menu)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - Branch: **main** (or **master** if that's your branch)
   - Folder: **/ (root)**
5. Click **"Save"**
6. Wait 1-2 minutes for GitHub to build your site
7. Your website will be available at:
   ```
   https://YOUR-USERNAME.github.io/family-tree/
   ```
   *(Replace YOUR-USERNAME with your GitHub username)*

---

## ✅ Step 4: Verify Your Website is Live

1. GitHub will show you the website URL in the Pages settings
2. Click the link or copy it to your browser
3. Your Family Tree website should load!
4. **Note**: It may take 1-5 minutes after enabling Pages for the site to be available

---

## 🔄 Step 5: Updating Your Website (Future Changes)

Whenever you make changes to your website:

1. Make your changes to files (edit HTML, CSS, JS, add images, etc.)
2. Commit the changes:
   ```powershell
   git add .
   git commit -m "Description of your changes"
   ```
3. Push to GitHub:
   ```powershell
   git push
   ```
4. Your website will automatically update on GitHub Pages (usually within 1-2 minutes)

---

## 📝 Quick Command Reference

```powershell
# Navigate to your project
cd "C:\Users\e0775081\Downloads\Family Tree"

# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes (if working from multiple computers)
git pull
```

---

## 🎯 Tips & Troubleshooting

### ✅ **Images not showing?**
- Make sure all images are in the `Family pics` folder
- Check that image paths in `script.js` match the actual filenames
- GitHub Pages is case-sensitive, so "Family pics" (with space) should match exactly

### ✅ **Website not updating?**
- Wait 2-3 minutes after pushing
- Clear your browser cache (Ctrl + F5)
- Check GitHub repository → Actions tab for build errors

### ✅ **Want a custom domain?**
- GitHub Pages supports custom domains
- In Pages settings, add your custom domain
- Update your DNS records as instructed

### ✅ **Repository is private?**
- Free GitHub accounts get unlimited private repositories
- GitHub Pages works with private repos if you have GitHub Pro
- Or make the repo public (it's just code and images, no sensitive data)

---

## 🎉 You're Done!

Your Family Tree website is now:
- ✅ Stored safely on GitHub
- ✅ Hosted for free on GitHub Pages
- ✅ Accessible to anyone with the URL
- ✅ Easy to update by just pushing changes

**Enjoy sharing your family tree! 🌳👨‍👩‍👧‍👦**

---

## 📞 Need Help?

- GitHub Docs: [docs.github.com](https://docs.github.com)
- GitHub Pages Guide: [pages.github.com](https://pages.github.com)
- GitHub Support: [support.github.com](https://support.github.com)

