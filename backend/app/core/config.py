from typing import Any, Annotated

from pydantic_settings import BaseSettings, SettingsConfigDict

from pydantic import computed_field, MySQLDsn, AnyUrl, BeforeValidator
from pydantic_core import MultiHostUrl

def pase_cors(v: Any) ->list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",") if v.strip()]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    
    model_config = SettingsConfigDict(
        env_file = "../.env.dev",
        env_ignore_empty = True,
        extra = "ignore",
    )
    
    API_V1_STR: str = "/api/v1"
    FRONTEND_HOST: str = "http://localhost:5173"
    BACKEND_CORS_ORIGINS: Annotated[ list[AnyUrl] | str, BeforeValidator(pase_cors) ] = []
    
    @computed_field
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]
    
    PROJECT_NAME: str
    MYSQL_SERVER: str
    MYSQL_PORT: int
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DB: str 
    
    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> MySQLDsn:
        return MultiHostUrl.build(
            scheme="mysql+pymysql",
            username=self.MYSQL_USER,
            password=self.MYSQL_PASSWORD,
            host=self.MYSQL_SERVER,
            port=self.MYSQL_PORT,
            path=self.MYSQL_DB
        )

settings = Settings()