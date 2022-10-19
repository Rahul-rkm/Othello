// import botMove from "./app.js";
// botMove()

// 1. get all the elements 
//    header, player-points, bot-points, grid-items, modal, action-button
const playerPoints = document.querySelector("#player-points");
const botPoints = document.querySelector("#bot-points");
const gridItems = document.querySelectorAll(".board-grid-items");
const modal = document.querySelector("#modal");
const modalAction = document.querySelector("#modal-action");
const overlay = document.querySelector("#overlay");

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

const scores = [0, 0];
let playerTurn = 0; // true and false
let cards = ['⚡', '🔥'];

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
    let directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [-1, -1], [0, -1], [-1, -1]];
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

const getValidMoves = async (board) => {
    let cloneBoard = await JSON.parse(JSON.stringify(board));
    let validMoves = [];
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
            };
            validMoves.push([x, y]);
        }
    }
    return [validMoves, bestMove];
}

// 
// let [moves, best] = await getValidMoves(board);
// console.log(moves)
// console.log(best)
// console.log(idToCord(21));

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
    }
    else {
        alert('😑 Wrong move (not allowed). Plz play correct move. (See ? : Help)')
    }
}

// CONTROLLER ⚙️🛠️

const ClickHandler = (e) => {
    let id = parseInt(e.target.id.slice(4));
    // console.log(e.target);
    // console.log(e.target.id);
    // console.log(id);
    playerMoveHandler(id);
    console.log(board);
    switchTurn();
    render();
    // botMoveHandler()
    // switchTurn();
    // render();

}

gridItems.forEach(item => {
    // let id = item.id.slice(4);
    // console.log(id);
    item.addEventListener('click', ClickHandler);
}
);
