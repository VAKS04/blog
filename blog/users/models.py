from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    image = models.CharField(verbose_name="Ссылка картинки",
                              blank=True,
                              max_length=255)
    email = models.EmailField(_("email address"))

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

# Create your models here.
