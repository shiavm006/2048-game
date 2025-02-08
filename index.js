const gridDisplay = document.querySelector('.grid')
  const scoreDisplay = document.getElementById('score')
  const resultDisplay = document.getElementById('result')
  let squares = []
  const width = 4
  let score = 0


function createBoard() {
  for (let i = 0; i < 16; i++) {
    let square = document.createElement('div');
    square.innerHTML = 0;
    gridDisplay.appendChild(square);
    squares.push(square);
  }
  generate(); 
  generate();
}
createBoard();

function generate() {
  let emptySquares = squares.filter(square => square.innerHTML == '0');
  if (emptySquares.length > 0) {
    let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    randomSquare.innerHTML = Math.random() < 0.9 ? '2' : '4';
  }
checkForGameOver()
}

  function shiftRight() {
    for (let i=0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML
        let totalTwo = squares[i+1].innerHTML
        let totalThree = squares[i+2].innerHTML
        let totalFour = squares[i+3].innerHTML
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

        let filteredRow = row.filter(num => num)
        let missing = 4 - filteredRow.length
        let zeros = Array(missing).fill(0)
        let newRow = zeros.concat(filteredRow)

        squares[i].innerHTML = newRow[0]
        squares[i +1].innerHTML = newRow[1]
        squares[i +2].innerHTML = newRow[2]
        squares[i +3].innerHTML = newRow[3]
      }
    }
  }

  function shiftLeft() {
    for (let i=0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML
        let totalTwo = squares[i+1].innerHTML
        let totalThree = squares[i+2].innerHTML
        let totalFour = squares[i+3].innerHTML
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

        let filteredRow = row.filter(num => num)
        let missing = 4 - filteredRow.length
        let zeros = Array(missing).fill(0)
        let newRow = filteredRow.concat(zeros)

        squares[i].innerHTML = newRow[0]
        squares[i +1].innerHTML = newRow[1]
        squares[i +2].innerHTML = newRow[2]
        squares[i +3].innerHTML = newRow[3]
      }
    }
  }


  function shiftUp() {
    for (let i=0; i < 4; i++) {
      let totalOne = squares[i].innerHTML
      let totalTwo = squares[i+width].innerHTML
      let totalThree = squares[i+(width*2)].innerHTML
      let totalFour = squares[i+(width*3)].innerHTML
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

      let filteredColumn = column.filter(num => num)
      let missing = 4 - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = filteredColumn.concat(zeros)

      squares[i].innerHTML = newColumn[0]
      squares[i +width].innerHTML = newColumn[1]
      squares[i+(width*2)].innerHTML = newColumn[2]
      squares[i+(width*3)].innerHTML = newColumn[3]
    }
  }


 function shiftDown() {
    for (let i=0; i < 4; i++) {
      let totalOne = squares[i].innerHTML
      let totalTwo = squares[i+width].innerHTML
      let totalThree = squares[i+(width*2)].innerHTML
      let totalFour = squares[i+(width*3)].innerHTML
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

      let filteredColumn = column.filter(num => num)
      let missing = 4 - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = zeros.concat(filteredColumn)

      squares[i].innerHTML = newColumn[0]
      squares[i +width].innerHTML = newColumn[1]
      squares[i+(width*2)].innerHTML = newColumn[2]
      squares[i+(width*3)].innerHTML = newColumn[3]
    }
  }


function combineRow() {
  for (let i = 0; i < 15; i++) {
    if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML !== '0') {
      let combinedTotal = parseInt(squares[i].innerHTML) * 2;
      squares[i].innerHTML = combinedTotal;
      squares[i + 1].innerHTML = 0;
      score += combinedTotal;
      scoreDisplay.innerHTML = score;
    }
  }
    checkForWin();
}


function combineColumn() {
  for (let i = 0; i < 4; i++) { 
    for (let j = 0; j < 12; j += 4) { 
      if (squares[j + i].innerHTML === squares[j + i + 4].innerHTML && squares[j + i].innerHTML !== '0') {
        let combinedTotal = parseInt(squares[j + i].innerHTML) * 2;
        squares[j + i].innerHTML = combinedTotal; 
        squares[j + i + 4].innerHTML = '0'; 
        score += combinedTotal; 
        scoreDisplay.innerHTML = score;
      }
    }
  }
    checkForWin();
}


function checkForGameOver() {
  let noMovesLeft = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].innerHTML === '0') {
      noMovesLeft = false; 
      break;
    }
  }

  if (noMovesLeft) {
    for (let i = 0; i < squares.length; i++) {
      const current = parseInt(squares[i].innerHTML);
      const row = Math.floor(i / width);
      const col = i % width;


      if (col < width - 1) { 
        const right = parseInt(squares[i + 1].innerHTML);
        if (current === right) {
          noMovesLeft = false;
          break;
        }
      }


      if (row < width - 1) { 
        const down = parseInt(squares[i + width].innerHTML);
        if (current === down) {
          noMovesLeft = false;
          break;
        }
      }


      if (col > 0) { 
        const left = parseInt(squares[i - 1].innerHTML);
        if (current === left) {
          noMovesLeft = false;
          break;
        }
      }


      if (row > 0) { 
        const up = parseInt(squares[i - width].innerHTML);
        if (current === up) {
          noMovesLeft = false;
          break;
        }
      }
    }
  }

  if (noMovesLeft) {
    resultDisplay.innerHTML = 'Game Over!';
    document.removeEventListener('keyup', control);
  }
}


  function control(e) {
    if(e.keyCode === 37) {
      keyLeft()
    } else if (e.keyCode === 38) {
      keyUp()
    } else if (e.keyCode === 39) {
      keyRight()
    } else if (e.keyCode === 40) {
      keyDown()
    }
  }
   document.addEventListener('keyup', control);

  function keyRight() {
    shiftRight()
    combineRow()
    shiftRight()
    generate()
  }

  function keyLeft() {
    shiftLeft()
    combineRow()
    shiftLeft()
    generate()
  }

  function keyUp() {
    shiftUp()
    combineColumn()
    shiftUp()
    generate()
  }

  function keyDown() {
    shiftDown()
    combineColumn()
    shiftDown()
    generate()
  }


function checkForWin() {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].innerHTML == 2048) {
      resultDisplay.innerHTML = 'YOU WIN';
      document.removeEventListener('keyup', control);
      break;
    }
  }
}


function restartGame() {
  gridDisplay.innerHTML = '';
  squares = [];
  score = 0;
  scoreDisplay.innerHTML = score;
  resultDisplay.innerHTML = 'Join the numbers and get to the 2048 tile!';
  createBoard();
  document.addEventListener('keyup', control);
}

const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', restartGame);