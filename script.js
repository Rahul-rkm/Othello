// 1. get all the elements 
//    header, player-points, bot-points, grid-items, modal, action-button
const playerPoints = document.querySelector("#player-points");
const botPoints = document.querySelector("#bot-points");
const turn = document.querySelector("#turn");
const gridItems = document.querySelectorAll(".board-grid-items");
const modal = document.querySelector("#modal");
const modalHeader = document.querySelector("#modal-header");
const modalMsg = document.querySelector("#modal-msg");
const modalAction = document.querySelector("#modal-action");
const overlay = document.querySelector("#overlay");
const about = document.querySelector("#about");

// MODEL 📜 
// const board = [...new Array(8).fill([...new Array(8).fill(' ')])]; 
const board = [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
]

let scores = [2, 2];
let playerTurn = 0; // true and false
let cards = ['⚡', '🔥'];
// let cards = ['👑', '😎'];

board[3][3] = cards[0];
board[3][4] = cards[1];
board[4][3] = cards[1];
board[4][4] = cards[0];
// TODO : MODAL data

function switchTurn() {
    playerTurn = Number(!playerTurn);
}


// VIEW 💻👀👁‍🗨

// Setting the icon for players
playerPoints.innerText += ` ${cards[0]}`;
botPoints.innerText += ` ${cards[1]}`;

function render() {
    turn.innerText = (playerTurn === 0) ? "Player's 😀 turn" : "Bot's 🤖 turn";
    playerPoints.innerText = `Player's ${cards[0]} score: ${scores[0]}`;
    botPoints.innerText = `Bot's ${cards[1]} score: ${scores[1]}`;
    gridItems.forEach(tile => {
        // console.log(parseInt(tile.id.slice(4)));
        let [row, column] = idToCord(parseInt(tile.id.slice(4)));
        tile.innerText = board[row - 1][column - 1];

    })
}

render();

// CONTROLLER HELPERS 🤝 👍
function idToCord(id) {
    let row = Math.floor((id - 1) / 8) + 1;
    let column = (id - 1) % 8 + 1;
    return [row, column];
}

function cordToIndices([row, column]) {
    return [row - 1, column - 1];
}


const isValidMove = (id) => {
    let [row, column] = idToCord(id);
    let tilesToFlip = [];
    /// Directions : Top, TRC, RIGHT, BRC, Bottom, BLC, Left, TLC
    let directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    let i = row - 1; let j = column - 1;
    if (board[i][j] !== ' ') return [];
    directions.forEach(dir => {
        // explore in the direction till we get ' ' or our card or boundary
        i = row - 1; j = column - 1;
        i += dir[0]; j += dir[1];
        let temp = [];
        while (i < 8 && i >= 0 && j < 8 && j >= 0 && board[i][j] === cards[Number(!playerTurn)]) {
            temp.push([i, j]);
            i += dir[0]; j += dir[1];
        }
        if (i < 8 && i >= 0 && j < 8 && j >= 0 && board[i][j] === cards[playerTurn]) {
            tilesToFlip.push(...temp);
        }
    })

    return tilesToFlip;// this returns an array of corodinate indices [ [i,j], [i,j]...]
}

const getBestMove = async (board) => {
    let cloneBoard = await JSON.parse(JSON.stringify(board));
    let tilesToFlip = [];
    let maxLen = 0;
    let bestMove = [];
    for (let i = 1; i < 65; i++) {

        let [row, column] = idToCord(i);
        let [x, y] = [row - 1, column - 1];
        if (cloneBoard[x][y] !== ' ') {
            continue;
        }

        let temp = isValidMove(i);
        if (temp.length > 0) {
            if (temp.length > maxLen) {
                maxLen = temp.length;
                bestMove = [x, y];
                tilesToFlip = temp;
            };
        }
    }
    return [tilesToFlip, bestMove];
}


const getValidMoves = async (board) => {
    let cloneBoard = await JSON.parse(JSON.stringify(board));
    let validMoves = [];
    let flipNum = [];
    // let maxLen = 0;
    // let bestMove = [];
    for (let i = 1; i < 65; i++) {
        let [row, column] = idToCord(i);
        let [x, y] = [row - 1, column - 1];
        if (cloneBoard[x][y] !== ' ') {
            continue;
        }

        let temp = isValidMove(i);
        if (temp.length > 0) {
            validMoves.push([x, y]);
            flipNum.push(temp.length);
        }
    }
    return [validMoves, flipNum];
}


// Player's move handler => Part of MODEL : modifies the state. 
const playerMoveHandler = (id) => {
    let tilesToFlip = isValidMove(id);
    if (tilesToFlip.length > 0) {
        // first put the player's card to the position
        let [row, column] = idToCord(id);
        board[row - 1][column - 1] = cards[playerTurn];
        // flip the cards to each co-ordinate in tilesToflip
        tilesToFlip.forEach(tile => {
            board[tile[0]][tile[1]] = cards[playerTurn];
        })
        switchTurn();
    }
    else {
        alert('😑 Wrong move (not allowed). Plz play correct move. (See ? : Help)');
        return null;
    }
}

