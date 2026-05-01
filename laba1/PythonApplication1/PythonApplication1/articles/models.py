from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Article(models.Model):
    title = models.CharField("Заголовок", max_length=200)
    text = models.TextField("Текст")
    published_at = models.DateField("Дата публікації", default=timezone.now)
    author = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        verbose_name="Автор"
    )

    class Meta:
        ordering = ["-published_at", "-id"]
        verbose_name = "Стаття"
        verbose_name_plural = "Статті"

    def __str__(self) -> str:
        return self.title
