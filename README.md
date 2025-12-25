# AI Sleep Story Generator

A full-stack web application that generates personalized bedtime stories using AI to help users relax and fall asleep peacefully.

## Features

- **AI-Powered Story Generation**: Utilizes Claude AI (with OpenAI fallback) to create calming, personalized bedtime stories
- **Customization Options**: Choose mood, theme, style, perspective, and length
- **Text-to-Speech**: Listen to your stories with built-in audio playback
- **Save Favorites**: Store and replay your favorite stories
- **Background Music**: Optional ambient music for enhanced relaxation
- **Beautiful UI**: Modern, calming design optimized for bedtime use

## Tech Stack

### Backend
- FastAPI (Python web framework)
- Anthropic Claude API
- OpenAI GPT-4 API
- Pydantic for data validation

### Frontend
- React 18
- Vite (build tool)
- Modern CSS with gradient backgrounds
- Browser Speech Synthesis API

---

## Quick Start

### Prerequisites
- Python 3.8+ (you have Python 3.13)
- Node.js 20+ (you have Node.js 20.2.0)
- OpenAI API Key (required) - Get from https://platform.openai.com/api-keys
- Anthropic API Key (optional) - Get from https://console.anthropic.com/

### 1. Clone or Navigate to Project

```bash
cd sleep-story-app
```

### 2. Backend Setup (First Time Only)

The virtual environment and dependencies are already set up. Just add your API key:

```bash
cd backend
nano .env  # or use any text editor
```

Edit the `.env` file and replace the placeholder:
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
ANTHROPIC_API_KEY=your_anthropic_api_key_here  # optional
```

Save and exit.

### 3. Frontend Setup (First Time Only)

Dependencies are already installed. Skip to running!

---

## Running the Application

You need **TWO terminal windows** running simultaneously.

### Terminal 1: Start Backend

```bash
cd sleep-story-app/backend
source venv/bin/activate
python main.py
```

**Expected output:**
```
INFO:     Started server process [xxxxx]
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

✅ Backend is now running on **http://localhost:8000**

### Terminal 2: Start Frontend

Open a **new terminal window** and run:

```bash
cd sleep-story-app/frontend
npm run dev
```

**Expected output:**
```
VITE v5.2.0  ready in 302 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ Frontend is now running on **http://localhost:5173** (or 5174)

### 4. Open in Browser

Open your browser and go to:
- **http://localhost:5173** (or whatever port Vite shows)

You should see the AI Sleep Story Generator interface!

---

## Using the App

1. **Select Your Preferences**:
   - Choose your current mood (anxious, peaceful, grateful, etc.)
   - Pick a theme (nature, cozy home, spiritual healing, etc.)
   - Select a narrative style (simple, poetic, guided visualization)
   - Choose perspective (second person recommended)
   - Set desired length (short, medium, long)

2. **Generate Story**: Click the "Generate Story" button

3. **Enjoy Your Story**:
   - Read the generated story
   - Use "🔊 Read Aloud" for text-to-speech narration
   - Enable "🎵 Play Music" for background ambiance
   - Click "⭐ Save Favorite" to save stories you love

4. **Access Favorites**: Switch to the "Favorites" tab to replay saved stories

---

## Stopping the Servers

To stop the application:
- Press `Ctrl+C` in the **backend terminal**
- Press `Ctrl+C` in the **frontend terminal**

---

## Troubleshooting

### Story generation fails with "Both AI providers failed"
**Solution**: You need to add a valid API key to `backend/.env` and restart the backend server.

```bash
# Edit the .env file
cd backend
nano .env

# Add your key, then restart
source venv/bin/activate
python main.py
```

### Frontend shows CORS error
**Solution**: Make sure the backend is running first, then start the frontend. The backend must be on port 8000.

### Port already in use
**Solution**:
- Backend: Kill the process using port 8000: `lsof -i :8000` then `kill -9 <PID>`
- Frontend: Vite will automatically use the next available port (5174, 5175, etc.)

### "Command not found: python"
**Solution**: Try `python3` instead of `python`

### Dependencies not installed
**Backend**:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend**:
```bash
cd frontend
npm install
```

---

## API Endpoints

### Backend API (http://localhost:8000)

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/options` - Get customization options
- `POST /api/generate` - Generate a sleep story

**Example Request:**
```json
POST http://localhost:8000/api/generate
{
  "mood": "peaceful",
  "theme": "nature",
  "style": "very_simple",
  "perspective": "second_person",
  "length": "medium"
}
```

**Example Response:**
```json
{
  "story": "Your generated story text...",
  "provider": "claude",
  "timestamp": "2025-12-24T18:30:00"
}
```

---

## Project Structure

```
sleep-story-app/
├── backend/                 # FastAPI backend
│   ├── main.py             # API endpoints
│   ├── ai_service.py       # AI story generation logic
│   ├── models.py           # Pydantic models
│   ├── config.py           # Configuration
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # API keys (you need to add these!)
│   └── venv/              # Python virtual environment
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   └── App.css        # Styling
│   ├── package.json       # Node dependencies
│   └── node_modules/      # Installed packages
│
├── README.md              # This file
├── HOW_TO_RUN.md         # Quick start guide
└── start.sh              # Startup script (optional)
```

---

## AI Provider Fallback Logic

The application tries to use Claude AI first for story generation. If Claude is unavailable or the API key is not configured, it automatically falls back to OpenAI's GPT-4. This ensures reliable story generation even if one provider is down.

You need **at least one API key** (OpenAI or Anthropic) for the app to work.

---

## Development

### Making Changes

**Backend**:
- Edit files in `backend/`
- Restart the server (Ctrl+C, then `python main.py`)

**Frontend**:
- Edit files in `frontend/src/`
- Vite will automatically hot-reload your changes

### Adding New Features

1. **New API endpoint**: Add to `backend/main.py`
2. **New UI component**: Edit `frontend/src/App.jsx`
3. **New styling**: Edit `frontend/src/App.css`

---

## License

MIT License - feel free to use and modify for your own projects.

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review `HOW_TO_RUN.md` for detailed instructions
- Make sure both servers are running simultaneously

---

## Summary: How to Run

**Every time you want to use the app:**

1. **Terminal 1**: `cd sleep-story-app/backend && source venv/bin/activate && python main.py`
2. **Terminal 2**: `cd sleep-story-app/frontend && npm run dev`
3. **Browser**: Open http://localhost:5173

**First time only**: Add your OpenAI API key to `backend/.env`

That's it! Enjoy creating peaceful sleep stories! 😴✨
