from django.test import TestCase
from django.urls import reverse

from .models import Article


class ArticleSearchViewTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.first_article = Article.objects.create(
            title="Django ORM підказки",
            text="Практичні поради для пошуку та фільтрації в ORM.",
        )
        cls.second_article = Article.objects.create(
            title="Вступ до Flask",
            text="Мінімалістичний фреймворк для невеликих API.",
        )

    def test_article_list_page_opens(self):
        response = self.client.get(reverse("articles:list"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Пошук статей за ключовими словами")
        self.assertContains(response, reverse("articles:detail", args=[self.first_article.pk]))

    def test_search_filters_articles_by_keyword(self):
        response = self.client.get(reverse("articles:list"), {"q": "ORM"})

        self.assertContains(response, "Django ORM підказки")
        self.assertNotContains(response, "Вступ до Flask")

    def test_article_detail_page_opens(self):
        response = self.client.get(reverse("articles:detail", args=[self.first_article.pk]))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Практичні поради для пошуку")
