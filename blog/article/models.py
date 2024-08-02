from django.db import models

from users.models import User


class Article(models.Model):
    title = models.CharField(max_length=255,)
    text = models.TextField(verbose_name="Содержимое")
    creater = models.ForeignKey(User,on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"

    def __str__(self) -> str:
        return f"{self.title}, {self.creater}"
