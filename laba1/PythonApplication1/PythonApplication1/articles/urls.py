from django.urls import path

from .views import article_detail, article_list, register, logout_view

app_name = "articles"

urlpatterns = [
    path("", article_list, name="list"),
    path("article/<int:pk>/", article_detail, name="detail"),
    path("register/", register, name="register"),
    path("logout/", logout_view, name="logout"),
]
