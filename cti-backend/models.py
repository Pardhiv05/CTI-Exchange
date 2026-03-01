from pydantic import BaseModel, Field
from typing import Literal

class SubmitIoCRequest(BaseModel):
    private_key: str
    ioc_type: Literal["ip", "domain", "hash", "url"]
    value: str
    threat_type: Literal["phishing", "malware", "c2", "ransomware"]
    severity: int = Field(..., ge=1, le=10)
    tlp_level: Literal["WHITE", "GREEN", "AMBER", "RED"]

class VoteRequest(BaseModel):
    private_key: str
    ioc_id: int
    upvote: bool

class AddMemberRequest(BaseModel):
    admin_private_key: str
    member_address: str
    org_name: str