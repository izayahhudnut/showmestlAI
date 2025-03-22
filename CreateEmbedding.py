import os
import psycopg2
from dotenv import load_dotenv
from openai import OpenAI

# Load env variables and initialize clients
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
client = OpenAI()

def get_embeddings_for_places():
    # Connect to database
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # Get all places
    cursor.execute("SELECT id, name, description FROM places;")
    places = cursor.fetchall()
    
    for place in places:
        place_id, name, description = place
        text = f"Name: {name}. Description: {description or ''}"
        
        # Get embedding
        print(f"\n--- Embedding for: {name} ---")
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        embedding = response.data[0].embedding
        
        # Convert embedding into PostgreSQL-compatible format
        embedded_query_pg = f"[{','.join(map(str, embedding))}]"
        
        # Store embedding directly as a vector
        cursor.execute(
            "UPDATE places SET embeddings = %s::vector(1536) WHERE id = %s;",
            (embedded_query_pg, place_id)
        )
    
    # Commit changes and close connection
    conn.commit()
    cursor.close()
    conn.close()

# Run the function
if __name__ == "__main__":
    get_embeddings_for_places()
