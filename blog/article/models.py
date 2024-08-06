from django.db import models

from users.models import User


class Article(models.Model):
    title = models.CharField(max_length=255,)
    text = models.TextField(verbose_name="Содержимое")
    creater = models.ForeignKey(User,on_delete=models.CASCADE)
    tags = models.ManyToManyField('TagArticle',blank=True)

    class Meta:
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"

    def __str__(self) -> str:
        return f"{self.title}, {self.creater}"
    

class TagArticle(models.Model):
    tag = models.CharField(max_length=50,verbose_name="Тег")
    slug = models.SlugField(auto_created=True,verbose_name="Слаг")

    def __str__(self) -> str:
        return self.tag
    
    class Meta:
        verbose_name = "Тег"
        verbose_name_plural = "Теги"