const updateScore = () => {
    let count = [0, 0];
    for (let i = 1; i < 65; i++) {
        let [row, column] = idToCord(i);
        if (board[row - 1][column - 1] === cards[0]) {
            count[0]++;
        }
        else if (board[row - 1][column - 1] === cards[1])
            count[1]++;

    }
    scores[0] = count[0];
    scores[1] = count[1];

}

const botMove = async () => {
    let [tilesToFlip, bestMove] = await getBestMove(board);
    // making actual change to the board state
    board[bestMove[0]][bestMove[1]] = cards[playerTurn];
    tilesToFlip.forEach(move => {
        board[move[0]][move[1]] = cards[playerTurn];
    })
    // doing click just for that bgcolor effect. 
    let bestPosId = bestMove[0] * 8 + bestMove[1] + 1;
    let el = document.querySelector(`#pos-${bestPosId}`); // turn = 1
    el.click();
    switchTurn();
}


function resetGame() {
    modal.classList.add('active');
    overlay.classList.add('active');
    if (scores[0] > scores[1]) {
        // Player won 
        modalHeader.innerHTML = `<h3>
        You won! <br> ${scores[0]} - ${scores[1]}</h3> <div>🌟✨🎉 🏆 ✨🎉🌟</div> `;
        // let gif = `<iframe src="https://giphy.com/embed/111ebonMs90YLu" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`
        let gif = `<iframe src="https://giphy.com/embed/o75ajIFH0QnQC3nCeD" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`
        let message = `${gif}`;
        modalMsg.innerHTML = message;
        modalAction.innerText = 'Play Again 😎';
    }
    else if (scores[1] > scores[0]) {
        // Bot has won
        modalHeader.innerHTML = `<h3>Bot 🤖 has defeated you. <br> ${scores[0]} - ${scores[1]} </h3> Try harder 💪 `;
        // let gif = `<iframe src="https://giphy.com/embed/mIZ9rPeMKefm0" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`
        let gif = `<iframe src="https://giphy.com/embed/PhR99fbNjhAAzopGnm" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`

        let message = ` ${gif}`;
        modalMsg.innerHTML = message;
        modalAction.innerText = 'Play Again 💪';
    }

}

function restartGame() {
    for (let i = 0; i < 8; i++) {
        board[i] = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    }
    board[3][3] = cards[0];
    board[3][4] = cards[1];
    board[4][3] = cards[1];
    board[4][4] = cards[0];
    playerTurn = 0;
    scores = [2, 2];
    modalMsg.innerHTML = '';
    modal.classList.remove('active')
    overlay.classList.remove('active');
    render();
}


// CONTROLLER ⚙️🛠️

const ClickHandler = async (e) => {

    if (playerTurn === 0) {
        let id = parseInt(e.target.id.slice(4)); // turn =0
        if (playerMoveHandler(id) === null) return;
        // console.log(board); // turn = 1
        updateScore();
        render();
        turn.click();

        // Bot's move
        setTimeout(async () => {
            let [validMoves, flipNum] = await getValidMoves(board);
            let canBotMove = true;
            if (validMoves.length > 0) {
                await botMove();
                // console.log(board);
                updateScore(); // turn = 0
                render();
                turn.click();
            }
            else {
                canBotMove = false;
                alert(`Bot has no legal possible moves. `);
                switchTurn(); // turn = 0
            }
            [validMoves, flipNum] = await getValidMoves(board);
            // console.log(validMoves);
            if (validMoves.length === 0 && canBotMove === false) {
                alert('You also have no possible moves. Game ends 🔚');
                resetGame();
            }
            else if (validMoves.length === 0) {
                alert('You have no possible moves.');
                switchTurn();
                [validMoves, flipNum] = await getValidMoves(board);
                if (validMoves.length === 0) {
                    alert('Bot also has no possible moves. Game ends 🔚');
                    resetGame();
                }
            }
        }, 1500); // 1.5s delay for bot move

    }
}

// About handler
const aboutHandler = () => {
    modal.classList.add("active");
    overlay.classList.add("active");
    // 1. Header : built by 2. message: learn how to play. 3. close 
    modalHeader.innerHTML = `<a href="https://www.youtube.com/watch?v=xDnYEOsjZnM" target="_blank">Learn how to play</a>`;
    modalMsg.innerHTML = `<h3>Made by Rahul 😎</h3>`
    modalAction.innerText = 'Close';
}

// Animate the bgcolor if innerContent changes
function changimation(e) {
    e.target.classList.add('changimate');
    setTimeout(() => {
        e.target.classList.remove('changimate')
    }, 1000);
}
// Animate the bgcolor if player's turn changes
function sizeanimation(e) {
    e.target.classList.add('sizeanimate');
    setTimeout(() => {
        e.target.classList.remove('sizeanimate')
    }, 1000);
}

gridItems.forEach(item => {
    // let id = item.id.slice(4);
    // console.log(id);
    item.addEventListener('click', changimation);
    item.addEventListener('click', ClickHandler);
}
);

turn.addEventListener('click', changimation);
modalAction.addEventListener('click', restartGame);
about.addEventListener('click', aboutHandler)
// Test
// modal.classList.add('active');