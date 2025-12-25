# Dreamweaver Sleep Story App - Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Anthropic API key

## Deployment Steps

### Part 1: Deploy Backend (FastAPI)

1. **Push your code to GitHub**
   ```bash
   cd /Users/thasanee/Documents/study/Projecct/sleep-story-app
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR-USERNAME/sleep-story-app.git
   git push -u origin main
   ```

2. **Deploy Backend to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the `backend` directory as the root directory
   - Framework Preset: "Other"
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `pip install -r requirements.txt`

3. **Set Environment Variables for Backend**
   - In Vercel project settings → Environment Variables, add:
     - `ANTHROPIC_API_KEY` = `sk-ant-api03-hOsq6oSIl2HIEov...` (your key)
     - `OPENAI_API_KEY` = `your_openai_api_key_here` (optional)

4. **Deploy**
   - Click "Deploy"
   - Copy the deployed URL (e.g., `https://your-backend.vercel.app`)

### Part 2: Deploy Frontend (React + Vite)

1. **Deploy Frontend to Vercel**
   - Go to https://vercel.com/new
   - Import the same GitHub repository
   - Select the `frontend` directory as the root directory
   - Framework Preset: "Vite"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Set Environment Variables for Frontend**
   - In Vercel project settings → Environment Variables, add:
     - `VITE_API_URL` = `https://your-backend.vercel.app` (URL from step 1.4)

3. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-frontend.vercel.app`

## Alternative: Deploy as Monorepo

If you want both frontend and backend in one deployment:

1. Create `vercel.json` in the root directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    },
    {
      "src": "backend/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

2. Set `VITE_API_URL=/api` in frontend environment variables

## Testing Your Deployment

1. Visit your frontend URL
2. Try generating a sleep story
3. Test voice features (male/female, speed control)
4. Save a favorite story
5. Test word-by-word highlighting

## Troubleshooting

### CORS Errors
- Make sure backend allows frontend domain in CORS settings
- Update `main.py` to include your frontend URL:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend.vercel.app"  # Add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Key Not Working
- Verify environment variables are set correctly in Vercel dashboard
- Redeploy after adding environment variables

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json / requirements.txt

## Using Vercel CLI (Alternative Method)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   vercel --prod
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

## Environment Variables Summary

### Backend (.env)
```
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=your_key_here
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.vercel.app
```

## Post-Deployment

1. Update README with live demo link
2. Configure custom domain (optional) in Vercel settings
3. Enable automatic deployments from GitHub
4. Set up preview deployments for pull requests

## Features Working on Vercel

✅ AI Story Generation (Claude AI)
✅ Text-to-Speech
✅ Word-by-word highlighting
✅ Speed control (0.5x - 1.5x)
✅ Voice gender selection
✅ Favorites (localStorage)
✅ Responsive design

## Important Notes

- Vercel Free tier has serverless function timeout of 10 seconds
- For longer story generation, consider upgrading to Pro plan
- Backend cold starts may take 1-2 seconds on first request
- Static assets are cached globally on Vercel CDN

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

Happy deploying! 🚀✨
