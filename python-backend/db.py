import os
import ssl
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Load .env locally (for local development)
# On Render, environment variables set in the dashboard take precedence.
load_dotenv(override=True)

raw_url = os.getenv("DATABASE_URL")
if not raw_url:
    raise RuntimeError("DATABASE_URL must be set in the environment")

print("⮕ Loaded raw DATABASE_URL:", raw_url)

if raw_url.startswith("postgres://"):
    url = raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
else:
    url = raw_url

url_without_query_params = url.split("?", 1)[0]
print("⮕ Using cleaned DATABASE_URL for engine:", url_without_query_params)

# --- CA Certificate Handling from Environment Variable ---
ca_cert_env_var_name = "SUPABASE_CA_CERT_PEM" # Matches the key you set in Render
ca_cert_pem_data = os.getenv(ca_cert_env_var_name)

ssl_ctx = None
if ca_cert_pem_data:
    print(f"⮕ Found CA certificate data in environment variable '{ca_cert_env_var_name}'.")
    try:
        # cadata expects PEM-formatted certificates as a string or bytes.
        # If it's a string from an env var, it should be fine as is.
        # For robustness, ensure it's encoded if necessary, though str often works.
        # .encode('utf-8') is safer if there's any doubt about string content.
        ssl_ctx = ssl.create_default_context(cadata=ca_cert_pem_data) # Pass the string data
        # With cadata, check_hostname defaults to True, and verify_mode to CERT_REQUIRED.
        print(f"   Using CA data from env var. check_hostname={ssl_ctx.check_hostname}, verify_mode={ssl_ctx.verify_mode}")
    except Exception as e:
        print(f"⚠️ Error loading CA certificate data from environment variable '{ca_cert_env_var_name}': {e}")
        print("⚠️ Falling back to less secure SSL (CERT_NONE). Check the content of the env var.")
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
else:
    print(f"⚠️ CA certificate environment variable '{ca_cert_env_var_name}' not set or empty.")
    print("⚠️ Falling back to less secure SSL (CERT_NONE). This is less secure. Consider setting the env var.")
    # This fallback is a choice. You could also raise an error if the CA cert is mandatory.
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE

if ssl_ctx:
    print(f"⮕ Final SSL context: check_hostname={ssl_ctx.check_hostname}, verify_mode={ssl_ctx.verify_mode}")
else:
    print("⮕ SSL context was not initialized (should not occur with the logic above).")
# --- End CA Certificate Handling ---

engine = create_async_engine(
    url_without_query_params,
    echo=True,
    connect_args={"ssl": ssl_ctx},
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)
Base = declarative_base()