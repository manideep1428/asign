from app.middleware.auth import AuthMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import mutual_funds
from app.api import investements
app = FastAPI(title="Investment Tracker API")

origins = [
    "http://localhost:3000",  
    ""
]


# app.add_middleware(AuthMiddleware)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],  
)

# Register API routes
app.include_router(mutual_funds.router, prefix="/api")

app.include_router(investements.router, prefix="/api")

@app.get("/", summary="Root endpoint" , )
def home():
    return {"message": "Supabase + FastAPI is working!"}
