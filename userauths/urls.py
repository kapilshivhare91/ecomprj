from django.urls import path
from userauths import views

app_name = "userauths"

url_patterns = [
    path("sign-up/", views.register_views , name="sign-up")
]