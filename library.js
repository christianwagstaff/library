'use strict';
let Library = (function() {
    let myLibrary = [];

    //Book Object Constructor
    function Book(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = false;
        this.image = 'images/addPhoto.svg';
        this.info = function() {
            return `${this.title} by ${this.author} is ${pages} pages long, it ${this.read ? 'has been read' : 'has not been read'}`
        }
    }

    //cache DOM
    let bookList = document.querySelector('#books');

    //Default Testing Books
    function init() {
        const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 235);
        const harryPotter = new Book('Harry Potter', 'JK Rollings', 367);
        const test1 = new Book('test', 'test2', 235);
        const test2 = new Book('test', 'test1', 235);
        addBookToLibrary(theHobbit);
        addBookToLibrary(harryPotter);
        addBookToLibrary(test1);
        addBookToLibrary(test2);
    };

    init();

    function render() {
        removeChildren(bookList);
        myLibrary.forEach((book, index) => {
            let newBook = bookTemplate.makeCardElement(book);
            newBook.dataset.id = index;
            bookList.appendChild(newBook);
        })
        bookList.appendChild(bookTemplate.createNewBookDiv());
    }

    function addBookToLibrary(book) {
        myLibrary.push(book);
        // render();
    }    

    function removeChildren(parent) {
        while (parent.firstChild) {
            parent.lastChild.remove();
        }
    }

    //using event Delegation to dynamically add event listeners to new books
    bookList.addEventListener('click', changeReadStatus);
    bookList.addEventListener('click', removeBook);

    //changing the status of read
    function changeReadStatus(e) {
        if (eventDelegation(e, 'BUTTON', 'bookRead')) {
            let parentCard = e.target.closest('.card');
            let bookIndex = getBookIndex(parentCard);
            if (!validateBookIndex(parentCard)) {
                //if the dataset id doesn't match the title and author do nothing
                return;
            }
            let book = myLibrary[bookIndex]
            let currentStatus = book.read;
            book.read = !currentStatus //changes read from true to false and visaversa
            e.target.textContent = (currentStatus ? 'Unread' : 'Read');
        }
    }

    //finding the associated myLibrary book based on element selected's title
    //TODO make Book ID feature and connect with that
    function getBookIndex(parentCard) {
        let bookTitle = parentCard.querySelector('.bookTitle').textContent;
        let bookAuthor = parentCard.querySelector('.bookAuthor').textContent;
        let bookIndex = myLibrary.map(b => b['title']+b['author']).indexOf(bookTitle+bookAuthor);
        return bookIndex;
    }

    //TODO change to check if title on card matches info on file
    function validateBookIndex(parent) {
        let bookIndex = getBookIndex(parent);
        let dataIndex = parent.dataset.id;
        return (parseInt(dataIndex) === bookIndex);
    }

    function eventDelegation(event, nodeType, className) {
        //attaching eventListeners to the main books div, checks if target is what we want
        if (event.target && event.target.nodeName === nodeType) {
            if (event.target.classList.contains(className)) {
                return true;
            }
        }
    }

    function removeBook(e) {
        //run event if button with class removeBook is clicked
        if (eventDelegation(e, 'BUTTON', 'removeBook')) {
            let parentCard = e.target.closest('.card');
            let bookIndex = getBookIndex(parentCard);
            if (!validateBookIndex(parentCard)) {
                alert('ERROR! Book ID does not match Book Info')
                return;
            }
            let confirmDelete = confirm(`Do you want to delete ${parentCard.querySelector('.bookTitle').textContent}?`)
            if (confirmDelete) {
                removeByIndex(bookIndex);
                render();
            }
        }
    }

    function removeByIndex(index) {
        if (index > -1) {
            myLibrary.splice(index, 1);
        }
    }

    return {
        addBookToLibrary: addBookToLibrary,
    }
})();

let bookTemplate = (function() {
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
            let ClassArray = Array.from(classID.split(' '));
            for (let classID of ClassArray) {
                elemTag.classList.add(classID);
            }
            // elemTag.classList.add(classID);
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
    
    function createNewBookDiv() {
        let newBookDiv = makeDomElement('div', '', 'newBook card');
        let newBookBtn = makeDomElement('button', '+', 'addNewBook');
        newBookBtn.onclick = openForm;
        newBookDiv.appendChild(newBookBtn);
        return newBookDiv;
    }
    
    function makeBookInfo(e) {
        let x = document.createElement('div');
        let bottomDiv = makeDomElement('div', '', 'cardBottom')
        let bookInfo = makeDomElement('div', '', 'bookInfo')
        let read = makeDomElement('button', (e.read ? 'Read': 'Unread'), 'bookRead');
        let author = makeDomElement('p', e.author, 'bookAuthor');
        let pageLength = makeDomElement('p', e.pages, 'bookPages');
        let bookImage = makeBookImageElement(e);
        addChildrenToDiv(x, author, pageLength)
        addChildrenToDiv(bookInfo, x, read)
        addChildrenToDiv(bottomDiv, bookInfo, bookImage)
        return bottomDiv;
    }

    return {
        createNewBookDiv: createNewBookDiv,
        makeCardElement: makeCardElement,
    }
})();


let libraryPopup = (function() {
    //cache DOM
    const bookForm = document.getElementById('addBookForm');
    const bookFormDiv = document.querySelector('.form-popup');
    const mainSection = document.querySelector('.main')
    const bottomBtn = document.querySelector('.addBook');

    //add Event Listeners
    bookForm.addEventListener('submit', submitNewBook);
    bottomBtn.addEventListener('click', openForm);

    function openForm() {
        bookFormDiv.style.display='block';
        mainSection.style.opacity = '0.5'
    }

    function closeForm() {
        bookFormDiv.style.display='none';
        document.querySelector('.main').style.opacity = null;
    }

    function clearForm(elementList) {
        for (const e of elementList) {
            e.value = '';
        }
    }

    function createNewBook() {
        let formElements = bookForm.elements;
        let author = formElements['author'].value;
        let title = formElements['title'].value;
        let pages = formElements['pages'].value;
        clearForm(formElements);
        return {title, author, pages};
    }

    function submitNewBook(e) {
        e.preventDefault();
        let newBook = createNewBook();
        closeForm();
        addBookToLibrary(newBook)
        displayLibrary(myLibrary);
    }
    
})();