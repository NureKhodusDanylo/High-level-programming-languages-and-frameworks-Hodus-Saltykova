from __future__ import annotations

from datetime import datetime
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("TNR", r"C:\Windows\Fonts\times.ttf"))
    pdfmetrics.registerFont(TTFont("TNR-Bold", r"C:\Windows\Fonts\timesbd.ttf"))
    pdfmetrics.registerFont(TTFont("TNR-Italic", r"C:\Windows\Fonts\timesi.ttf"))


def build_styles():
    styles = getSampleStyleSheet()

    styles.add(
        ParagraphStyle(
            name="BodyUA",
            fontName="TNR",
            fontSize=13,
            leading=19,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="HeadingUA",
            fontName="TNR-Bold",
            fontSize=14,
            leading=20,
            alignment=TA_JUSTIFY,
            spaceBefore=8,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TitleUA",
            fontName="TNR-Bold",
            fontSize=16,
            leading=22,
            alignment=TA_CENTER,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CaptionUA",
            fontName="TNR-Italic",
            fontSize=12,
            leading=15,
            alignment=TA_CENTER,
            spaceBefore=6,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="RightUA",
            fontName="TNR",
            fontSize=13,
            leading=18,
            alignment=TA_RIGHT,
            spaceAfter=4,
        )
    )
    return styles


def figure(path: Path, caption: str, max_width: float = 16 * cm, max_height: float = 9.2 * cm):
    with PILImage.open(path) as img:
        w, h = img.size
    scale = min(max_width / w, max_height / h)
    return Image(str(path), width=w * scale, height=h * scale), caption


def main() -> None:
    register_fonts()
    styles = build_styles()

    root = Path(__file__).resolve().parent.parent
    screenshots = root / "tmp" / "pdfs" / "screenshots"
    out_dir = root / "output" / "pdf"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_pdf = out_dir / "Django_Lab1_Report.pdf"

    doc = SimpleDocTemplate(
        str(out_pdf),
        pagesize=A4,
        leftMargin=2.2 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.6 * cm,
        bottomMargin=1.8 * cm,
        title="Звіт з лабораторної роботи №1 (Django)",
        author="Команда проєкту",
    )

    story = []

    # Title page
    story.append(
        Paragraph(
            "МІНІСТЕРСТВО ОСВІТИ І НАУКИ УКРАЇНИ<br/>"
            "ХАРКІВСЬКИЙ НАЦІОНАЛЬНИЙ УНІВЕРСИТЕТ РАДІОЕЛЕКТРОНІКИ<br/>"
            "Кафедра «Програмна інженерія»",
            styles["TitleUA"],
        )
    )
    story.append(Spacer(1, 3.2 * cm))
    story.append(
        Paragraph(
            "ЗВІТ<br/>з лабораторної роботи №1<br/>"
            "з дисципліни «Високорівневі мови програмування та фреймворки»<br/>"
            "Тема: Розробка веб-додатка на Django",
            styles["TitleUA"],
        )
    )
    story.append(Spacer(1, 4.2 * cm))

    info_table = Table(
        [
            ["Виконали:", "студенти групи _________"],
            ["", "___________________________"],
            ["Прийняв:", "___________________________"],
        ],
        colWidths=[4.2 * cm, 9.8 * cm],
    )
    info_table.setStyle(
        TableStyle(
            [
                ("FONT", (0, 0), (-1, -1), "TNR", 13),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(info_table)
    story.append(Spacer(1, 5 * cm))
    story.append(Paragraph(f"Харків - {datetime.now().year}", styles["TitleUA"]))
    story.append(PageBreak())

    # Goal and task
    story.append(Paragraph("Мета роботи", styles["HeadingUA"]))
    story.append(
        Paragraph(
            "Ознайомитися з практичною розробкою веб-додатків на Django, "
            "реалізувати адміністративне керування контентом, сучасний користувацький інтерфейс "
            "та пошук статей за ключовими словами.",
            styles["BodyUA"],
        )
    )

    story.append(Paragraph("Постановка завдання", styles["HeadingUA"]))
    story.append(
        Paragraph(
            "У межах лабораторної роботи реалізовано модель «Стаття», додавання даних через "
            "вбудовану адмін-панель Django, стильовий інтерфейс із використанням статичних файлів, "
            "а також веб-пошук статей за ключовими словами.",
            styles["BodyUA"],
        )
    )

    story.append(Paragraph("Хід виконання роботи", styles["HeadingUA"]))
    story.append(
        Paragraph(
            "1. Підготовлено Django-проєкт та налаштовано маршрутизацію для публічної сторінки "
            "списку статей і адмін-панелі.<br/>"
            "2. Створено динамічний інтерфейс із CSS-стилями та SVG-анімаціями.<br/>"
            "3. Реалізовано пошук по заголовку і тексту статей.<br/>"
            "4. Виконано тестування відображення сторінок та базової логіки пошуку.",
            styles["BodyUA"],
        )
    )
    story.append(PageBreak())

    figures = [
        ("01_home.png", "Рисунок 1 - Головна сторінка веб-додатка статей"),
        ("02_search_results.png", "Рисунок 2 - Результати пошуку за ключовими словами"),
        ("03_article_detail.png", "Рисунок 3 - Сторінка детального перегляду статті"),
        ("04_admin_login.png", "Рисунок 4 - Сторінка входу до Django Admin"),
        ("05_admin_dashboard.png", "Рисунок 5 - Головна сторінка адмін-панелі"),
        ("06_admin_article_list.png", "Рисунок 6 - Список статей в адмін-панелі"),
        ("07_admin_article_add_form.png", "Рисунок 7 - Форма додавання нової статті"),
    ]

    for idx, (name, caption) in enumerate(figures, start=1):
        img_path = screenshots / name
        img, cap = figure(img_path, caption)
        story.append(Paragraph(f"Етап {idx}", styles["HeadingUA"]))
        story.append(img)
        story.append(Paragraph(cap, styles["CaptionUA"]))
        story.append(HRFlowable(width="100%", thickness=0.6, color=colors.lightgrey))
        story.append(Spacer(1, 0.35 * cm))
        if idx in (2, 4, 6):
            story.append(PageBreak())

    story.append(PageBreak())
    story.append(Paragraph("Висновки", styles["HeadingUA"]))
    story.append(
        Paragraph(
            "У результаті виконання лабораторної роботи реалізовано повноцінний Django-додаток "
            "для керування статтями. Рішення включає додавання контенту через адмін-панель, "
            "візуально оформлений користувацький інтерфейс із анімаціями, пошук за ключовими словами "
            "та сторінку детального перегляду статті. Всі основні етапи підтверджено браузерними "
            "скриншотами і перевіркою працездатності.",
            styles["BodyUA"],
        )
    )

    story.append(Paragraph("Контрольні запитання (коротко)", styles["HeadingUA"]))
    qa = [
        "1. Переваги Django: швидка розробка, вбудована безпека, потужна адмін-панель, ORM.",
        "2. Структура проєкту: конфігураційний модуль + додатки (apps) з моделями, views, templates, static.",
        "3. Основні компоненти: моделі (дані), URL-маршрути, представлення, шаблони.",
        "4. ORM у Django дозволяє працювати з БД через Python-обʼєкти та міграції.",
        "5. Адмін-панель спрощує CRUD-операції для контентних моделей.",
    ]
    for item in qa:
        story.append(Paragraph(item, styles["BodyUA"]))

    doc.build(story)
    print(f"Generated: {out_pdf}")


if __name__ == "__main__":
    main()
