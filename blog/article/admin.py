from django.contrib import admin

from .models import Article, TagArticle


admin.site.register(Article)
admin.site.register(TagArticle)
# Register your models here.
