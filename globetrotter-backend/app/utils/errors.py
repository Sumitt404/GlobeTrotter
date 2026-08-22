from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

def api_error(code,message): return {"success":False,"error":{"code":code,"message":message}}
async def validation_handler(request:Request,exc:RequestValidationError): return JSONResponse(422,api_error("VALIDATION_ERROR",str(exc)))
