"""
URL configuration for blog project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from users.views import *
from article.views import *


ARTICLE_API = 'api/v2/article/'
TAG_API = 'api/v2/tag/'
USER_API = 'api/v2/user/'

urlpatterns = [
     path('admin/', admin.site.urls),

     path(TAG_API,
          TagFilterApiView.as_view()),

     path(ARTICLE_API,
          ArticlesApiView.as_view()),

     path(ARTICLE_API + 'create/',
          CreateArticleApiView.as_view()),

     path(ARTICLE_API +'<str:creater>/<str:title>/',
          ShowArticleApiView.as_view()),

     path(USER_API,UserView.as_view()),

     path(USER_API + 'article/<str:username>/',
          UserArticleApiView.as_view()),

     path(USER_API + 'article/<str:username>/<int:id>/',
          UserArticleApiView.as_view()),

     path(USER_API + 'article/update/',
          UserArticleApiView.as_view()),

     path(USER_API + 'article/delete/<str:username>/<int:id>/',
          UserArticleApiView.as_view()),

     path(USER_API + 'reg/',
          RegView.as_view()),
          
     path(USER_API + '<str:email>/',
          UserView.as_view()),

     path('api/v2/login/',LoginView.as_view()),
     path('api/v2/logout/',LogoutView.as_view())
]