# AI Sleep Story Generator - Status

## ✅ Both Servers Are Running!

### Frontend
- **URL**: http://localhost:5173
- **Status**: Running
- **Framework**: React with Vite

### Backend API
- **URL**: http://localhost:8000
- **Status**: Running
- **Framework**: FastAPI (Python)

## 🎯 Next Step: Add Your API Keys

To generate stories, you need to add at least ONE API key:

### Option 1: OpenAI (Recommended to start)
1. Get your API key from: https://platform.openai.com/api-keys
2. Edit `backend/.env`
3. Replace `your_openai_api_key_here` with your actual key

### Option 2: Anthropic Claude (Optional)
1. Get your API key from: https://console.anthropic.com/
2. Edit `backend/.env`
3. Replace `your_anthropic_api_key_here` with your actual key

## 🧪 Test the Application

1. Open http://localhost:5173 in your browser
2. You should see a beautiful dark interface with the title "AI Sleep Story Generator"
3. Currently, story generation will fail until you add an API key

### Once You Add an API Key:

1. Select your preferences:
   - Mood (peaceful, anxious, grateful, etc.)
   - Theme (nature, cozy home, etc.)
   - Style (very simple, poetic, etc.)
   - Perspective (second person recommended)
   - Length (short, medium, long)

2. Click "Generate Story"

3. Wait for the AI to create your story

4. Try the features:
   - 🔊 **Read Aloud**: Browser text-to-speech
   - 🎵 **Play Music**: Toggle background music indicator
   - ⭐ **Save Favorite**: Save story to local storage
   - **Favorites Tab**: View and reload saved stories

## 📝 Project Structure

```
sleep-story-app/
├── backend/          (Running on :8000)
│   ├── main.py       API endpoints
│   ├── ai_service.py  AI integration
│   ├── .env          ⚠️ ADD YOUR API KEYS HERE
│   └── ...
└── frontend/         (Running on :5173)
    └── src/
        ├── App.jsx   Main UI component
        └── App.css   Styling
```

## 🛠 Troubleshooting

### If story generation fails:
- Check that you added a valid API key to `backend/.env`
- Look at the terminal running the backend for error messages
- Verify you have API credits/quota available

### If frontend can't connect:
- Make sure both servers are running
- Check browser console for errors (F12)
- Verify CORS is not blocking (already configured)

### To restart servers:

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

## 🎉 Features Implemented

- ✅ AI story generation with Claude/OpenAI
- ✅ Customizable story parameters (5 options)
- ✅ Text-to-speech audio playback
- ✅ Save favorite stories (localStorage)
- ✅ Beautiful dark-themed UI
- ✅ Background music toggle
- ✅ Automatic AI provider fallback

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - Setup guide

Enjoy creating peaceful sleep stories! 😴✨
