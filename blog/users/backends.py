from typing import Any
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.base_user import AbstractBaseUser
from django.http import HttpRequest
from .models import User



class EmailBackend(ModelBackend):
    
    def authenticate(self, request: HttpRequest, email: str | None = ..., password: str | None = ..., **kwargs: Any):
        # print('working...')
        try:
            user = User.objects.get(email = email)
            # print(user)
            # print(password)
        except User.DoesNotExist:
            return None
        
        # print(f"{user.password} -> in DB")
        # print(f"{password} -> in my send")

        # print(user.check_password(password))
        if user.check_password(password):
            # print("working...2")
            return user
        else:
            return None

    def get_user(self, user_id: int):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None 
