var outer = 10,
    inner = 0,
    tileSize  = null,
    boardSize = null

export function init({windowHeight, windowWidth, maxRows, maxCols}) {
  tileSize = Math.floor((windowHeight - (2 * outer)) / maxRows)
  if ( tileSize % 2 != 0 ) tileSize--
  console.log('tile size is %spx', tileSize)

  boardSize = [
    (2*outer) + (maxCols * (tileSize)),
    (2*outer) + (maxRows * (tileSize))
  ]
}

export function getTileSize() { return tileSize }

export function getBoardSize() { return boardSize }

// Retorna a posição x,y do top/left do tile
export function getPosition(row, col) {
  var x = outer + (col * (tileSize + inner)),
      y = outer + (row * (tileSize + inner))
  return [x,y]
}

export function xyToBoard(x, y) {
  var col = Math.floor((x - outer) / (tileSize + inner)),
      row = Math.floor((y - outer) / (tileSize + inner))
  return [row,col]
}
