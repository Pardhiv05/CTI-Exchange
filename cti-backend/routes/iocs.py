from fastapi import APIRouter, HTTPException
from models import SubmitIoCRequest, VoteRequest
from contract import contract, send_transaction, w3

router = APIRouter(prefix="/iocs", tags=["IoCs"])

@router.post("/submit")
def submit_ioc(body: SubmitIoCRequest):
    try:
        fn = contract.functions.submitIoC(
            body.ioc_type, body.value,
            body.threat_type, body.severity, body.tlp_level
        )
        receipt = send_transaction(fn, body.private_key)
        return {
            "status":  "success",
            "tx_hash": receipt.transactionHash.hex(),
            "block":   receipt.blockNumber
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/check/{value}")
def check_ioc(value: str):
    is_malicious, ioc_id = contract.functions.checkIoC(value).call()
    if not is_malicious:
        return {"malicious": False}
    
    ioc = contract.functions.getIoC(ioc_id).call()
    return {
        "malicious":   True,
        "ioc_id":      ioc_id,
        "ioc_type":    ioc[0],
        "value":       ioc[1],
        "threat_type": ioc[2],
        "severity":    ioc[3],
        "contributor": ioc[4],
        "timestamp":   ioc[5],
        "active":      ioc[6],
        "upvotes":     ioc[7],
        "downvotes":   ioc[8],
        "tlp":         ioc[9],
    }

@router.get("/{ioc_id}")
def get_ioc(ioc_id: int):
    if ioc_id < 1:
        raise HTTPException(status_code=400, detail="Invalid ID")
    ioc = contract.functions.getIoC(ioc_id).call()
    return {
        "id":          ioc_id,
        "ioc_type":    ioc[0],
        "value":       ioc[1],
        "threat_type": ioc[2],
        "severity":    ioc[3],
        "contributor": ioc[4],
        "timestamp":   ioc[5],
        "active":      ioc[6],
        "upvotes":     ioc[7],
        "downvotes":   ioc[8],
        "tlp":         ioc[9],
    }

@router.post("/vote")
def vote(body: VoteRequest):
    try:
        fn = contract.functions.voteOnIoC(body.ioc_id, body.upvote)
        receipt = send_transaction(fn, body.private_key)
        return {"status": "success", "tx_hash": receipt.transactionHash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))