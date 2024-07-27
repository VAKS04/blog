from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status

from django.http import HttpResponse
from .serializer import ArticleSerializer, UserArticleSerializer
from .models import Article
from users.models import User



class ArticlesApiView(APIView):
    def get(self,request):
        article = Article.objects.all()
        serializer = ArticleSerializer(article, many = True).data
        return Response(serializer,status=status.HTTP_200_OK)
    

class CreateArticleApiView(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


    def post(self,request,*args,**kwargs):
        data = request.data
        # print(data)
        serializer = ArticleSerializer(
            data=data
        )
        # print(f"serializer is {serializer.is_valid()}")
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,status=status.HTTP_200_OK
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class UserArticleApiView(APIView):
    permission_classes = [IsAuthenticated]

    # def get(self,request,*args,**kwargs):
    def post(self,request,*args,**kwargs):
        # print(kwargs.get('username',None))
        user = kwargs.get('username',None)
        # print(f"Method post response {user}")
        if user is not None:
            article_user = Article.objects.filter(creater__username = user)
            if article_user.exists():
                serializer = UserArticleSerializer(article_user , many = True)
                return Response(serializer.data , status=status.HTTP_200_OK)
            return Response({"detail":"У вас нет написанных статей !"})
        return Response({'detail':"Error"},status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request,*args,**kwargs):
        user = kwargs.get('username',None)
        title = kwargs.get('title',None)

        # print(user + " " +title)

        if user is not None and title is not None:
            try:
                article_user = Article.objects.get(creater__username = user,title = title)
                # print(article_user)
                # return Response({'detail':'Запись не найдена'},status=status.HTTP_204_NO_CONTENT)
                serializer = UserArticleSerializer(article_user)

                return Response(
                    serializer.data,status=status.HTTP_200_OK
                )
            except Article.DoesNotExist:
                return Response ({"detail":"Article not found"})

    def put(self,request,*args,**kwargs):
        username = kwargs.get('username',None)
        title = kwargs.get('title',None)
        data = request.data
        
        user = User.objects.get(username = username)

        if user != request.user:
            return Response({'detail': "Недостаточно прав для изменения профиля"}, status=status.HTTP_403_FORBIDDEN)
        try:
            article = Article.objects.get(title = title,creater__username = username)
        except Article.DoesNotExist:
            return Response({'detail':"Article not found"})
        
        serializer = UserArticleSerializer(data=data,instance=article)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        # title = data.get('title',None)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,*args,**kwargs):
        
        username = kwargs.get('username',None)
        title = kwargs.get('title',None)

        try:
            article = Article.objects.get(title=title,creater__username = username)    
            article.delete()
            return Response({"detail":"article was delete"})        
        except Article.DoesNotExist:
            return Response({"Error":"Article doesn't found"},status=status.HTTP_400_BAD_REQUEST)


class ShowArticleApiView(APIView):
    def get(self,request,*args,**kwargs):

        creater = kwargs.get('creater',None)
        # print(creater)
        title = kwargs.get('title',None)

        article = Article.objects.filter(creater__username=creater,title = title)[0]
        response = ArticleSerializer(article).data
        return Response(response,status=status.HTTP_200_OK)

# Create your views here.
