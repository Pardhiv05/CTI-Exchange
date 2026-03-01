from web3 import Web3
from dotenv import load_dotenv
import json, os

load_dotenv()

w3 = Web3(Web3.HTTPProvider(os.getenv("GANACHE_URL")))

with open("abi/CTIRegistry.json") as f:
    abi = json.load(f)

contract = w3.eth.contract(
    address=Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS")),
    abi=abi
)

def send_transaction(fn, private_key: str):
    account = w3.eth.account.from_key(private_key)
    tx = fn.build_transaction({
        "from":     account.address,
        "nonce":    w3.eth.get_transaction_count(account.address),
        "gas":      300000,
        "gasPrice": w3.eth.gas_price,
    })
    signed  = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return receipt