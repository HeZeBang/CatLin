import json

def login(username: str, password: str) -> dict:
    """
    Login to the system using the provided username and password.

    Args:
        username (str): The username for login.
        password (str): The password for login.

    Returns:
        dict: A dictionary containing the login status and user information.
    """
    # Simulate a successful login
    if username == "admin" and password == "password":
        return {
            "status": "success",
            "user": {
                "username": username,
                "role": "admin",
                "cats": [],
                "level": 1,
                "reward": 0,
                "speed": 5,
                "quality": 5,
                "badges": [],
                "current_badge": None,
            }
        }
    else:
        return {
            "status": "error",
            "message": "Invalid username or password"
        }

