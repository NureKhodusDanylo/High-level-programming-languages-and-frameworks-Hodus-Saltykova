def find_minimum(a, b, c):
    """
    Рівень 1: Функція, яка приймає три параметри (a, b, c) і виводить на екран найменше з них.
    Повертає найменше значення.
    """
    min_val = min(a, b, c)
    print(f"Найменше значення серед {a}, {b}, {c} дорівнює {min_val}")
    return min_val

def reverse_string(s):
    """
    Рівень 2: Функція, яка приймає рядок та повертає його обернений варіант.
    """

    if s == s[::-1]:
        return f"!{s}!"

    return s[::-1]

class Calculator:
    """
    Рівень 3: Клас "Калькулятор" з методами для додавання, віднімання, множення та ділення.
    """
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

    def multiply(self, a, b):
        return a * b

    def divide(self, a, b):
        if b == 0:
            raise ValueError("Ділення на нуль неможливе.")
        return a / b

class Book:
    """
    Рівень 4: Клас "Книга" з властивостями назва, автор та рік видання.
    """
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year
        
    def display_info(self):
        info = f"Книга: '{self.title}', Автор: {self.author}, Рік видання: {self.year}"
        print(info)
        return info

if __name__ == "__main__":
    print("--- Демонстрація роботи програми ---")
    
    # Рівень 1
    print("\n[Рівень 1] Пошук мінімуму:")
    find_minimum(10, -5, 3)
    
    # Рівень 2
    print("\n[Рівень 2] Реверс рядка:")
    original_str = ""
    reversed_str = reverse_string(original_str)
    print(f"Оригінал: '{original_str}' -> Реверс: '{reversed_str}'")
    
    # Рівень 3
    print("\n[Рівень 3] Калькулятор:")
    calc = Calculator()
    print(f"10 + 5 = {calc.add(10, 5)}")
    print(f"10 - 5 = {calc.subtract(10, 5)}")
    print(f"10 * 5 = {calc.multiply(10, 5)}")
    print(f"10 / 5 = {calc.divide(10, 5)}")
    
    # Рівень 4
    print("\n[Рівень 4] Книга:")
    my_book = Book("1984", "Джордж Оруелл", 1949)
    my_book.display_info()
    
    print("\n--- Роботу завершено ---")
