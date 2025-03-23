import json
from dotenv import load_dotenv
from google.cloud import firestore
from google.cloud.firestore_v1.vector import Vector
from openai import OpenAI

# Load environment variables and initialize clients
load_dotenv()
client = OpenAI()
db = firestore.Client()

def get_embeddings_for_places():
    # Access the "Places" collection (with capital "P")
    places_ref = db.collection("Places")
    docs = places_ref.stream()

    for doc in docs:
        data = doc.to_dict()
        # Use the "title" field for display if available; fallback to doc id otherwise
        title = data.get("title", f"Document {doc.id}")
        
        # Remove the embedding_field (if it exists) to avoid including it in the embedding input.
        data_for_embedding = {k: v for k, v in data.items() if k != "embedding_field"}
        # Convert the entire document data to a JSON string.
        text_input = json.dumps(data_for_embedding, indent=2)
        print(text_input)
        
        print(f"\n--- Computing embedding for: {title} ---")
        response = client.embeddings.create(
            input=text_input,
            model="text-embedding-3-small"
        )
        embedding = response.data[0].embedding
        print(embedding)
        
        # Wrap the embedding list in a Firestore Vector instance.
        embedding_vector = Vector(embedding)
        
        # Update the document by creating (or merging) the new embedding_field.
        doc.reference.set({
            "embedding_field": embedding_vector
        }, merge=True)
        print(f"Updated document {doc.id} with embedding_field.")

if __name__ == "__main__":
    get_embeddings_for_places()
