from fastapi import APIRouter
from contract import contract, w3

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/")
def get_stats():
    return {
        "total_iocs":   contract.functions.getTotalIoCs().call(),
        "member_count": contract.functions.getMemberCount().call(),
        "chain_id":     w3.eth.chain_id,
        "block_number": w3.eth.block_number,
    }