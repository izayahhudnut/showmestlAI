import os
import psycopg2
from dotenv import load_dotenv
from openai import OpenAI

# Load env variables and initialize clients
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
client = OpenAI()

def search_places(query, top_k=10):
    """
    Search for places based on semantic similarity to the query text.
    
    Args:
        query (str): The search query
        top_k (int): Maximum number of results to return
        
    Returns:
        list: List of dicts containing place information and similarity scores
    """
    results_list = []
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Create an embedding from the query
        response = client.embeddings.create(
            input=query,
            model="text-embedding-3-small"
        )
        embedded_query = response.data[0].embedding
        
        # Convert the embedding into PostgreSQL format
        embedded_query_pg = f"[{','.join(map(str, embedded_query))}]"
        
        # Create SQL query using L2 distance for vector similarity search
        search_query = f"""
            SELECT id, name, description, address, 
                (embeddings <-> '{embedded_query_pg}'::vector(1536)) AS distance
            FROM places
            ORDER BY embeddings <-> '{embedded_query_pg}'::vector(1536)
            LIMIT {top_k};
        """
        
        # Execute query
        cursor.execute(search_query)
        db_results = cursor.fetchall()
        
        # Format results as a list of dictionaries
        for place_id, name, description, address, distance in db_results:
            similarity = 1 - distance
            results_list.append({
                "id": place_id,
                "name": name,
                "description": description,
                "address": address,
                "similarity": round(similarity, 3)
            })
            
    except Exception as e:
        print(f"Error in search_places: {e}")
    finally:
        # Close connection
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()
    
    return results_list

# Example usage (only runs when script is executed directly)
if __name__ == "__main__":
    query = "Coffee shops"
    results = search_places(query)
    
    # Print results for testing
    print("\n--- Search Results ---")
    for i, place in enumerate(results):
        print(f"{i + 1}. {place['name']} (Similarity: {place['similarity']})")
        print(f"   Description: {place['description']}")
        print(f"   Address: {place['address']}\n")