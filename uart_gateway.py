from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import serial
import threading
import time
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

PORT = "/dev/ttyAMA0"
BAUD = 115200
EOT = b"\x04"

UI_DIR = "/home/bc/Documents/macroPanel/browser"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.0.232:4200",
        "http://localhost:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/app", StaticFiles(directory=UI_DIR, html=True), name="ui")

_ser = None
_lock = threading.Lock()

def get_ser() -> serial.Serial:
    global _ser
    if _ser is None or not _ser.is_open:
        _ser = serial.Serial(PORT, BAUD, timeout=0.2)
        time.sleep(0.1)
        try:
            _ser.read(200)
        except Exception:
            pass
    return _ser

def _encode_payload(data: str, append_eot: bool) -> bytes:
    raw = data.encode("utf-8")
    if append_eot:
        raw += EOT
    return raw

class UartSendRequest(BaseModel):
    data: str
    append_eot: bool = False

@app.post("/api/uart/send")
def uart_send(req: UartSendRequest):
    try:
        payload = _encode_payload(req.data, req.append_eot)
        with _lock:
            ser = get_ser()
            ser.write(payload)
        return {"ok": True, "bytes": len(payload)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class UartSendReadRequest(BaseModel):
    data: str
    read_bytes: int = 200
    append_eot: bool = True

@app.post("/api/uart/send_read")
def uart_send_read(req: UartSendReadRequest):
    try:
        payload = _encode_payload(req.data, req.append_eot)
        with _lock:
            ser = get_ser()
            ser.write(payload)
            time.sleep(0.05)
            resp = ser.read(req.read_bytes)
        return {"ok": True, "resp": resp.decode("utf-8", errors="replace")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/app/{full_path:path}")
def spa_fallback(full_path: str):
    index_path = os.path.join(UI_DIR, "index.html")
    return FileResponse(index_path)

