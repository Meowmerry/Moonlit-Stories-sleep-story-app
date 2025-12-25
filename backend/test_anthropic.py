import anthropic
from config import settings

print(f"API Key present: {bool(settings.anthropic_api_key)}")
print(f"API Key length: {len(settings.anthropic_api_key) if settings.anthropic_api_key else 0}")

try:
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    print("Client created successfully")

    message = client.messages.create(
        model="claude-sonnet-4-20241022",
        max_tokens=100,
        messages=[
            {"role": "user", "content": "Say hello"}
        ]
    )
    print("Success! Response:", message.content[0].text)
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
