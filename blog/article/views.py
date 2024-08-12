from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializer import *
from .models import Article, TagArticle


class ArticlesApiView(APIView):
    def get(self, request):
        if (request.GET):
            list_keys = list(request.GET.keys())

            print(list_keys)
            query = Q()

            for value in list_keys:
                query |= Q(tags__slug=value)
            
            # Фильтруем статьи по тегам
            articles = Article.objects.filter(query)
            
        else:
            articles = Article.objects.all()

        serializer = ArticleSerializer(
            articles,
            many = True
        ).data

        return Response(serializer,status=status.HTTP_200_OK)
        # return paginator.get_paginated_response(serializer)
    

class TagFilterApiView(APIView):
    def get(self,request):
        tag = TagArticle.objects.all()
        serializer = TagFilterSerialier(tag,many=True).data

        return Response(serializer,status=status.HTTP_200_OK)


class CreateArticleApiView(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request,*args,**kwargs):
        data = request.data
        serializer = ArticleDeserializer(
            data=data
        )
        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
    

class UserArticleApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,*args,**kwargs):
        user = kwargs.get('username', None)
        pk = kwargs.get('id', None)

        if user is not None and id is not None:
            try:
                article_user = Article.objects.get(
                    pk=pk)
                serializer = ArticleSerializer(article_user)

                return Response(
                    serializer.data,status=status.HTTP_200_OK
                )
            except Article.DoesNotExist:
                return Response ({"detail":"Article not found"})

    def post(self,request,*args,**kwargs):
        user = kwargs.get('username',None)

        if user is not None:
            article_user = Article.objects.filter(
                creater__username = user
            )

            if article_user.exists():
                serializer = ArticleSerializer(
                    article_user, 
                    many = True
                )
                return Response(serializer.data,
                                status=status.HTTP_200_OK
                )
            
            return Response(
                {"detail":"У вас нет написанных статей !"}
            )
        
        return Response(
            {'detail':"Error"},
            status=status.HTTP_400_BAD_REQUEST
        )

    def put(self,request,*args,**kwargs):
        data = request.data
        username = request.user.username

        try:
            article = Article.objects.get(pk=data['id'])
        except Article.DoesNotExist:
            return Response({'detail':"Article not found"})
        
        if (article.creater.username != username):
            return Response({"Error":"Не достаточно прав на изменение статьи"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ArticleUpdateSerializer(data=data, instance=article, partial=True)


        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,*args,**kwargs):
        username = kwargs.get('username',None)
        pk = kwargs.get('id',None)

        try:
            article = Article.objects.get(
                pk=pk)  
              
            article.delete()

            return Response({"detail":"article was delete"})        
        except Article.DoesNotExist:
            return Response({"Error":"Article doesn't found"},
                            status=status.HTTP_400_BAD_REQUEST)


class ShowArticleApiView(APIView):
    def get(self,request,*args,**kwargs):
        creater = kwargs.get('creater',None)
        title = kwargs.get('title',None)

        article = Article.objects.filter(
            creater__username=creater,
            title = title)[0]
        response = ArticleSerializer(article).data

        return Response(response,status=status.HTTP_200_OK)