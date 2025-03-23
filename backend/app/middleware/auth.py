from app.services.database import create_supabase_client
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import jwt
from jwt.exceptions import InvalidTokenError

supabase = create_supabase_client()

def verify_access_token(token: str):
    print("Verifying access token")
    
    if not token:
        raise HTTPException(status_code=401, detail="Missing access token")
    
    if token.startswith("Bearer "):
        token = token.replace("Bearer ", "")
    
    try:
        jwt_secret = supabase.auth.get_jwt_secret()
        
        decoded_token = jwt.decode(token, jwt_secret, algorithms=["HS256"])
        
        user_id = decoded_token.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
        
        response = supabase.table("users").select("id").eq("id", user_id).execute()
        
        if response.error:
            raise HTTPException(status_code=500, detail=f"Database error: {response.error.message}")
        
        if not response.data:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user_id
        
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying token: {str(e)}")

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in ["/auth/login", "/auth/register", "/docs", "/openapi.json"]:
            return await call_next(request)
            
        try:
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                raise HTTPException(status_code=401, detail="Missing Authorization header")

            user_id = verify_access_token(auth_header)
            
            request.state.user_id = user_id

            response = await call_next(request)
            return response

        except HTTPException as exc:
            return JSONResponse(content={"detail": exc.detail}, status_code=exc.status_code)
        except Exception as exc:
            return JSONResponse(content={"detail": f"Error: {str(exc)}"}, status_code=500)