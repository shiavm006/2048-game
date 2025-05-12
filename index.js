class Game2048 {
    constructor() {
        this.gridDisplay = document.querySelector('.grid');
        this.scoreDisplay = document.getElementById('score');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.resultDisplay = document.getElementById('result');
        this.restartButton = document.getElementById('restart-button');
        this.undoButton = document.getElementById('undo-button');
        this.squares = [];
        this.width = 4;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.gameOver = false;
        this.moveHistory = [];
        this.maxUndoSteps = 5;

        this.init();
        this.loadBestScore();
    }

    init() {
        this.createBoard();
        this.addEventListeners();
    }

    loadBestScore() {
        this.bestScoreDisplay.innerHTML = this.bestScore;
    }

    updateBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreDisplay.innerHTML = this.bestScore;
            localStorage.setItem('bestScore', this.bestScore);
        }
    }

    createBoard() {
        this.squares = [];
        this.gridDisplay.innerHTML = '';
        this.score = 0;
        this.scoreDisplay.innerHTML = '0';
        this.gameOver = false;
        this.moveHistory = [];
        this.resultDisplay.innerHTML = '';
        this.undoButton.disabled = true;

        for (let i = 0; i < 16; i++) {
            const square = document.createElement('div');
            square.innerHTML = '0';
            this.gridDisplay.appendChild(square);
            this.squares.push(square);
        }
        this.generate();
        this.generate();
        this.updateTileColors();
    }

    saveGameState() {
        if (this.moveHistory.length >= this.maxUndoSteps) {
            this.moveHistory.shift();
        }
        
        const state = {
            squares: this.squares.map(square => square.innerHTML),
            score: this.score
        };
        
        this.moveHistory.push(state);
        this.undoButton.disabled = false;
    }

    undo() {
        if (this.moveHistory.length === 0) return;
        
        const previousState = this.moveHistory.pop();
        this.score = previousState.score;
        this.scoreDisplay.innerHTML = this.score;
        
        previousState.squares.forEach((value, index) => {
            this.squares[index].innerHTML = value;
        });
        
        this.updateTileColors();
        if (this.moveHistory.length === 0) {
            this.undoButton.disabled = true;
        }
        
        this.gameOver = false;
        this.resultDisplay.innerHTML = '';
    }

    addEventListeners() {
        document.addEventListener('keyup', this.control.bind(this));
        this.restartButton.addEventListener('click', () => this.createBoard());
        this.undoButton.addEventListener('click', () => this.undo());
        
        // Add touch support with minimum swipe distance
        let touchStartX, touchStartY;
        const minSwipeDistance = 50;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, false);

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            let touchEndX = e.changedTouches[0].clientX;
            let touchEndY = e.changedTouches[0].clientY;

            let deltaX = touchEndX - touchStartX;
            let deltaY = touchEndY - touchStartY;

            // Only register as a swipe if the distance is greater than minimum
            if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) this.keyRight();
                    else this.keyLeft();
                } else {
                    if (deltaY > 0) this.keyDown();
                    else this.keyUp();
                }
            }

            touchStartX = null;
            touchStartY = null;
        }, false);
    }

    showScoreAddition(value) {
        const scoreAddition = document.createElement('div');
        scoreAddition.className = 'score-addition';
        scoreAddition.textContent = '+' + value;
        document.querySelector('.current-score').appendChild(scoreAddition);
        
        setTimeout(() => {
            scoreAddition.remove();
        }, 600);
    }

    generate() {
        if (this.gameOver) return;

        const emptySquares = this.squares.filter(square => square.innerHTML === '0');
        if (emptySquares.length > 0) {
            const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            const value = Math.random() < 0.9 ? '2' : '4';
            randomSquare.innerHTML = value;
            randomSquare.classList.add('new-tile');
            
            setTimeout(() => {
                randomSquare.classList.remove('new-tile');
            }, 300);

            this.updateTileColors();
            this.checkForGameOver();
        }
    }

    updateTileColors() {
        this.squares.forEach(square => {
            const value = square.innerHTML;
            square.removeAttribute('data-value');
            if (value !== '0') {
                square.setAttribute('data-value', value);
            }
        });
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 16; i += 4) {
            const row = [
                parseInt(this.squares[i].innerHTML),
                parseInt(this.squares[i + 1].innerHTML),
                parseInt(this.squares[i + 2].innerHTML),
                parseInt(this.squares[i + 3].innerHTML)
            ];
            const originalRow = [...row];
            const filteredRow = row.filter(num => num);
            const missing = 4 - filteredRow.length;
            const zeros = Array(missing).fill(0);
            const newRow = zeros.concat(filteredRow);

            for (let j = 0; j < 4; j++) {
                this.squares[i + j].innerHTML = newRow[j];
            }
            
            if (!moved && JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
                moved = true;
            }
        }
        return moved;
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < 16; i += 4) {
            const row = [
                parseInt(this.squares[i].innerHTML),
                parseInt(this.squares[i + 1].innerHTML),
                parseInt(this.squares[i + 2].innerHTML),
                parseInt(this.squares[i + 3].innerHTML)
            ];
            const originalRow = [...row];
            const filteredRow = row.filter(num => num);
            const missing = 4 - filteredRow.length;
            const zeros = Array(missing).fill(0);
            const newRow = filteredRow.concat(zeros);

            for (let j = 0; j < 4; j++) {
                this.squares[i + j].innerHTML = newRow[j];
            }
            
            if (!moved && JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
                moved = true;
            }
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            const column = [
                parseInt(this.squares[i].innerHTML),
                parseInt(this.squares[i + this.width].innerHTML),
                parseInt(this.squares[i + (this.width * 2)].innerHTML),
                parseInt(this.squares[i + (this.width * 3)].innerHTML)
            ];
            const originalColumn = [...column];
            const filteredColumn = column.filter(num => num);
            const missing = 4 - filteredColumn.length;
            const zeros = Array(missing).fill(0);
            const newColumn = filteredColumn.concat(zeros);

            for (let j = 0; j < 4; j++) {
                this.squares[i + (j * this.width)].innerHTML = newColumn[j];
            }
            
            if (!moved && JSON.stringify(originalColumn) !== JSON.stringify(newColumn)) {
                moved = true;
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            const column = [
                parseInt(this.squares[i].innerHTML),
                parseInt(this.squares[i + this.width].innerHTML),
                parseInt(this.squares[i + (this.width * 2)].innerHTML),
                parseInt(this.squares[i + (this.width * 3)].innerHTML)
            ];
            const originalColumn = [...column];
            const filteredColumn = column.filter(num => num);
            const missing = 4 - filteredColumn.length;
            const zeros = Array(missing).fill(0);
            const newColumn = zeros.concat(filteredColumn);

            for (let j = 0; j < 4; j++) {
                this.squares[i + (j * this.width)].innerHTML = newColumn[j];
            }
            
            if (!moved && JSON.stringify(originalColumn) !== JSON.stringify(newColumn)) {
                moved = true;
            }
        }
        return moved;
    }

    combineRow() {
        let combined = false;
        for (let i = 0; i < 15; i++) {
            if (i % 4 !== 3) {
                const currentValue = parseInt(this.squares[i].innerHTML);
                const nextValue = parseInt(this.squares[i + 1].innerHTML);
                if (currentValue !== 0 && currentValue === nextValue) {
                    const combinedTotal = currentValue * 2;
                    this.squares[i].innerHTML = combinedTotal;
                    this.squares[i + 1].innerHTML = 0;
                    this.score += combinedTotal;
                    this.scoreDisplay.innerHTML = this.score;
                    this.showScoreAddition(combinedTotal);
                    this.updateBestScore();
                    this.squares[i].classList.add('merge');
                    setTimeout(() => {
                        this.squares[i].classList.remove('merge');
                    }, 300);
                    combined = true;
                }
            }
        }
        return combined;
    }

    combineColumn() {
        let combined = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 12; j += 4) {
                const currentValue = parseInt(this.squares[j + i].innerHTML);
                const nextValue = parseInt(this.squares[j + i + 4].innerHTML);
                if (currentValue !== 0 && currentValue === nextValue) {
                    const combinedTotal = currentValue * 2;
                    this.squares[j + i].innerHTML = combinedTotal;
                    this.squares[j + i + 4].innerHTML = 0;
                    this.score += combinedTotal;
                    this.scoreDisplay.innerHTML = this.score;
                    this.showScoreAddition(combinedTotal);
                    this.updateBestScore();
                    this.squares[j + i].classList.add('merge');
                    setTimeout(() => {
                        this.squares[j + i].classList.remove('merge');
                    }, 300);
                    combined = true;
                }
            }
        }
        return combined;
    }

    control(e) {
        if (this.gameOver) return;

        let handled = false;
        switch(e.keyCode) {
            case 37: // Left arrow
                e.preventDefault();
                handled = true;
                this.keyLeft();
                break;
            case 38: // Up arrow
                e.preventDefault();
                handled = true;
                this.keyUp();
                break;
            case 39: // Right arrow
                e.preventDefault();
                handled = true;
                this.keyRight();
                break;
            case 40: // Down arrow
                e.preventDefault();
                handled = true;
                this.keyDown();
                break;
            case 85: // 'U' key for undo
                e.preventDefault();
                handled = true;
                this.undo();
                break;
        }

        if (handled) {
            e.preventDefault();
        }
    }

    makeMove(moveFunction, combineFunction) {
        this.saveGameState();
        let moved = moveFunction.call(this);
        let combined = combineFunction.call(this);
        if (combined) {
            moveFunction.call(this);
        }
        if (moved || combined) {
            this.generate();
        }
        this.updateTileColors();
    }

    keyRight() {
        this.makeMove(this.moveRight, this.combineRow);
    }

    keyLeft() {
        this.makeMove(this.moveLeft, this.combineRow);
    }

    keyUp() {
        this.makeMove(this.moveUp, this.combineColumn);
    }

    keyDown() {
        this.makeMove(this.moveDown, this.combineColumn);
    }

    checkForWin() {
        for (let square of this.squares) {
            if (square.innerHTML === '2048') {
                this.resultDisplay.innerHTML = 'You Win! 🎉 Keep playing to get a higher score!';
                return;
            }
        }
    }

    checkForGameOver() {
        let hasEmptySquare = false;
        let hasPossibleMoves = false;

        // Check for empty squares
        for (let i = 0; i < this.squares.length; i++) {
            if (this.squares[i].innerHTML === '0') {
                hasEmptySquare = true;
                break;
            }
        }

        // Check for possible moves
        if (!hasEmptySquare) {
            for (let i = 0; i < this.squares.length; i++) {
                const current = parseInt(this.squares[i].innerHTML);
                const row = Math.floor(i / this.width);
                const col = i % this.width;

                // Check right
                if (col < this.width - 1) {
                    const right = parseInt(this.squares[i + 1].innerHTML);
                    if (current === right) hasPossibleMoves = true;
                }

                // Check down
                if (row < this.width - 1) {
                    const down = parseInt(this.squares[i + this.width].innerHTML);
                    if (current === down) hasPossibleMoves = true;
                }
            }

            if (!hasPossibleMoves) {
                this.resultDisplay.innerHTML = `Game Over! 😔 Final Score: ${this.score}`;
                this.gameOver = true;
            }
        }
    }
}

// Start the game
const game = new Game2048();