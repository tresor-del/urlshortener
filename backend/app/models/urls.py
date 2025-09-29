from uuid import UUID
from sqlmodel import SQLModel, Field, func
from datetime import datetime


class ShortenedUrl(SQLModel, table=True):
    id: UUID | None = Field(default=None, primary_key=True)
    original_url: str
    short_code: str
    created_at: datetime = Field(default_factory=func.now())
    expires_at: datetime | None = None  
    clicks: int = 0 