from fastapi import APIRouter, Depends
from app.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get("/me")
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """
    Get current user profile
    """
    return {"message": "User profile endpoint - TODO: implement"}

@router.get("/me/stats")
async def get_user_stats(current_user: User = Depends(get_current_active_user)):
    """
    Get user dashboard statistics
    """
    return {"message": "User stats endpoint - TODO: implement"}

@router.get("/me/jobs/recent")
async def get_recent_jobs(current_user: User = Depends(get_current_active_user)):
    """
    Get user's recent jobs
    """
    return {"message": "Recent jobs endpoint - TODO: implement"}

@router.get("/me/jobs/weekly")
async def get_weekly_jobs(current_user: User = Depends(get_current_active_user)):
    """
    Get user's weekly job trends
    """
    return {"message": "Weekly jobs endpoint - TODO: implement"}
