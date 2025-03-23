from app.services.database import create_supabase_client
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()
supabase = create_supabase_client()

@router.get("/mutual-funds")
async def get_mutual_fund():
    try:
        # Here we will get the user_id from the middleware return 
 
        response = supabase.from_("investments").select("*").eq("user_id", "38e84414-3d32-495e-b1d2-6ebf6adf4320").execute()

        if not response or not hasattr(response, "data"):
            raise HTTPException(status_code=500, detail="Invalid response from Supabase")

        if getattr(response, "error", None): 
            raise HTTPException(status_code=500, detail=f"Database error: {response.error}")

        return response.data  

    except HTTPException as exc:
        return JSONResponse(content={"detail": exc.detail}, status_code=exc.status_code)
    except Exception as exc:
        return JSONResponse(content={"detail": f"Error fetching mutual funds: {str(exc)}"}, status_code=500)


