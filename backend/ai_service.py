import anthropic
import openai
from typing import Optional
from config import settings
from models import StoryRequest
from datetime import datetime


SYSTEM_PROMPT = """You are an AI Sleep Story Generator designed to help users relax, feel emotionally safe, and fall asleep naturally.

Your primary goal is to create deeply calming, gentle, and spiritually grounding bedtime stories.

Tone & Style Rules:
- Write in a soft, slow, reassuring tone
- Use simple, soothing vocabulary
- Maintain gentle pacing with short, flowing sentences
- Favor repetition and rhythmic phrasing
- Avoid complexity, surprises, or stimulation

Content Restrictions (Very Important):
Do NOT include:
- Conflict, danger, fear, tension, or suspense
- Loud sounds, sudden movements, or dramatic changes
- Time pressure, urgency, or decision-making
- Emotional intensity or dramatic storytelling

Story Guidance:
Focus on:
- Safety
- Warmth
- Slowness
- Letting go
- Rest and stillness

Include gentle sensory details such as:
- Breathing
- Soft light
- Warm air or blankets
- Slow movement (walking, floating, resting)

Emotional & Spiritual Layer:
- Subtly weave in healing affirmations
- Encourage: Calm, Trust, Emotional release, Deep rest
- Avoid religious language unless explicitly requested
- Keep spirituality universal, grounding, and peaceful

Reassuring Language:
Gently use phrases such as:
- "There is nothing you need to do."
- "You are safe."
- "Everything can wait."
- "You can rest now."

Ending Behavior:
- The story should gradually fade into stillness
- Avoid strong conclusions or endings
- If looping is requested, end with open-ended calm imagery
- The final output should feel like a soft whisper guiding the listener into sleep."""


class AIStoryGenerator:
    def __init__(self):
        self.anthropic_client = None
        self.openai_client = None
        self.last_error = None  # Track the last error

        print(f"Initializing AIStoryGenerator...")
        print(f"Anthropic API key present: {bool(settings.anthropic_api_key)}")
        print(f"Anthropic API key starts with: {settings.anthropic_api_key[:15] if settings.anthropic_api_key else 'None'}...")

        if settings.anthropic_api_key and settings.anthropic_api_key != "your_anthropic_api_key_here":
            try:
                self.anthropic_client = anthropic.Anthropic(
                    api_key=settings.anthropic_api_key)
                print("✓ Anthropic client initialized successfully")
            except Exception as e:
                print(f"✗ Failed to initialize Anthropic client: {e}")
                self.last_error = str(e)
        else:
            print("✗ No valid Anthropic API key found")

        if settings.openai_api_key and settings.openai_api_key != "your_openai_api_key_here":
            try:
                self.openai_client = openai.OpenAI(
                    api_key=settings.openai_api_key)
                print("✓ OpenAI client initialized successfully")
            except Exception as e:
                print(f"✗ Failed to initialize OpenAI client: {e}")
                self.last_error = str(e)

    def _build_user_prompt(self, request: StoryRequest) -> str:
        length_mapping = {
            "short": "about 200-300 words",
            "medium": "about 400-500 words",
            "long": "about 700-900 words"
        }

        length_instruction = length_mapping.get(
            request.length, "about 400-500 words")

        prompt = f"""Generate a calming sleep story with these preferences:

Mood: {request.mood}
Theme: {request.theme}
Style: {request.style}
Perspective: {request.perspective}
Length: {length_instruction}

Create a soothing, peaceful story that helps the listener drift into deep, restful sleep."""

        return prompt

    def generate_with_claude(self, request: StoryRequest) -> Optional[str]:
        """Removed async - Anthropic SDK is synchronous"""
        if not self.anthropic_client:
            self.last_error = "Anthropic client not initialized"
            print(f"✗ {self.last_error}")
            return None

        try:
            user_prompt = self._build_user_prompt(request)

            print(f"Calling Claude API with model: claude-3-5-haiku-20241022")

            message = self.anthropic_client.messages.create(
                model="claude-3-5-haiku-20241022",  # Claude 3.5 Haiku (valid model)
                max_tokens=2048,
                temperature=0.7,
                system=SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )

            print(f"✓ Claude API call successful")
            return message.content[0].text

        except Exception as e:
            error_msg = f"Claude generation failed: {str(e)}"
            print(error_msg)
            print(f"Error type: {type(e).__name__}")
            self.last_error = error_msg
            return None

    def generate_with_openai(self, request: StoryRequest) -> Optional[str]:
        """Removed async - OpenAI SDK is synchronous"""
        if not self.openai_client:
            self.last_error = "OpenAI client not initialized"
            return None

        try:
            user_prompt = self._build_user_prompt(request)

            print(f"Calling OpenAI API...")

            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )

            print(f"✓ OpenAI API call successful")
            return response.choices[0].message.content

        except Exception as e:
            error_msg = f"OpenAI generation failed: {str(e)}"
            print(error_msg)
            self.last_error = error_msg
            return None

    def generate_story(self, request: StoryRequest) -> tuple[str, str]:
        """Removed async - make this synchronous"""
        self.last_error = None

        # Try Claude first
        story = self.generate_with_claude(request)
        if story:
            return story, "claude"

        # Fallback to OpenAI
        story = self.generate_with_openai(request)
        if story:
            return story, "openai"

        # Provide detailed error message
        error_detail = self.last_error or "Both AI providers failed to generate story"
        raise Exception(error_detail)


ai_generator = AIStoryGenerator()
