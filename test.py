from pydantic import BaseModel
from agents import Agent, Runner



def get_fake_texts():
    """
    Simulates retrieving texts from a database.
    Returns a list of fake text entries.
    """
    fake_texts = [
        {
            "id": "text1",
            "content": "Meeting with John and Sarah on Friday at 2pm to discuss the new project."
        },
        {
            "id": "text2",
            "content": "Remember to pick up groceries: milk, eggs, and bread."
        },
        {
            "id": "text3",
            "content": "Birthday party for Emma on Saturday at the park. Bring gifts!"
        },
        {
            "id": "text4",
            "content": "Doctor appointment scheduled for Monday at 10:30am."
        },
        {
            "id": "text5",
            "content": "Team lunch at Joe's Pizza next Wednesday at noon."
        }
    ]
    
    print("Fetching texts from database...")
    print(f"Found {len(fake_texts)} texts")
    
    return fake_texts

class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]
    
    
    
toolcaller = Agent(
    name="tool caller",
    handoff_description="use this to call the tool",
    instructions="   Call the get_fake_texts tool",
    tools=[
        get_fake_texts()
    ],
)

agent = Agent(
    name="Calendar extractor",
    instructions="Extract calendar events from text you need to use a tool for this make sure they are in teh calenderevent shit",
    handoffs=[toolcaller]

)


async def main():
    result = await Runner.run(agent, "What are some of my calendar events")
    print(result.final_output)