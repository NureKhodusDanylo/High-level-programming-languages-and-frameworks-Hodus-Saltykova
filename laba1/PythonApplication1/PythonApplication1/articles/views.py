from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm
from django.db.models import Q
from django.shortcuts import get_object_or_404, render, redirect

from .models import Article


def article_list(request):
    query = request.GET.get("q", "").strip()
    articles = Article.objects.all()

    if query:
        search_filter = Q()
        for keyword in query.split():
            search_filter |= Q(title__icontains=keyword) | Q(text__icontains=keyword)
        articles = articles.filter(search_filter).distinct()

    context = {
        "articles": articles,
        "query": query,
        "results_count": articles.count(),
    }
    return render(request, "articles/article_list.html", context)


def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, "articles/article_detail.html", {"article": article})


def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("articles:list")
    else:
        form = UserCreationForm()
    return render(request, "articles/register.html", {"form": form})


def logout_view(request):
    logout(request)
    return redirect("articles:list")
