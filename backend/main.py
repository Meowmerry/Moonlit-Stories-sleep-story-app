from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from models import StoryRequest, StoryResponse
from ai_service import ai_generator

app = FastAPI(title="AI Sleep Story Generator API")

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "AI Sleep Story Generator API",
        "version": "1.0.0",
        "endpoints": {
            "generate_story": "/api/generate",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/api/generate", response_model=StoryResponse)
async def generate_story(request: StoryRequest):
    try:
        story, provider = ai_generator.generate_story(request)

        return StoryResponse(
            story=story,
            provider=provider,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/options")
async def get_options():
    return {
        "moods": [
            {"value": "anxious", "label": "Anxious"},
            {"value": "overthinking", "label": "Overthinking"},
            {"value": "lonely", "label": "Lonely"},
            {"value": "peaceful", "label": "Peaceful"},
            {"value": "grateful", "label": "Grateful"},
            {"value": "exhausted", "label": "Exhausted"}
        ],
        "themes": [
            {"value": "nature", "label": "Nature"},
            {"value": "cozy_home", "label": "Cozy Home"},
            {"value": "soft_fantasy", "label": "Soft Fantasy"},
            {"value": "spiritual_healing", "label": "Spiritual Healing"},
            {"value": "minimal_narrative", "label": "Minimal Narrative"}
        ],
        "styles": [
            {"value": "very_simple", "label": "Very Simple"},
            {"value": "poetic", "label": "Poetic"},
            {"value": "guided_visualization", "label": "Guided Visualization"}
        ],
        "perspectives": [
            {"value": "second_person", "label": "Second Person (You)"},
            {"value": "first_person", "label": "First Person (I)"},
            {"value": "third_person", "label": "Third Person (They)"}
        ],
        "lengths": [
            {"value": "short", "label": "Short (2-3 min)"},
            {"value": "medium", "label": "Medium (5-7 min)"},
            {"value": "long", "label": "Long (10-15 min)"}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
