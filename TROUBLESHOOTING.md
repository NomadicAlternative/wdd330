# 🔧 Troubleshooting Guide - SleepOutside Project

## Common Issues and Solutions

### ❌ Products not loading / Categories not working

**Problem:** When clicking on categories, products don't load.

**Cause:** Missing `.env` file with backend API configuration.

**Solution:**
```bash
# Run the setup command
npm run setup

# Or manually copy the sample file
cp .env.sample .env
```

---

### ❌ "VITE_SERVER_URL is not configured" error

**Problem:** Console shows error about missing server URL.

**Cause:** `.env` file is missing or doesn't contain `VITE_SERVER_URL`.

**Solution:**
1. Create a `.env` file in the project root
2. Add the following line:
   ```
   VITE_SERVER_URL=https://wdd330-backend.onrender.com/
   ```

---

### ❌ Project works in production but not locally

**Problem:** The deployed site works fine, but local development doesn't.

**Cause:** The `.env` file is in `.gitignore` (correctly), so it's not tracked by git.

**Solution:**
- Always run `npm run setup` after cloning the repository
- The setup script will automatically create `.env` from `.env.sample`

---

### ℹ️ Why does this happen?

The `.env` file contains environment variables that should NOT be committed to git for security reasons. Each developer needs their own copy of this file locally.

**What's tracked in git:**
- ✅ `.env.sample` - Template file with example values
- ❌ `.env` - Your actual environment file (ignored by git)

**Automatic checks:**
- When you run `npm run start`, the `prestart` script automatically checks for `.env`
- When you run `npm run build`, the `prebuild` script automatically checks for `.env`

---

## Quick Setup for New Clones

After cloning this repository:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (creates .env from .env.sample)
npm run setup

# 3. Start development server
npm run start
```

---

## Environment Variables

### Required Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_SERVER_URL` | Backend API endpoint | `https://wdd330-backend.onrender.com/` |

---

## Additional Resources

- **Production Site:** [sleepoutsidediego.netlify.app](https://sleepoutsidediego.netlify.app)
- **Backend API:** https://wdd330-backend.onrender.com/
- **Course Materials:** https://byui-cse.github.io/wdd330-ww-course/

---

## Still Having Issues?

1. Check that `.env` exists: `ls -la .env`
2. Verify its contents: `cat .env`
3. Make sure it contains: `VITE_SERVER_URL=https://wdd330-backend.onrender.com/`
4. Restart the dev server: Stop (Ctrl+C) and run `npm run start` again

If issues persist, delete `.env` and run `npm run setup` to recreate it.
