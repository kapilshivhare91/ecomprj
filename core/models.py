from django.db import models
from shortuuid.django_fields import ShortUUIDField

class category(models.Model):
    cid = ShortUUIDField(unique=True, Length=10, max_length=20, prefix='cat', alphabet='abcdefgh1234')
    title = models.CharField(max_length=100)
    image = models.Imagefield(upload_to="category")

    class Meta:
        verbose_name_plural = "categories"
        

