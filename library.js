'use strict';

let myLibrary = [];

function Book(title, author, pages) {
    // constructor for a book
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = false;
    this.image = 'images/addPhoto.svg';
    this.info = function() {
        return `${this.title} by ${this.author} is ${pages} pages long, it ${this.read ? 'has been read' : 'has not been read'}`
    }
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

//Default Testing Books
const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 235);
const harryPotter = new Book('Harry Potter', 'JK Rollings', 367);
addBookToLibrary(theHobbit);
addBookToLibrary(harryPotter);

function displayLibrary(array) {
    let bookList = document.querySelector('#books');
    //removeChildren(bookList);
    array.forEach(element => {
        let newBook = makeCardElement(element);
        bookList.appendChild(newBook);
    });
}

function removeChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function makeBookInfo(e) {
    let x = document.createElement('div');
    let bottomDiv = makeDomElement('div', '', 'cardBottom')
    let bookInfo = makeDomElement('div', '', 'bookInfo')
    let read = makeDomElement('p', (e.read ? 'Read': 'Unread'), 'bookRead');
    let author = makeDomElement('p', e.author, 'bookAuthor');
    let pageLength = makeDomElement('p', e.pages, 'bookPages');
    let bookImage = makeBookImageElement(e);
    addChildrenToDiv(x, author, pageLength)
    addChildrenToDiv(bookInfo, x, read)
    addChildrenToDiv(bottomDiv, bookInfo, bookImage)
    return bottomDiv;
}

function addChildrenToDiv(parent) {
    let args = Array.from(arguments);
    args.shift();
    args.forEach(x => parent.appendChild(x));
}

function makeBookHeader(e) {
    let cardDiv = makeDomElement('div', '','bookHeader')
    let title = makeDomElement('h2', e.title, 'bookTitle');
    let cancelBtn = makeDomElement('button', 'x', 'removeBook');
    cardDiv.appendChild(title);
    cardDiv.appendChild(cancelBtn); 
    return cardDiv;
}

function makeDomElement(tag, text = '', classID = '') {
    let elemTag = document.createElement(tag);
    if (text !== '') {
        let elemText = document.createTextNode(text);
        elemTag.appendChild(elemText)
    }
    if (classID !== '') {
        elemTag.classList.add(classID);
    }
    return elemTag;
}

function makeCardElement(e) {
    let card = makeDomElement('div', '', 'card');
    let bookInfo = makeBookInfo(e);
    let bookHeader = makeBookHeader(e);
    card.appendChild(bookHeader);
    card.appendChild(bookInfo);
    return card;
}

function makeBookImageElement(e) {
    let img = document.createElement('img')
    img.src = e.image;
    img.classList.add('bookImage')
    return img;
}

displayLibrary(myLibrary);

//This section deals with the Add Book Form popup
const bookForm = document.getElementById('addBookForm');
const bookFormDiv = document.querySelector('.form-popup');

function openForm() {
    bookFormDiv.style.display='block';
    document.querySelector('.main').style.opacity = '0.5'
}

function closeForm() {
    bookFormDiv.style.display='none';
    document.querySelector('.main').style.opacity = null;

}

//When form is submitted, create a new Book element and add it to myLibrary
bookForm.addEventListener('submit', submitNewBook);

function createNewBook(e) {
    let formElements = bookForm.elements;
    let author = formElements['author'].value;
    let title = formElements['title'].value;
    let pages = formElements['pages'].value;
    clearForm(formElements);
    return new Book(title, author, pages);
}

function clearForm(elementList) {
    for (const e of elementList) {
        e.value = '';
    }
}

function submitNewBook(e) {
    e.preventDefault();
    let newBook = createNewBook(e);
    closeForm();
    addBookToLibrary(newBook)
    displayLibrary(myLibrary);
}

//changing the status of read
let readBtns = document.querySelectorAll('.bookRead');
readBtns.addEventListener('click', changeReadStatus);

function changeReadStatus(e) {
    let parent = e.target.parent;
    console.log(parent)
}