document.addEventListener("DOMContentLoaded", () => {
    header();
    createBoard();
    createFigures();

    document.addEventListener("click", (event) => {
        if (!event.target.classList.contains("figure") && !event.target.classList.contains("red")) {
            clearHighlights();
        }
    });
});

function header() {
    const h = document.querySelector("#head");
    const el = document.createElement("h1");
    el.textContent = "Шахматная доска";
    h.appendChild(el);
    el.setAttribute("class", "header");
}

const boardContainer = document.querySelector("#board");
const figureContainer = document.querySelector("#figure");

function createBoard() {
    const board = document.createElement("table");

    for (let i = 0; i < 8; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < 8; j++) {
            const td = document.createElement("td");
            td.className = (i + j) % 2 === 0 ? "white" : "black";
            td.addEventListener("dragover", dragOver);
            td.addEventListener("drop", drop);
            td.addEventListener("click", (event) => {
                event.stopPropagation();
                handleBoardClick(td, i, j);
            });
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }

    boardContainer.appendChild(board);
}

const figures = [
    { type: "♜", color: "black" }, { type: "♞", color: "black" }, { type: "♝", color: "black" },
    { type: "♛", color: "black" }, { type: "♚", color: "black" }, { type: "♝", color: "black" },
    { type: "♞", color: "black" }, { type: "♜", color: "black" },
    { type: "♙", color: "black" }, { type: "♙", color: "black" }
];

function createFigures() {
    figures.forEach((figure) => {
        const div = document.createElement("div");
        div.className = "figure";
        div.textContent = figure.type;
        div.dataset.type = figure.type;
        div.dataset.color = figure.color;
        div.draggable = true;

        div.addEventListener("dragstart", dragStart);
        div.addEventListener("dragend", dragEnd);

        figureContainer.appendChild(div); // Размещаем все фигуры на полоске начальной позиции
    });
}

let selectedFigure = null;

function dragStart(event) {
    selectedFigure = event.target;
    setTimeout(() => {
        selectedFigure.style.display = "none";
    }, 0);
}

function dragEnd() {
    setTimeout(() => {
        selectedFigure.style.display = "block";
        selectedFigure = null;
    }, 0);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const target = event.target;

    // Перемещение фигуры на доску
    if (selectedFigure && target.tagName === "TD" && !target.querySelector(".figure")) {
        target.appendChild(selectedFigure);
        clearHighlights();
    }
    // Перемещение фигуры с доски на начальную позицию
    else if (selectedFigure && target === figureContainer) {
        figureContainer.appendChild(selectedFigure);
        selectedFigure.style.position = "";
        clearHighlights();
    }
}

function handleBoardClick(td, row, col) {
    if (td.querySelector(".figure")) {
        showMoves(td, row, col);
    }
}

function showMoves(td, row, col) {
    clearHighlights();
    const type = td.querySelector(".figure").dataset.type;

    const moves = getMoves(type, row, col);
    moves.forEach(([r, c]) => {
        const cell = boardContainer.querySelector(`table tr:nth-child(${r + 1}) td:nth-child(${c + 1})`);
        if (cell && !cell.querySelector(".figure")) {
            cell.classList.add("red");
        }
    });
}

function getMoves(type, row, col) {
    const moves = [];
    switch (type) {
        case "♜": // Ладья
            for (let i = 0; i < 8; i++) {
                if (i !== col) moves.push([row, i]);
                if (i !== row) moves.push([i, col]);
            }
            break;
        case "♞": // Конь
            moves.push([row - 2, col - 1], [row - 2, col + 1], [row + 2, col - 1], [row + 2, col + 1]);
            moves.push([row - 1, col - 2], [row - 1, col + 2], [row + 1, col - 2], [row + 1, col + 2]);
            break;
        case "♝": // Слон
            for (let i = 1; i < 8; i++) {
                moves.push([row + i, col + i], [row + i, col - i], [row - i, col + i], [row - i, col - i]);
            }
            break;
        case "♛": // Ферзь
            for (let i = 0; i < 8; i++) {
                if (i !== col) moves.push([row, i]);
                if (i !== row) moves.push([i, col]);
            }
            for (let i = 1; i < 8; i++) {
                moves.push([row + i, col + i], [row + i, col - i], [row - i, col + i], [row - i, col - i]);
            }
            break;
        case "♚": // Король
            moves.push([row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]);
            moves.push([row + 1, col + 1], [row + 1, col - 1], [row - 1, col + 1], [row - 1, col - 1]);
            break;
        case "♙": // Пешка
            moves.push([row - 1, col]);
            if (row === 6) moves.push([row - 2, col]);
            break;
    }
    return moves.filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);
}

function clearHighlights() {
    document.querySelectorAll(".red").forEach(cell => cell.classList.remove("red"));
}

function clearBoard() {
    document.querySelectorAll("#board .figure").forEach(figure => {
        figureContainer.appendChild(figure); // Переносим фигуру обратно на полоску начальной позиции
        figure.style.position = ""; // Сбрасываем позиционирование, если оно было изменено
    });
    clearHighlights(); // Сбрасываем подсветку
}

const clearButtonContainer = document.createElement("div");
clearButtonContainer.classList.add("clear-button-container");

const clearButton = document.createElement("button");
clearButton.textContent = "Очистить доску";
clearButton.classList.add("clear-button");
clearButton.addEventListener("click", clearBoard);

clearButtonContainer.appendChild(clearButton);
document.body.appendChild(clearButtonContainer);