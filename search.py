from dotenv import load_dotenv
from openai import OpenAI
from google.cloud import firestore
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from google.cloud.firestore_v1.vector import Vector

# Load environment variables and initialize clients
load_dotenv()
client = OpenAI()
db = firestore.Client()

def search_places(query, top_k=10):
    """
    Search for places based on semantic similarity to the query text in Firestore.
    
    Args:
        query (str): The search query.
        top_k (int): Maximum number of results to return.
        
    Returns:
        list: List of dicts containing the Title, document ID, and similarity score.
    """
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
                "Title": data.get("Title", "N/A"),
                "similarity": round(similarity, 3) if similarity is not None else None
            })
            
    except Exception as e:
        print(f"Error in search_places: {e}")
    
    return results_list

# Example usage (only runs when script is executed directly)
if __name__ == "__main__":
    query = "a cozy spot serving rustic meditareren dishes"
    results = search_places(query)
    
    print("\n--- Search Results ---")
    for i, place in enumerate(results):
        print(f"{i + 1}. Title: {place['Title']}, ID: {place['id']}, Similarity: {place['similarity']}")
