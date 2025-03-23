from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from openai import OpenAI
from typing import List, Optional
from pydantic import BaseModel, Field

# Import the search function
from search import search_places

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class PlaceInfo(BaseModel):
    """
    Information about a specific place recommendation.
    """
    id: str = Field(
        ...,
        description="The unique identifier of the place in the database"
    )
    name: str = Field(
        ..., 
        description="The name of the place"
    )
    description: str = Field(
        ...,
        description="A description of the place"
    )

class RecommendationItem(BaseModel):
    """
    A single recommendation list, containing a clever and informative title 
    and a list of recommended places.
    """
    title: str = Field(
        ...,
        description="The title of the recommendation list."
    )
    places: List[PlaceInfo] = Field(
        ...,
        description="A list of recommended places matching the user's query."
    )
    description: str = Field(
        ...,
        description="An explanation of why these places were recommended."
    )

class ExperienceItem(BaseModel):
    """
    A single experience, containing a creative title and a list of nested recommendations.
    """
    title: str = Field(
        ...,
        description="The title of the experience."
    )
    recommendations: List[RecommendationItem] = Field(
        ...,
        description="A list of detailed recommendations tailored to the experience."
    )
    description: str = Field(
        ...,
        description="An explanation of why this experience was suggested."
    )

class SaintLouisRecommendations(BaseModel):
    """
    The main schema for AI-generated recommendations and experiences in Saint Louis.
    The AI will either return a list of direct recommendations or a themed experience.
    """
    recommendations: Optional[List[RecommendationItem]] = Field(
        None,
        description="A list of direct recommendations. Each recommendation should have a creative title and a list of detailed places with ids."
    )
    experiences: Optional[List[ExperienceItem]] = Field(
        None,
        description="A list of themed experiences. Each experience should have a catchy title and contain nested recommendations with creative titles."
    )
    description: str = Field(
        ...,
        description="A general description explaining why the recommendations or experiences were chosen based on the user's query."
    )


def generate_recommendations(user_query, top_k=15):
    """
    Generate personalized recommendations based on user query:
      1. Search for relevant places using the user query.
      2. Pass those places to the AI for curated recommendations.
      3. For each nested recommendation (if part of an experience), run an individual search using its title and description.
    """
    print("Step 1: Searching for relevant places using the user query.")
    search_results = search_places(user_query, top_k=top_k)
    
    print("Step 2: Building places context for AI prompt.")
    places_context = ""
    places_mapping = {}
    
    for place in search_results:
        place_id = place['id']
        place_name = place['name']
        place_desc = place['description']
        
        places_context += f"ID: {place_id}\n"
        places_context += f"Name: {place_name}\n"
        places_context += f"Description: {place_desc}\n"
        places_context += f"Address: {place['address']}\n"
        places_context += f"Similarity Score: {place['similarity']}\n\n"
        
        places_mapping[place_name] = {
            "id": place_id,
            "name": place_name,
            "description": place_desc
        }
    
    print("Step 3: Creating system prompt with places context.")
    system_prompt = f"""
    You are a helpful AI recommending places and experiences in Saint Louis.
    When the user asks for suggestions, decide whether to provide a direct list of recommendations or a themed experience.

    - For straightforward queries (e.g., 'Best coffee shops'), return a list of recommendations.
    - For thematic queries (e.g., 'Romantic date night'), return an experience with nested recommendations.

    Make the titles catchy and creative.

    IMPORTANT:
    USE ONLY the following places in your recommendations:
    
    {places_context}

    For each place you recommend, you MUST include:
      1. The exact ID as provided above
      2. The exact name as provided
      3. The description as provided

    DO NOT make up or suggest places that are not listed above.
    """
    
    print("Step 4: Generating AI recommendations using the system prompt.")
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ],
        response_format=SaintLouisRecommendations,
    )
    
    result = completion.choices[0].message.parsed
    print("AI recommendations generated successfully.")
    
    if result.experiences:
        print("Step 5: Processing each experience's nested recommendations with individual searches.")
        for exp in result.experiences:
            for rec in exp.recommendations:
                rec_query = f"{rec.title} {rec.description}"
                print(f"Searching for places for step '{rec.title}' with query: {rec_query}")
                search_results = search_places(rec_query, top_k=top_k)
                places = []
                for place in search_results:
                    places.append({
                        "id": place["id"],
                        "name": place["name"],
                        "description": place["description"]
                    })
                rec.places = places

    return result


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_query = data.get("user_query", "")
    print("Received user query:", user_query)
    
    recommendations = generate_recommendations(user_query)
    print("Generated recommendations:", recommendations)
    
    output = {
        "description": recommendations.description,
        "steps": []
    }
    if recommendations.experiences:
        for exp in recommendations.experiences:
            for rec in exp.recommendations:
                step = {
                    "step_name": rec.title,
                    "places": [{"id": place["id"], "name": place["name"]} for place in rec.places]
                }
                output["steps"].append(step)
    elif recommendations.recommendations:
        for rec in recommendations.recommendations:
            step = {
                "step_name": rec.title,
                "places": [{"id": place["id"], "name": place["name"]} for place in rec.places]
            }
            output["steps"].append(step)
    
    print("Returning output:", output)
    return jsonify(output)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting server on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)
