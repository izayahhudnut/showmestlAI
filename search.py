from dotenv import load_dotenv
from openai import OpenAI
from google.cloud import firestore
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from google.cloud.firestore_v1.vector import Vector
from google.oauth2 import service_account
import os
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load Google credentials from environment variable
if os.getenv("GOOGLE_CREDENTIALS"):
    try:
        credentials_info = json.loads(os.getenv("GOOGLE_CREDENTIALS"))
        credentials = service_account.Credentials.from_service_account_info(credentials_info)
        db = firestore.Client(credentials=credentials, project=credentials_info["project_id"])
    except Exception as e:
        print(f"Error loading Firestore credentials: {e}")
        db = None
else:
    print("GOOGLE_CREDENTIALS not found in environment. Using default credentials.")
    db = firestore.Client()

def search_places(query, top_k=10):
    if not db:
        print("Firestore client not initialized.")
        return []
        
    results_list = []
    try:
        # Compute the embedding for the query using OpenAI
        response = client.embeddings.create(
            input=query,
            model="text-embedding-3-small"
        )
        embedded_query = response.data[0].embedding
        
        # Wrap the embedding in a Firestore Vector
        query_vector = Vector(embedded_query)
        
        # Get a reference to the "Places" collection
        places_ref = db.collection("Places")
        
        # Execute the vector search query using Firestore's find_nearest method
        vector_query = places_ref.find_nearest(
            vector_field="embedding_field",
            query_vector=query_vector,
            distance_measure=DistanceMeasure.DOT_PRODUCT,
            limit=top_k,
            distance_result_field="vector_distance"
        )
        
        # Process each returned document
        for doc in vector_query.stream():
            data = doc.to_dict()
            distance = data.get("vector_distance")
            similarity = 1 - distance if distance is not None else None
            results_list.append({
                "id": doc.id,
               "name": data.get("Title", "Unknown Place"),
               "description": data.get("description", "No description available"),
               "address": data.get("address", "N/A"),  # ✅ Added address retrieval
               "similarity": round(similarity, 3) if similarity is not None else None
            })
            
    except Exception as e:
        print(f"Error in search_places: {e}")
    
    return results_list

# Example usage (only runs when script is executed directly)
if __name__ == "__main__":
    query = "a cozy spot serving rustic Mediterranean dishes"
    results = search_places(query)
    
    print("\n--- Search Results ---")
    for i, place in enumerate(results):
        print(f"{i + 1}. Title: {place['name']}, Description: {place['description']}, ID: {place['id']}, Similarity: {place['similarity']}")