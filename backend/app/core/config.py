from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SIHS API"
    app_env: str = "development"
    database_url: str = "postgresql+psycopg://postgres:postgrespassword@localhost:5432/sistema_sihs"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
