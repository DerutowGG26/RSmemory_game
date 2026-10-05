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
