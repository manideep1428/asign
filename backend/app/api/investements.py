from app.services.database import create_supabase_client
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()
supabase = create_supabase_client()

@router.get("/investments")
async def get_investments():
    try:
        # Fetch data from Supabase
        response = supabase.from_("fund_allocations").select("*").execute()

        # Ensure response is a valid object
        if not response or not hasattr(response, "data"):
            raise HTTPException(status_code=500, detail="Invalid response from Supabase")

        # Handle any Supabase errors properly
        if getattr(response, "error", None):  # If there's an error attribute, handle it
            raise HTTPException(status_code=500, detail=f"Database error: {response.error}")

        return response.data  # Return only the data part

    except HTTPException as exc:
        return JSONResponse(content={"detail": exc.detail}, status_code=exc.status_code)
    except Exception as exc:
        return JSONResponse(content={"detail": f"Error fetching mutual funds: {str(exc)}"}, status_code=500)
