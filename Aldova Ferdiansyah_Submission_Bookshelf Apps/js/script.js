const books = [];
const RENDER_EVENT = 'render-bookshelf';
const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    const formSearch = document.getElementById('search-form')

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    formSearch.addEventListener('submit', function (event) {
        event.preventDefault();
        const inputSearch = document.getElementById('searchInput').value;
        bookSearch(inputSearch);
    })
});


function addBook() {
    const judulBuku = document.getElementById('title').value;
    const penulisBuku = document.getElementById('author').value;
    const tahunRilis = document.getElementById('tahun').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, judulBuku, penulisBuku, tahunRilis, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, judul, penulis, tahun, isCompleted) {
    return {
        id,
        judul,
        penulis,
        tahun: parseInt(tahun),
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKS = document.getElementById('books');
    uncompletedBOOKS.innerHTML = '';

    const completedBOOKS = document.getElementById('completed-books');
    completedBOOKS.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted)
            uncompletedBOOKS.append(bookElement);
        else
            completedBOOKS.append(bookElement);
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.judul;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = ("Penulis : " + bookObject.penulis);

    const textTahun = document.createElement('p');
    textTahun.innerText = ("Tahun : " + bookObject.tahun);

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textPenulis, textTahun);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        container.append(checkButton);
    }

    return container;
}

function addBookToCompleted(bookId) {
    const target = findBook(bookId);

    if (target == null) return;

    target.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId) {
    const target = findBookIndex(bookId);

    if (target === -1) return;

    books.splice(target, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const target = findBook(bookId);

    if (target == null) return;

    target.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function bookSearch(){
const searchInput = document.getElementById('searchInput');
const dataBook = document.getElementById('books'); // Mengambil data pada array Books []
const bookItem = dataBook.getElementsByTagName('h2');

searchInput.addEventListener('keyup', function (event) {
    const drafBook = event.target.value.toLowerCase();
    for (let i = 0; i < bookItem.length; i++) {
        const text = bookItem[i].textContent.toLocaleLowerCase();
        if (text.includes(drafBook)) {
            bookItem[i].style.display = "block";
        } else {
            bookItem[i].style.display = "none";
        }
    }
})
}