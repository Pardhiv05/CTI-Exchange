from fastapi import APIRouter, HTTPException
from models import AddMemberRequest
from contract import contract, send_transaction, w3

router = APIRouter(prefix="/members", tags=["Members"])

@router.post("/add")
def add_member(body: AddMemberRequest):
    try:
        fn = contract.functions.addMember(
            w3.to_checksum_address(body.member_address),
            body.org_name
        )
        receipt = send_transaction(fn, body.admin_private_key)
        return {"status": "success", "tx_hash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{address}/reputation")
def get_reputation(address: str):
    member = contract.functions.members(
        w3.to_checksum_address(address)
    ).call()
    return {
        "address":    member[0],
        "org_name":   member[1],
        "active":     member[2],
        "reputation": member[3],
        "ioc_count":  member[4],
        "joined_at":  member[5],
    }