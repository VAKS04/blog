from typing import Any

from django.contrib.auth.backends import ModelBackend
from django.http import HttpRequest

from .models import User


class EmailBackend(ModelBackend):
    def authenticate(self, request: HttpRequest, 
                     email: str | None = ..., 
                     password: str | None = ..., 
                     **kwargs: Any):
        try:
            user = User.objects.get(email = email)
        except User.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        else:
            return None

    def get_user(self, user_id: int):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None 
