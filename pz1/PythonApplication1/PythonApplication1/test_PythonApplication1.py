import unittest
from PythonApplication1 import find_minimum, reverse_string, Calculator, Book

class TestPythonApp(unittest.TestCase):
    
    def test_find_minimum(self):
        # Рівень 1
        self.assertEqual(find_minimum(1, 2, 3), 1)
        self.assertEqual(find_minimum(3, 2, 1), 1)
        self.assertEqual(find_minimum(2, 1, 3), 1)
        self.assertEqual(find_minimum(-5, 0, 5), -5)
        self.assertEqual(find_minimum(10.5, 10.1, 11.0), 10.1)
        
    def test_reverse_string(self):
        # Рівень 2
        self.assertEqual(reverse_string("hello"), "olleh")
        self.assertEqual(reverse_string("Python"), "nohtyP")
        self.assertEqual(reverse_string(""), "")
        self.assertEqual(reverse_string("madam"), "madam")  # паліндром
        
    def test_calculator(self):
        # Рівень 3
        calc = Calculator()
        self.assertEqual(calc.add(5, 3), 8)
        self.assertEqual(calc.subtract(10, 4), 6)
        self.assertEqual(calc.multiply(7, 6), 42)
        self.assertEqual(calc.divide(20, 4), 5)
        self.assertEqual(calc.divide(5, 2), 2.5)
        
        with self.assertRaises(ValueError):
            calc.divide(10, 0)
            
    def test_book(self):
        # Рівень 4
        book = Book("The Great Gatsby", "F. Scott Fitzgerald", 1925)
        self.assertEqual(book.title, "The Great Gatsby")
        self.assertEqual(book.author, "F. Scott Fitzgerald")
        self.assertEqual(book.year, 1925)
        
        expected_info = "Книга: 'The Great Gatsby', Автор: F. Scott Fitzgerald, Рік видання: 1925"
        self.assertEqual(book.display_info(), expected_info)

if __name__ == '__main__':
    unittest.main()
