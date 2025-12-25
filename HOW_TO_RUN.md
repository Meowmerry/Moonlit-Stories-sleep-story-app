# How to Run the AI Sleep Story Generator

## Prerequisites
- Both backend and frontend need to run simultaneously
- Backend must have at least one API key configured

## Step 1: Add Your API Key (REQUIRED)

Before running, edit `backend/.env` and add at least one API key:

```bash
cd sleep-story-app/backend
nano .env
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Step 2: Choose Your Method

### Method A: Two Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd sleep-story-app/backend
source venv/bin/activate
python main.py
```
You should see: `Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 - Frontend:**
```bash
cd sleep-story-app/frontend
npm run dev
```
You should see: `Local: http://localhost:5173/` (or 5174)

### Method B: Single Command (Quick Start)

```bash
cd sleep-story-app
./start.sh
```

Press `Ctrl+C` to stop both servers.

## Step 3: Open the App

Open your browser to:
- **http://localhost:5173** (or http://localhost:5174)

## Verify It's Working

1. You should see a dark-themed interface with "AI Sleep Story Generator"
2. There should be dropdowns for Mood, Theme, Style, Perspective, and Length
3. Try generating a story by clicking "Generate Story"

## Troubleshooting

### Backend won't start
- Make sure you activated the virtual environment: `source venv/bin/activate`
- Check if port 8000 is already in use: `lsof -i :8000`
- Verify you installed dependencies: `pip install -r requirements.txt`

### Frontend won't start
- Make sure you installed dependencies: `npm install`
- Check if the port is already in use
- Vite will automatically use the next available port (5174, 5175, etc.)

### Story generation fails
- Check that you added a valid API key to `backend/.env`
- Look at the backend terminal for error messages
- Verify you have API credits available

### CORS errors
- Make sure the backend is running before opening the frontend
- Check that the port in the error message is listed in `backend/main.py` line 12

## Current Status

Right now you have:
- ✅ Backend running on port 8000
- ✅ Frontend should run on port 5173 or 5174

Both are already configured to work together!

## Stop the Servers

- Press `Ctrl+C` in each terminal
- Or if using start.sh, press `Ctrl+C` once
