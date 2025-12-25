# Quick Start Guide

## Current Status
- ✅ Frontend is running at http://localhost:5173
- ⏳ Backend needs to be started

## Next Steps

### 1. Set Up Backend API Keys

Edit the backend `.env` file and add your API keys:

```bash
cd /Users/thasanee/Documents/study/Projecct/sleep-story-app/backend
```

Open `.env` and replace with your actual keys:
- Get OpenAI key from: https://platform.openai.com/api-keys
- Get Anthropic key from: https://console.anthropic.com/ (optional)

### 2. Start the Backend

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # On Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

Backend will start at http://localhost:8000

### 3. Open the App

With both servers running, open your browser to:
**http://localhost:5173**

## Test the Application

1. Select your preferences (mood, theme, style, etc.)
2. Click "Generate Story"
3. Wait for the AI to create your personalized bedtime story
4. Try the features:
   - 🔊 Read Aloud (text-to-speech)
   - 🎵 Background Music toggle
   - ⭐ Save to Favorites
   - Switch to "Favorites" tab to see saved stories

## Troubleshooting

**If stories won't generate:**
- Make sure you added valid API keys to `backend/.env`
- Check that the backend is running (should show "Application startup complete")
- Look for error messages in the terminal

**If frontend can't connect:**
- Ensure backend is running on port 8000
- Check that no firewall is blocking the connection

## Architecture

```
Frontend (React)          Backend (FastAPI)
http://localhost:5173 --> http://localhost:8000 --> Claude/OpenAI APIs
     └─ User Interface    └─ Story Generation
```

Enjoy your calming sleep stories! 😴✨
