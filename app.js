function makeEl(tag, className, text = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
}


const ICONS = ['⭐', '💎', '🚀', '🔥', '⚡', '🌙', '🔮', '🍀'];
let flippedCards = []; 
let matchedPairs = 0;  
let moves = 0;         
let isBoardLocked = false; 
let mismatchTimeout = null; 


let movesEl, pairsEl, boardEl;


function initApp() {
   
    const header = makeEl('header');
    
    const newGameBtn = makeEl('button', '', 'Новая игра');
    newGameBtn.addEventListener('click', startNewGame);
    
    const leaderboardBtn = makeEl('button', '', 'Таблица лидеров');
    leaderboardBtn.addEventListener('click', showLeaderboard);
    
    header.appendChild(newGameBtn);
    header.appendChild(leaderboardBtn);

   
    const stats = makeEl('div', 'stats');
    movesEl = makeEl('span', '', 'Ходы: 0');
    pairsEl = makeEl('span', '', 'Пары: 0 / 8');
    stats.appendChild(movesEl);
    stats.appendChild(pairsEl);

    
    boardEl = makeEl('div', 'board');

    
    const appContainer = makeEl('div');
    appContainer.id = 'app';
    appContainer.appendChild(header);
    appContainer.appendChild(stats);
    appContainer.appendChild(boardEl);
    
    document.body.appendChild(appContainer);

    
    startNewGame();
}


function startNewGame() {
    closeModal(); 
    
  
    if (mismatchTimeout) {
        clearTimeout(mismatchTimeout);
        mismatchTimeout = null;
    }

  
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    isBoardLocked = false;
    updateStats();

    
    while (boardEl.firstChild) {
        boardEl.removeChild(boardEl.firstChild);
    }

   
    const cardsData = [...ICONS, ...ICONS]; 
    
    
    for (let i = cardsData.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsData[i], cardsData[j]] = [cardsData[j], cardsData[i]];
    }

    
    cardsData.forEach(icon => {
        const card = createCard(icon);
        boardEl.appendChild(card);
    });
}


function createCard(icon) {
    const card = makeEl('div', 'card');
    card.dataset.icon = icon; 
    
    const cardInner = makeEl('div', 'card-inner');
    const cardFront = makeEl('div', 'card-front');
    const cardBack = makeEl('div', 'card-back', icon); 
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
   
    card.addEventListener('click', () => handleCardClick(card));
    
    return card;
}


function handleCardClick(card) {
    
    if (isBoardLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

  
    card.classList.add('flipped');
    flippedCards.push(card); 

    
    if (flippedCards.length === 2) {
        moves++;
        // updateStats();
        checkMatch();
    }
}

function checkMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    if (card1.dataset.icon === card2.dataset.icon) {
    
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = []; 

        updateStats();
        
        
        if (matchedPairs === 8) {
            saveResult(moves);
            setTimeout(() => showWinModal(moves), 500);
        }
    } else {
    
        isBoardLocked = true; 
        updateStats();
        
        mismatchTimeout = setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = []; 
            isBoardLocked = false; 
        }, 1000);
    }
}
