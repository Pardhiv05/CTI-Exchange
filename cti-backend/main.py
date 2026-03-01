from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import iocs, members, stats

app = FastAPI(
    title="CTI Exchange API",
    description="Blockchain-based Cyber Threat Intelligence sharing platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(iocs.router)
app.include_router(members.router)
app.include_router(stats.router)

@app.get("/")
def root():
    return {"message": "CTI Exchange API is running"}