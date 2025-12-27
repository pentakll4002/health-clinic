"""
Script to ingest roles and permissions data into the vector store
"""
import os
import sys

# Add parent directory to path
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from ingestion.ingest import DocumentIngester

def ingest_roles_data():
    """Ingest roles and permissions data into vector store"""
    print("=" * 60)
    print("Ingesting Roles and Permissions Data")
    print("=" * 60)
    
    # Initialize ingester
    ingester = DocumentIngester()
    
    # Path to roles data file
    roles_file = os.path.join(script_dir, "..", "data", "raw", "roles_and_permissions.md")
    
    if not os.path.exists(roles_file):
        print(f"Error: File not found: {roles_file}")
        return
    
    print(f"Loading roles data from: {roles_file}")
    
    # Ingest the file
    try:
        result = ingester.ingest_file(
            roles_file,
            metadata={
                "type": "roles_permissions",
                "source": "laravel_backend",
                "category": "system_documentation"
            }
        )
        
        print(f"✅ Successfully ingested roles data!")
        print(f"   - Number of chunks: {result['num_chunks']}")
        print(f"   - Source: {roles_file}")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error ingesting roles data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    ingest_roles_data()

