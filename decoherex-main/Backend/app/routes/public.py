from fastapi import APIRouter

router = APIRouter()

@router.get("/stats")
async def get_public_stats():
    """
    Get public statistics for landing page
    """
    return {"message": "Public stats endpoint - TODO: implement"}
