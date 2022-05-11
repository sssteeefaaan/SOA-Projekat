from datetime import datetime

def handleError(e: Exception) -> str:
    msg = "Error occurred! " + str(e).capitalize()
    print(msg)
    return msg

def convertISO(isoFormat: str) -> datetime:
    return datetime.strptime(isoFormat, "%Y-%m-%dt%H:%M:%S.%f%z")