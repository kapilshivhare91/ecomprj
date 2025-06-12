from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']

    def _str__(self):
        return self.username
    

