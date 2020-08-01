// class representing a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}
//ui: handle the ui tasks
class UI {
    static displayBooks() {
        let books = Store.getBooks()

        books.forEach((book) => UI.addBookToList(book));

    }

    static addBookToList(book) {
        //where to add the books
        let list = document.querySelector('#book-list');
        //creating a row for the book
        const row = document.createElement('tr');
        row.innerHTML =
            `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href ="#" class="btn btn-danger btn-sm delete">X</a> </td>`;
        list.appendChild(row);
    }

    static showAlert(message, className) {
        let div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //vanish in 3secs
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books;

    }
    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books))

    }
}

//event: display a bookList
document.addEventListener('DOMContentLoaded', UI.displayBooks());
//event: add a book;
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //prevent action from submitting
    e.preventDefault();
    //get the form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;



    //validate form
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('you need to fill this form', 'danger');
    } else {
        const book = new Book(title, author, isbn);

        //add book to the List
        UI.addBookToList(book)

        //add book to local storage
        Store.addBook(book);

        //show success message
        UI.showAlert('book added', 'success')
        //clear fields.
        UI.clearFields()
    }

})
//event remove book
let getBooks = document.querySelector('#book-list');
getBooks.addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    //remove book from Store.
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show showAlert
    UI.showAlert('book removed', 'success')
})
