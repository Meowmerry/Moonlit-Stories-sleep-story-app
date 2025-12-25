from pydantic import BaseModel
from typing import Optional, Literal


class StoryRequest(BaseModel):
    mood: Optional[str] = "peaceful"
    theme: Optional[str] = "nature"
    style: Optional[str] = "very simple"
    perspective: Optional[str] = "second person"
    length: Optional[str] = "medium"


class StoryResponse(BaseModel):
    story: str
    provider: str
    timestamp: str


class FavoriteStory(BaseModel):
    id: str
    story: str
    mood: str
    theme: str
    timestamp: str
