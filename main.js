/* eslint-disable max-lines-per-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */



function setup() {
    loadDictionary();
    initializeGameProps();
    // pickWord();
}

function loadDictionary() {
    const url = 'https://www.mit.edu/~ecprice/wordlist.10000';
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    fetch(proxyurl + url)
        .then((response) => response.text())
        .then((contents) => {
            // split into list
            document.dict = contents.split('\n');

            // remove empty word
            document.dict.pop();

            pickWord();
        })
        .catch(() => console.log(`Can’t access ${ url } response. Blocked by browser?`));
}

function playAgain() {
    initializeGameProps();
    pickWord();
}

function initializeGameProps() {
    document.words = [];
    document.after = [];
    document.before = [];
    document.getElementById('inputBox').disabled = '';
    document.getElementById('inputBox').placeholder = 'enter a word!';

    removeWordsFromList();

    hide(document.getElementById('won_screen'));
}

function removeWordsFromList() {
    const beforeWords = document.getElementById('beforeList');
    const afterWords = document.getElementById('afterList');
    removeChildren(beforeWords);
    removeChildren(afterWords);
}

function pickWord() {
    const randomIndex = Math.floor(Math.random() * document.dict.length);
    const selectedWord = document.dict[randomIndex];

    document.selectedWord = selectedWord;
    alert(selectedWord);
}

function removeChildren(child) {
    while (child.hasChildNodes()) {
        child.removeChild(child.firstChild);
    }
}

function inputKeyUp(event) {
    event.preventDefault();
    if (event.key === 'Enter') {
        enterWord();
    }
}

function recreateList() {
    removeWordsFromList();

    const createListOfWords = (words, list) => {
        words.forEach((word) => {
            const newListItem = document.createElement('li');
            newListItem.innerText = word;
            list.appendChild(newListItem);
        });
    };

    const beforeWordsList = document.createElement('ul');
    const afterWordsList = document.createElement('ul');

    createListOfWords(document.before, beforeWordsList);
    createListOfWords(document.after, afterWordsList);

    const beforeWords = document.getElementById('beforeList');
    const afterWords = document.getElementById('afterList');
    beforeWords.appendChild(beforeWordsList);
    afterWords.appendChild(afterWordsList);
}

function hide(elem) {
    elem.style.display = 'none';
}

function show(elem) {
    elem.style.display = '';
}

function gameWon() {
    show(document.getElementById('won_screen'));
    clearWordFromInput();
    document.getElementById('inputBox').disabled = 'true';
    document.getElementById('inputBox').placeholder = '';
}

function clearWordFromInput() {
    const word = document.getElementById('inputBox').value;
    document.getElementById('inputBox').value = '';
    return word;
}

function enterWord() {
    const word = clearWordFromInput();
    const index = new String(document.selectedWord).localeCompare(word);

    // after
    if (index > 0) {
        document.after.push(word);
        document.after.sort();
    }

    // before
    else if (index < 0) {
        document.before.push(word);
        document.before.sort();
    }

    // word guessed correctly
    else {
        gameWon();
        return;
    }

    // add word to list of entered words
    document.words.push(word);
    document.words.sort();

    // show list of entered words
    recreateList();
}