def handleError(e: Exception) -> str:
    msg = "Error occurred! " + str(e).capitalize()
    print(msg)
    return msg