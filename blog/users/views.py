from django.contrib.auth import authenticate,login,logout

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework import status

from .serializer import UserSerializer ,ChangeUserFormSerializer
from .models import *


class TokenView:
    def isTrueToken(self, got_token, user):
        token = self.getToken(user=user)
        if got_token == token.key:
            return True

    def getToken(self,user):
        token, created = Token.objects.get_or_create(user=user)
        return token

    def post(self,request,*args,**kwargs):
        data = request.data
        got_token = data.get("token")
        email = data.get('email')
        user = User.objects.get(email=email)
        if self.isTrueToken(got_token, user=user) and user is not None:
            return True
        return False


class RegView(APIView):
    def post(self,request,*args,**kwargs):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail":"User have been registered"},
                status=status.HTTP_200_OK)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self,request):
        data = request.data
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request,
                            email=email,
                            password=password)
        
        userToken = TokenView()
        
        if user is not None:
            login(request,user)

            token = userToken.getToken(user=user)
            # token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key,
                              'user': UserSerializer(user).data},
                              status=status.HTTP_200_OK)
        else:
            return Response({"message":"Invalid data"},
                             status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        logout(request)
        return Response({"message":"Logged out"})
    

class UserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        user = request.user
        return Response({'user':str(user),
                         "pk":pk},
                         status=status.HTTP_200_OK)
    
    def put(self,request,email):

        try :
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail":"user not fount"})
        
        print(request.user)
        print(user)
        if user != request.user:
            return Response(
                {'detail': "Недостаточно прав для изменения профиля"},
                  status=status.HTTP_403_FORBIDDEN)

        serializer = ChangeUserFormSerializer(data=request.data,
                                              instance=user)
        # print(serializer.is_valid(raise_exception=True))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,
                            status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)   