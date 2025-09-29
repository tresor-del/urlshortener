from fastapi.routing import APIRoute
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


def generate_unique_id(route: APIRoute) -> str:
    pass
    # return f"{route.tags[0]}-{route.name}"

app = FastAPI(
        title="URLShortener app",
        generate_unique_id_function=generate_unique_id
    )

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/")
def ping():
    return {"message": "pong"}
