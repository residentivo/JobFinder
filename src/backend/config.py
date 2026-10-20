import os

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    elastic_url: str = os.getenv("ELASTIC_URL", "http://localhost:9200")
    elastic_user: str | None = os.getenv("ELASTIC_USER")
    elastic_password: str | None = os.getenv("ELASTIC_PASSWORD")
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = os.getenv("ENV", "dev")                            
    public_base_url: str = os.getenv("PUBLIC_BASE_URL", "http://localhost:8000")
    host: str = os.getenv("HOST", "127.0.0.1")                    
    port: int = int(os.getenv("PORT", 8000))
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key")  

    @property
    def is_prod(self) -> bool:
        return self.env.lower() == "prod"

    @property
    def cookie_secure(self) -> bool:
        return self.is_prod
    
settings = Settings()

