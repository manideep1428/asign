from supabase import Client , create_client
import os
from dotenv import load_dotenv 

load_dotenv() 

SUPABASE_URL= os.getenv("SUPABASE_URL")
SUPABASE_KEY= os.getenv("SUPABASE_KEY")


def create_supabase_client():
    print(SUPABASE_URL, SUPABASE_KEY)
    print("connecting to supabase")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("connected to supabase")
    return supabase
